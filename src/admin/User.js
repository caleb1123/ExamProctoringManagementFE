import React, { useState, useEffect } from 'react';
import './User.css'; // Optional: Use CSS for styling

const Users = () => {
    // State to hold the list of users
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('fullName'); // Default search category

    // Simulating fetching users from an API or database
    useEffect(() => {
        const fetchUsers = () => {
            const userList = [
                {
                    userId: '1',
                    userName: 'john_doe',
                    fullName: 'John Doe',
                    email: 'john.doe@example.com',
                    mainMajor: 'Computer Science',
                    address: '123 Main St',
                    gender: true,
                    dob: '2000-05-15',
                    phoneNumber: '123-456-7890',
                    roleId: 1,
                    status: true,
                },
                {
                    userId: '2',
                    userName: 'jane_smith',
                    fullName: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    mainMajor: 'Business Administration',
                    address: '456 Maple Ave',
                    gender: false,
                    dob: '1998-11-20',
                    phoneNumber: '987-654-3210',
                    roleId: 2,
                    status: true,
                },
            ];
            setUsers(userList);
        };

        fetchUsers();
    }, []);

    // Function to handle update action
    const handleUpdate = (userId) => {
        alert(`Update user with ID: ${userId}`);
        // Implement update logic here (e.g., show an update form)
    };

    // Function to handle delete action
    const handleDelete = (userId) => {
        if (window.confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
            setUsers(users.filter(user => user.userId !== userId));
            alert(`User with ID: ${userId} has been deleted.`);
        }
    };

    // Filter users based on the search term and category
    const filteredUsers = users.filter(user => {
        const term = searchTerm.toLowerCase();
        switch (searchCategory) {
            case 'fullName':
                return user.fullName.toLowerCase().includes(term);
            case 'userName':
                return user.userName.toLowerCase().includes(term);
            case 'email':
                return user.email.toLowerCase().includes(term);
            default:
                return true; // No filter
        }
    });

    return (
        <div className="users-container">
            <h2>User Management</h2>

            {/* Search Input */}
            <div className="search-container">
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
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
                        <th>Action</th> {/* New Action Column */}
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={user.userId}>
                            <td>{index + 1}</td> {/* Display row number */}
                            <td>{user.userName}</td>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{user.mainMajor}</td>
                            <td>{user.address}</td>
                            <td>{user.gender ? 'Male' : 'Female'}</td>
                            <td>{user.dob}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.roleId}</td>
                            <td>{user.status ? 'Active' : 'Inactive'}</td>
                            <td>
                                <div className="button-container">
                                    <button onClick={() => handleUpdate(user.userId)}>Update</button>
                                    <button onClick={() => handleDelete(user.userId)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
