import React, { useEffect, useState } from 'react';
import './Room.css';

const Room = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roomData, setRoomData] = useState({ roomId: '', group: { groupId: '' } });
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = () => {
        fetch('https://examproctoringmanagement.azurewebsites.net/api/Room')
            .then((response) => response.json())
            .then((data) => {
                setRooms(data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Error fetching rooms data');
                setLoading(false);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditButtonClick = (room) => {
        setRoomData({ roomId: room.roomId, roomName: room.roomName });
        setIsEditing(true);
        setShowModal(true);  // Open modal for editing
    };
    

    const handleGroupIdChange = (e) => {
        setRoomData((prevData) => ({
            ...prevData,
            group: { ...prevData.group, groupId: e.target.value },
        }));
    };

    const handleCreateGroup = () => {
        fetch('https://examproctoringmanagement.azurewebsites.net/api/Group/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomData),
        })
            .then((response) => response.json())
            .then((newGroup) => {
                console.log('Group created successfully:', newGroup);
                setRoomData({ roomId: '', group: { groupId: '' } });
                setShowModal(false);
            })
            .catch((err) => console.error('Error creating group:', err));
    };

    const handleCreateButtonClick = () => {
        setRoomData({ roomId: '', group: { groupId: '' } });
        setIsEditing(false);
        setShowModal(true);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="rooms-container">
            <h2>Rooms List</h2>
            
            <button onClick={handleCreateButtonClick} className="create-btn">Create Group</button>

            <table className="rooms-table">
                <thead>
                    <tr>
                        <th>Room ID</th>
                        <th>Room Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.roomId}>
                            <td>{room.roomId}</td>
                            <td>{room.roomName}</td>
                            <td>
                                <button onClick={() => handleEditButtonClick(room)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for Create Group */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Create Group</h3>
                        <form>
                            <div className="form-group">
                                <label htmlFor="groupId">Group ID:</label>
                                <input
                                    type="text"
                                    id="groupId"
                                    name="groupId"
                                    value={roomData.group.groupId}
                                    onChange={handleGroupIdChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="roomId">Select Room:</label>
                                <select
                                    id="roomId"
                                    name="roomId"
                                    value={roomData.roomId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select a room</option>
                                    {rooms.map((room) => (
                                        <option key={room.roomId} value={room.roomId}>
                                            {room.roomName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={handleCreateGroup}>
                                    Create Group
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Room;
