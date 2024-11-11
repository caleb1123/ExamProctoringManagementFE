import React, { useEffect, useState } from "react";
import "./Group.css"; // Import room.css for styling

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchGroups = async () => {
      try {
        const response = await fetch("https://examproctoringmanagement.azurewebsites.net/api/Group");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
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
    </div>
  );
};

export default Group;
