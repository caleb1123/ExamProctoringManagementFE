import React, { useEffect, useState } from 'react';
import './Room.css';  // Import the CSS file for styling

const Room = () => {
    const [rooms, setRooms] = useState([]);  // State to store room data
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state to handle API errors
    const [roomData, setRoomData] = useState({ roomId: '', roomName: '' });  // For create and edit forms
    const [isEditing, setIsEditing] = useState(false);  // To toggle between create and edit modes
    const [showModal, setShowModal] = useState(false);  // To toggle the modal visibility

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

    const handleCreate = () => {
        fetch('https://examproctoringmanagement.azurewebsites.net/api/Room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomData),
        })
            .then((response) => response.json())
            .then((newRoom) => {
                setRooms([...rooms, newRoom]);
                setRoomData({ roomId: '', roomName: '' });
                setShowModal(false);  // Close modal after creating
                fetchRooms();  // Fetch updated rooms data
            })
            .catch((err) => console.error('Error creating room:', err));
    };

    const handleEdit = async () => {
        // First, hide the modal
        setShowModal(false);
    
        // Then make the API call
        try {
            const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Room', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roomData),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update room data');
            }
    
            // If the request is successful, clear the form and exit edit mode
            setRoomData({ roomId: '', roomName: '' });
            setIsEditing(false);
            const response1 = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Room');
            setRooms(await response1.json());
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    

    const handleEditButtonClick = (room) => {
        setRoomData({ roomId: room.roomId, roomName: room.roomName });
        setIsEditing(true);
        setShowModal(true);  // Open modal for editing
    };

    const handleCreateButtonClick = () => {
        setRoomData({ roomId: '', roomName: '' });
        setIsEditing(false);
        setShowModal(true);  // Open modal for creating
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (rooms.length === 0) return <div className="no-rooms">No rooms available</div>;

    return (
        <div className="rooms-container">
            <h2>Rooms List</h2>
            
            <button onClick={handleCreateButtonClick} className="create-btn">Create Room</button>

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

            {/* Modal for Create/Edit Room */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{isEditing ? 'Edit Room' : 'Create Room'}</h3>
                        <form>
                            <div className="form-group">
                                <label htmlFor="roomId">Room ID:</label>
                                <input
                                    type="text"
                                    id="roomId"
                                    name="roomId"
                                    value={roomData.roomId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="roomName">Room Name:</label>
                                <input
                                    type="text"
                                    id="roomName"
                                    name="roomName"
                                    value={roomData.roomName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={isEditing ? handleEdit : handleCreate}>
                                    {isEditing ? 'Update Room' : 'Create Room'}
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
