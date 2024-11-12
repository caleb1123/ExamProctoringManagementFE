import React, { useState, useEffect } from 'react';
import './Account.css';

function Account() {
    const [userInfo, setUserInfo] = useState({
        userId: '',
        fullName: '',
        address: '',
        gender: '',
        phone: '',
        dob: '',
        status: ''
    });
    const [originalUserInfo, setOriginalUserInfo] = useState({});  // State to store original user info
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        if (!token) {
            setError('No token found. Please login first.');
            return;
        }

        fetch('https://examproctoringmanagement.azurewebsites.net/api/Users/information', {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                const userData = {
                    userId: data.userId,
                    fullName: data.fullName,
                    address: data.address,
                    gender: data.gender ? 'Male' : 'Female',
                    phone: data.phoneNumber,
                    dob: new Date(data.doB).toISOString().slice(0, 10),
                    status: data.status
                };
                setUserInfo(userData);
                setOriginalUserInfo(userData);  // Save the original data
            })
            .catch(error => console.error('Error fetching user information:', error));
    }, [token]);

    const handleEdit = () => {
        setOriginalUserInfo(userInfo);  // Save the current user info before editing
        setEditMode(true);
    };

    const handleCancel = () => {
        setUserInfo(originalUserInfo);  // Revert to original data
        setEditMode(false);
    };

    const handleSave = () => {
        const updatedData = {
            fullName: userInfo.fullName,
            address: userInfo.address,
            gender: userInfo.gender === 'Male',
            phone: userInfo.phone,
            dob: new Date(userInfo.dob).toISOString(),
            status: userInfo.status
        };

        fetch('https://examproctoringmanagement.azurewebsites.net/api/Users/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
            .then(data => {
                setEditMode(false);
                alert('User information updated successfully!');
            })
            .catch(error => console.error('Error updating user information:', error));
    };

    return (
        <div className="account-container">
            {error && <div className="error-message">{error}</div>}
            <h2>User Information</h2>
            <div className="account-field">
                <label>User ID:</label>
                <span>{userInfo.userId}</span>
            </div>
            <div className="account-field">
                <label>Full Name:</label>
                <input type="text" value={userInfo.fullName} onChange={e => setUserInfo({ ...userInfo, fullName: e.target.value })} disabled={!editMode} />
            </div>
            <div className="account-field">
                <label>Address:</label>
                <input type="text" value={userInfo.address} onChange={e => setUserInfo({ ...userInfo, address: e.target.value })} disabled={!editMode} />
            </div>
            <div className="account-field">
                <label>Gender:</label>
                <select value={userInfo.gender} onChange={e => setUserInfo({ ...userInfo, gender: e.target.value })} disabled={!editMode}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div className="account-field">
                <label>Phone:</label>
                <input type="text" value={userInfo.phone} onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })} disabled={!editMode} />
            </div>
            <div className="account-field">
                <label>Date of Birth:</label>
                <input type="date" value={userInfo.dob} onChange={e => setUserInfo({ ...userInfo, dob: e.target.value })} disabled={!editMode} />
            </div>
            <div className="account-field">
                <label>Status:</label>
                <select value={userInfo.status ? 'Active' : 'Inactive'} onChange={e => setUserInfo({ ...userInfo, status: e.target.value === 'Active' })} disabled={!editMode}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            <div className={`button-group ${!editMode ? 'single-button' : ''}`}>
                {editMode ? (
                    <>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel} className="cancel-button">Cancel</button>
                    </>
                ) : (
                    <button onClick={handleEdit}>Edit</button>
                )}
            </div>

        </div>
    );
}

export default Account;
