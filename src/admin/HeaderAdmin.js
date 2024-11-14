import React, { useState } from 'react';
import './Admin.css'; // Import the same CSS for styling

const HeaderAdmin = ({ activeMenu, handleMenuClick, handleLogout }) => {
    const [isGroupRoomOpen, setIsGroupRoomOpen] = useState(false);

    const toggleGroupRoom = () => {
        setIsGroupRoomOpen(!isGroupRoomOpen); // Toggle the dropdown visibility
    };

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
                <li className={activeMenu === 'Exams' ? 'active' : ''} onClick={() => handleMenuClick('Exams')}>
                    Exams
                </li>
                <li className={activeMenu === 'Semesters' ? 'active' : ''} onClick={() => handleMenuClick('Semesters')}>
                    Semesters
                </li>
                <li className={activeMenu === 'Subjects' ? 'active' : ''} onClick={() => handleMenuClick('Subjects')}>
                    Subjects
                </li>
                <li className={activeMenu === 'SlotReference' ? 'active' : ''} onClick={() => handleMenuClick('SlotReference')}>
                    SlotReference
                </li>
                {/* Dropdown for GroupRoom */}
                <li className={isGroupRoomOpen ? 'active' : ''} onClick={toggleGroupRoom}>
                    GroupRoom
                    {isGroupRoomOpen && (
                        <ul className="dropdown">
                            <li onClick={() => handleMenuClick('Room')}>Room</li>
                            <li onClick={() => handleMenuClick('Group')}>Group</li>
                            <li onClick={() => handleMenuClick('GroupRoom')}>GroupRoom</li>
                        </ul>
                    )}
                </li>
                <li onClick={handleLogout}>
                    Logout
                </li>
            </ul>
        </div>
    );
};

export default HeaderAdmin;
