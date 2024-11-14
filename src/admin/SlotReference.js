import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SlotReference.css';

const SlotReference = () => {
    const [slots, setSlots] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        slotReferenceId: '',
        slotId: '',
        roomId: '',
        groupId: ''
    });
    const [rooms, setRooms] = useState([]);
    const [groups, setGroups] = useState([]);
    const [slotsList, setSlotsList] = useState([]);

    useEffect(() => {
        // Fetch the list of slots, rooms, and groups
        axios.get('https://examproctoringmanagement.azurewebsites.net/api/SlotReference')
            .then(response => setSlots(response.data))
            .catch(error => console.error('Error fetching slots:', error));

        axios.get('https://examproctoringmanagement.azurewebsites.net/api/Room')
            .then(response => setRooms(response.data))
            .catch(error => console.error('Error fetching rooms:', error));

        axios.get('https://examproctoringmanagement.azurewebsites.net/api/Group')
            .then(response => setGroups(response.data))
            .catch(error => console.error('Error fetching groups:', error));

        axios.get('https://examproctoringmanagement.azurewebsites.net/api/Slot')
            .then(response => setSlotsList(response.data))
            .catch(error => console.error('Error fetching slot list:', error));
    }, []);

    const handleCreateEditSubmit = async (e) => {
        e.preventDefault();
        const { slotReferenceId, slotId, roomId, groupId } = formData;
        try {
            if (slotReferenceId) {
                // Update request
                await axios.put('https://examproctoringmanagement.azurewebsites.net/api/SlotReference', formData);
            } else {
                // Create request
                await axios.post('https://examproctoringmanagement.azurewebsites.net/api/SlotReference', formData);
            }
            setModalVisible(false);
            setFormData({ slotReferenceId: '', slotId: '', roomId: '', groupId: '' });
            // Reload slots
            axios.get('https://examproctoringmanagement.azurewebsites.net/api/SlotReference')
                .then(response => setSlots(response.data))
                .catch(error => console.error('Error fetching slots:', error));

        } catch (error) {
            console.error('Error saving slot reference:', error);
        }
    };

    const handleEdit = (slot) => {
        setFormData({ ...slot });
        setModalVisible(true);
    };

    const filteredSlots = slots.filter(slot => {
        if (filterType === "RoomId") {
            return slot.roomId != null;
        }
        if (filterType === "GroupId") {
            return slot.groupId != null;
        }
        return true;
    });

    return (
        <div className="slot-container">
            <h2>Slot References</h2>

            <div className="filter-container">
                <label htmlFor="filterType">Filter by:</label>
                <select
                    id="filterType"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="RoomId">Room ID</option>
                    <option value="GroupId">Group ID</option>
                </select>
            </div>

            <button onClick={() => setModalVisible(true)}>Create Slot Reference</button>

            <table className="slot-table">
                <thead>
                    <tr>
                        <th>Slot Reference ID</th>
                        <th>Slot ID</th>
                        <th>Room ID</th>
                        <th>Group ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSlots.map(slot => (
                        <tr key={slot.slotReferenceId}>
                            <td>{slot.slotReferenceId}</td>
                            <td>{slot.slotId}</td>
                            <td>{slot.roomId || "N/A"}</td>
                            <td>{slot.groupId || "N/A"}</td>
                            <td>
                                <button onClick={() => handleEdit(slot)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{formData.slotReferenceId ? 'Edit Slot Reference' : 'Create Slot Reference'}</h3>
                        <form onSubmit={handleCreateEditSubmit}>
                            <input
                                type="text"
                                name="slotReferenceId"
                                placeholder="Slot Reference ID"
                                value={formData.slotReferenceId}
                                onChange={(e) => setFormData({ ...formData, slotReferenceId: e.target.value })}
                                required
                            />
                            <select
                                name="slotId"
                                value={formData.slotId}
                                onChange={(e) => setFormData({ ...formData, slotId: e.target.value })}
                                required
                            >
                                <option value="">Select Slot ID</option>
                                {slotsList.map(slot => (
                                    <option key={slot.slotId} value={slot.slotId}>{slot.slotId}</option>
                                ))}
                            </select>
                            <select
                                name="roomId"
                                value={formData.roomId}
                                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                required
                            >
                                <option value="">Select Room ID</option>
                                {rooms.map(room => (
                                    <option key={room.roomId} value={room.roomId}>{room.roomId}</option>
                                ))}
                            </select>
                            <select
                                name="groupId"
                                value={formData.groupId}
                                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                                required
                            >
                                <option value="">Select Group ID</option>
                                {groups.map(group => (
                                    <option key={group.groupId} value={group.groupId}>{group.groupId}</option>
                                ))}
                            </select>
                            <button type="submit">{formData.slotReferenceId ? 'Update' : 'Create'}</button>
                            <button type="button" onClick={() => setModalVisible(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlotReference;
