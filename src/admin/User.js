import React, { useState, useEffect, useRef } from 'react';
import './User.css';

const Users = () => {
    
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('fullName');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null); // Create a ref for the modal
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
    const [createUser, setCreateUser] = useState({
        userId: '',
        userName: '',
        fullName: '',
        address: '',
        email: '',
        dob: '',
        mainMajor: '',
        phone: '',
        roleId: '1',
        gender: false,
        // Remove `password` and `phoneNumber` if not needed
    });

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Users/all');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Load users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Add event listener to close modal when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleCloseModal();
            }
        };
        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    const filteredUsers = users.filter(user => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = user[searchCategory]?.toLowerCase().includes(term);
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.status : !user.status);
        return matchesSearch && matchesStatus;
    });

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalCreateOpen(false);
        setSelectedUser(null);
    };

    const handleUpdateUser = () => {
        console.log('User updated:', selectedUser);
        handleCloseModal();
    };
    const handleCreateUser = async () => {
        try {
            const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createUser), // Send the form data
            });
            if (response.ok) {
                const data = await response.json();
                console.log('User created:', data);
                // Update the users list and close the modal after successful creation
                setUsers((prevUsers) => [...prevUsers, data]);
                fetchUsers();
                handleCloseModal();
            } else {
                console.error('Error creating user:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isModalCreateOpen) {
            setCreateUser(prevState => ({ ...prevState, [name]: value }));
        } else {
            setSelectedUser(prevState => ({ ...prevState, [name]: value }));
        }
    };

    // Open the create user modal
    const handleCreateUserClick = () => {
        setSelectedUser({}); // Reset selectedUser to an empty object
        setIsModalCreateOpen(true);
    };
    return (
        <div className="users-container">
            <h2>User Management</h2>
            {/* Create User Button */}
            <button onClick={handleCreateUserClick} className="create-button">
                Create User
            </button>
            <div className="search-container">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter">
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <div className="search-section">
                    <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} className="search">
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
                        <tr key={user.userId} onClick={() => handleRowClick(user)}>
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

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" ref={modalRef}>
                        <h3>Edit User</h3>
                        <form>
                            <label>
                                Username:
                                <input
                                    type="text"
                                    name="userName"
                                    value={selectedUser.userName}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Full Name:
                                <input
                                    type="text"
                                    name="fullName"
                                    value={selectedUser.fullName}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Email:
                                <input
                                    type="text"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Main Major:
                                <input
                                    type="text"
                                    name="mainMajor"
                                    value={selectedUser.mainMajor || ''}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Phone Number:
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={selectedUser.phoneNumber || ''}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Role ID:
                                <input
                                    type="text"
                                    name="roleId"
                                    value={selectedUser.roleId || ''}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Status:
                                <select
                                    name="status"
                                    value={selectedUser.status ? 'Active' : 'Inactive'}
                                    onChange={(e) =>
                                        handleInputChange({
                                            target: { name: 'status', value: e.target.value === 'Active' },
                                        })
                                    }
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </label>
                        </form>
                        <div className="modal-buttons">
                            <button onClick={handleUpdateUser}>Update</button>
                            <button onClick={handleCloseModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isModalCreateOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" ref={modalRef}>
                        <h3>Add User</h3>
                        <div className="modal-form">
                            <form>
                                <label>
                                    UserID:
                                    <input
                                        type="text"
                                        name="userId"
                                        value={createUser.userId}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Username:
                                    <input
                                        type="text"
                                        name="userName"
                                        value={createUser.userName}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Password:
                                    <input
                                        type="text"
                                        name="password"
                                        value={createUser.password}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Full Name:
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={createUser.fullName}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Address:
                                    <input
                                        type="text"
                                        name="address"
                                        value={createUser.address}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="text"
                                        name="email"
                                        value={createUser.email}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Date of Birth:
                                    <input
                                        type="date"
                                        name="dob"
                                        value={createUser.dob || ''}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Main Major:
                                    <input
                                        type="text"
                                        name="mainMajor"
                                        value={createUser.mainMajor || ''}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Phone Number:
                                    <input
                                        type="text"
                                        name="phone"
                                        value={createUser.phone || ''}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Role ID:
                                    <select
                                        name="roleId"
                                        value={createUser.roleId || ''}
                                        onChange={handleInputChange}
                                    >
                                        <option value="1">Trưởng Phòng Khảo Thí</option>
                                        <option value="2">Nhân Viên Phòng Khảo Thí</option>
                                        <option value="3">Giảng Viên</option>
                                    </select>
                                </label>
                                <label>
                                    Gender:
                                    <select
                                        name="gender"  // Changed to "gender"
                                        value={createUser.gender ? 'Male' : 'Female'}  // Set correct value for display
                                        onChange={(e) =>
                                            handleInputChange({
                                                target: { name: 'gender', value: e.target.value === 'Male' },
                                            })
                                        }
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </label>
                            </form>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleCreateUser}>Add</button>
                            <button onClick={handleCloseModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Users;
