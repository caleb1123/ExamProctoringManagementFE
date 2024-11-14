import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SlotReference.css';

const SlotReference = () => {
    const [slots, setSlots] = useState([]);
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await axios.get('https://examproctoringmanagement.azurewebsites.net/api/SlotReference');
                const filteredData = response.data.map(slot => ({
                    slotReferenceId: slot.slotReferenceId,
                    slotId: slot.slotId,
                    roomId: slot.roomId,
                    groupId: slot.groupId
                }));
                setSlots(filteredData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchSlots();
    }, []);

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

            <table className="slot-table">
                <thead>
                    <tr>
                        <th>Slot Reference ID</th>
                        <th>Slot ID</th>
                        <th>Room ID</th>
                        <th>Group ID</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSlots.map(slot => (
                        <tr key={slot.slotReferenceId}>
                            <td>{slot.slotReferenceId}</td>
                            <td>{slot.slotId}</td>
                            <td>{slot.roomId || "N/A"}</td>
                            <td>{slot.groupId || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredSlots.length === 0 && <div className="no-slots">No slots available</div>}
        </div>
    );
};

export default SlotReference;
