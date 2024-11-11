import React, { useEffect, useState } from 'react';
import './Room.css';  // Import the CSS file for styling

const Room = () => {
    const [rooms, setRooms] = useState([]);  // State to store room data
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // Error state to handle API errors

    useEffect(() => {
        // Fetch rooms data from the API using fetch
        fetch('https://examproctoringmanagement.azurewebsites.net/api/Room')
            .then((response) => response.json())
            .then((data) => {
                setRooms(data);  // Set the rooms data from the API response
                setLoading(false);  // Set loading to false once data is fetched
            })
            .catch((err) => {
                setError('Error fetching rooms data');  // Handle errors
                setLoading(false);  // Set loading to false on error
            });
    }, []);  // Empty array ensures this effect runs only once when the component mounts

    // Render loading, error, or the room list
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (rooms.length === 0) return <div className="no-rooms">No rooms available</div>;

    return (
        <div className="rooms-container">
            <h2>Rooms List</h2>

            {/* Table of rooms */}
            <table className="rooms-table">
                <thead>
                    <tr>
                        <th>Room ID</th>
                        <th>Room Name</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.roomId}>
                            <td>{room.roomId}</td>
                            <td>{room.roomName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Room;
