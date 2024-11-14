// Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import './Header.css';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear tokens from localStorage
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        
        // Reset authentication state
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login page
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const openMenu = () => setIsMenuOpen(true);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="header">
            <div className="header-logo">
                <h1>My Website</h1>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/view">Xem lịch đăng ký gác thi</Link></li>
                    <li><Link to="/exam">Đăng ký gác thi</Link></li>
                    <li><Link to="/reschedule">Đơn chuyển gác thi</Link></li>
                    <li
                        className="dropdown"
                        onMouseEnter={openMenu}
                        onMouseLeave={closeMenu}
                    >
                        <button className="auth-button" onClick={toggleMenu}>
                            <FaUser />Tài khoản
                        </button>

                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                {isAuthenticated ? (
                                    <>
                                        <Link to="/account" className="dropdown-item">
                                            <FaCog /> Chỉnh sửa tài khoản
                                        </Link>
                                        <button onClick={handleLogout} className="dropdown-item">
                                            <FaSignOutAlt /> Đăng xuất
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" className="dropdown-item">
                                        <FaUser /> Login
                                    </Link>
                                )}
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
