import React, { useState, useEffect } from 'react';
import './User.css'; // Optional: Use CSS for styling

const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('fullName'); // Default search category
    const [statusFilter, setStatusFilter] = useState('all'); // Default to show all users

    // Fetch users from the API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Users/all');
                const data = await response.json();
                setUsers(data); // Set users from the API response
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = user[searchCategory]?.toLowerCase().includes(term);
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.status : !user.status);
        return matchesSearch && matchesStatus;
    });

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
    };

    return (
        <div className="users-container">
            <h2>User Management</h2>

            <div className="search-container">
                <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="filter" /* Class for filter select */
                >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <div className="search-section"> {/* Wrap search select and input together */}
                    <select
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="search" /* Class for search select */
                    >
                        <option value="fullName">Full Name</option>
                        <option value="userName">Username</option>
                        <option value="email">Email</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>







            <table className="users-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Username</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Main Major</th>
                        <th>Address</th>
                        <th>Gender</th>
                        <th>Date of Birth</th>
                        <th>Phone Number</th>
                        <th>Role ID</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={user.userId}>
                            <td>{index + 1}</td>
                            <td>{user.userName}</td>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{user.mainMajor || 'N/A'}</td>
                            <td>{user.address}</td>
                            <td>{user.gender ? 'Male' : 'Female'}</td>
                            <td>{user.doB}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.roleId}</td>
                            <td>
                                <span className={`status ${user.status ? 'active' : 'inactive'}`}>
                                    {user.status ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
