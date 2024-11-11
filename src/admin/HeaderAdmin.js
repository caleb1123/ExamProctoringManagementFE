import React from 'react';
import './Admin.css'; // Import the same CSS for styling

const HeaderAdmin = ({ activeMenu, handleMenuClick, handleLogout }) => {
    return (
        <div className="admin-sidebar">
            <h3>Admin Menu</h3>
            <ul>
                <li className={activeMenu === 'Dashboard' ? 'active' : ''} onClick={() => handleMenuClick('Dashboard')}>
                    Dashboard
                </li>
                <li className={activeMenu === 'Users' ? 'active' : ''} onClick={() => handleMenuClick('Users')}>
                    Users
                </li>
                <li className={activeMenu === 'Settings' ? 'active' : ''} onClick={() => handleMenuClick('Settings')}>
                    Settings
                </li>
                <li className={activeMenu === 'Exams' ? 'active' : ''} onClick={() => handleMenuClick('Exams')}>
                    Exams
                </li>
                <li className={activeMenu === 'Semesters' ? 'active' : ''} onClick={() => handleMenuClick('Semesters')}>
                    Semesters
                </li>
                <li onClick={handleLogout}>
                    Logout
                </li>
            </ul>
        </div>
    );
};

export default HeaderAdmin;
