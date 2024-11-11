import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; // Import the CSS file for styles
import HeaderAdmin from './HeaderAdmin'; // Import the HeaderAdmin component
import Users from './User'; // Import the Users component
import Semesters from './Semesters'; // Import the Semesters component
import Exams from './Exams'; // Import the Exams component
import Subjects from './Subjects'; // Import the Subjects component
import Room from './Room'; // Import the Room component
import Group from './Group'; // Import the Group component
import GroupRoom from './GroupRoom'; // Import the GroupRoom component

const Admin = () => {
    const [activeMenu, setActiveMenu] = useState('Dashboard'); // Track the active menu
    const navigate = useNavigate();

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    const handleLogout = () => {
        // Handle logout logic here (e.g., clearing authentication tokens)
        alert('Logged out!');
        navigate('/login');
    };

    return (
        <div className="admin-container">
            <HeaderAdmin 
                activeMenu={activeMenu} 
                handleMenuClick={handleMenuClick} 
                handleLogout={handleLogout} 
            />
            <div className="admin-content">
                {/* Render content based on activeMenu */}
                {activeMenu === 'Dashboard' && <p>This is the Dashboard page content.</p>}
                {activeMenu === 'Users' && <Users />}  {/* Load the Users component */}
                {activeMenu === 'Settings' && <p>This is the Settings page content.</p>}
                {activeMenu === 'Semesters' && <Semesters />}  {/* Load the Semesters component */}
                {activeMenu === 'Exams' && <Exams />}  {/* Load the Exams component */}
                {activeMenu === 'Subjects' && <Subjects />}  {/* Load the Exams component */}
                {activeMenu === 'Room' && <Room />}  {/* Load the Exams component */}
                {activeMenu === 'Group' && <Group />}  {/* Load the Exams component */}
                {activeMenu === 'GroupRoom' && <GroupRoom />}  {/* Load the Exams component */}
            </div>
        </div>
    );
};

export default Admin;
