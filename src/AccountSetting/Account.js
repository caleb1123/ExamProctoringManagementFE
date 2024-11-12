import React, { useEffect, useState } from 'react';
import './Account.css';

const Account = () => {
    const [userData, setUserData] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                setError('No token found. Please login first.');
                return;
            }

            try {
                const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Users/information', {
                    method: 'GET',
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    setEditedData(data); // Initialize editedData with user data
                } else {
                    setError('Failed to fetch user data. Please try again.');
                }
            } catch (err) {
                setError('An error occurred while fetching user data.');
                console.error('Fetch error:', err);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData({
            ...editedData,
            [name]: name === 'gender' ? value === 'true' : value
        });
    };

    const updateUserData = async () => {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            setError('No token found. Please login first.');
            return;
        }

        try {
            const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editedData),
            });

            if (response.ok) {
                setUserData(editedData); // Update the displayed user data after a successful update
                setIsEditing(false); // Exit edit mode
            } else {
                setError('Failed to update user data. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while updating user data.');
            console.error('Update error:', err);
        }
    };

    const cancelEdit = () => {
        setEditedData(userData); // Reset the editedData to the original userData
        setIsEditing(false); // Exit edit mode
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="account-container">
            <h2>User Information</h2>
            {userData ? (
                <div className="user-data">
                    <p><strong>User ID:</strong> {userData.userId}</p>
                    {isEditing ? (
                        <>
                            <label>
                                Full Name:
                                <input
                                    type="text"
                                    name="fullName"
                                    value={editedData.fullName}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Address:
                                <input
                                    type="text"
                                    name="address"
                                    value={editedData.address}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Gender:
                                <select
                                    name="gender"
                                    value={editedData.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="true">Male</option>
                                    <option value="false">Female</option>
                                </select>
                            </label>
                            <label>
                                Phone:
                                <input
                                    type="text"
                                    name="phone"
                                    value={editedData.phone}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Date of Birth:
                                <input
                                    type="date"
                                    name="dob"
                                    value={editedData.dob.split('T')[0]} // Format date for input
                                    onChange={handleInputChange}
                                />
                            </label>
                            <button onClick={updateUserData}>Update Information</button>
                            <button onClick={cancelEdit}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <p><strong>Username:</strong> {userData.userName}</p>
                            <p><strong>Address:</strong> {userData.address}</p>
                            <p><strong>Gender:</strong> {userData.gender ? 'Male' : 'Female'}</p>
                            <p><strong>Email:</strong> {userData.email}</p>
                            <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
                            <p><strong>Main Major:</strong> {userData.mainMajor}</p>
                            <p><strong>Date of Birth:</strong> {new Date(userData.dob).toLocaleDateString()}</p>
                            <button onClick={() => setIsEditing(true)}>Edit</button>
                        </>
                    )}
                </div>
            ) : (
                <div>Loading user data...</div>
            )}
        </div>
    );
};

export default Account;
