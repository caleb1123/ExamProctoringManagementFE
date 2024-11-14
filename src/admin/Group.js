import React, { useEffect, useState } from "react";
import "./Group.css"; // Import room.css for styling

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [selectedRoom, setSelectedRoom] = useState(null); // To store the selected room
  const [newGroupId, setNewGroupId] = useState(""); // To store the new group ID
  const [rooms, setRooms] = useState([]); // State to store room data

  useEffect(() => {
    // Fetch data from the Group API
    const fetchGroups = async () => {
      try {
        const response = await fetch("https://examproctoringmanagement.azurewebsites.net/api/Group");
        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }
        const data = await response.json();
        setGroups(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Fetch rooms from the Room API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("https://examproctoringmanagement.azurewebsites.net/api/Room");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        setRooms(data); // Set room data
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupId || !selectedRoom) {
      alert("Please fill out all fields");
      return;
    }

    const requestBody = {
      group: {
        groupId: newGroupId,
      },
      roomId: selectedRoom.roomId,
    };

    try {
      const response = await fetch("https://examproctoringmanagement.azurewebsites.net/api/Group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      const data = await response.json();
      alert("Group created successfully!");
      setShowModal(false); // Close the modal after successful creation
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="subjects-container">
      <h2>Group List</h2>
      {groups.length > 0 ? (
        <table className="subjects-table">
          <thead>
            <tr>
              <th>Group ID</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.groupId}>
                <td>{group.groupId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-subjects">No groups available</div>
      )}

      <button onClick={() => setShowModal(true)}>Create Room</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Group</h3>
            <label>
              Group ID:
              <input
                type="text"
                value={newGroupId}
                onChange={(e) => setNewGroupId(e.target.value)}
                placeholder="Enter group ID"
              />
            </label>
            <label>
              Select Room:
              <select
                value={selectedRoom ? selectedRoom.roomId : ""}
                onChange={(e) => {
                  const selected = rooms.find(room => room.roomId === e.target.value);
                  setSelectedRoom(selected);
                }}
              >
                <option value="">-- Select a Room --</option>
                {rooms.map((room) => (
                  <option key={room.roomId} value={room.roomId}>
                    {room.roomName}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={handleCreateGroup}>Create</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Group;
