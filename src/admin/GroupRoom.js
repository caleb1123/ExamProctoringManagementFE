import React, { useEffect, useState } from "react";
import "./GroupRoom.css"; // Import room.css for styling

const GroupRoom = () => {
  const [groupRooms, setGroupRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchGroupRooms = async () => {
      try {
        const response = await fetch("https://examproctoringmanagement.azurewebsites.net/api/GroupRoom");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setGroupRooms(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGroupRooms();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="subjects-container">
      <h2>Group Room List</h2>
      {groupRooms.length > 0 ? (
        <table className="subjects-table">
          <thead>
            <tr>
              <th>Group Room ID</th>
              <th>Group ID</th>
              <th>Room ID</th>
            </tr>
          </thead>
          <tbody>
            {groupRooms.map((groupRoom) => (
              <tr key={groupRoom.groupRoomId}>
                <td>{groupRoom.groupRoomId}</td>
                <td>{groupRoom.groupId}</td>
                <td>{groupRoom.roomId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-subjects">No group rooms available</div>
      )}
    </div>
  );
};

export default GroupRoom;
