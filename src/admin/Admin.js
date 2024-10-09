import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; // Import the CSS file for styles
import HeaderAdmin from './HeaderAdmin'; // Import the HeaderAdmin component
import Users from './User'; // Import the Users component

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
            </div>
        </div>
    );
};

export default Admin;
