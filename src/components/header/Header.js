import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa'; // Thêm icon từ react-icons
import './Header.css';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái menu thả xuống
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsAuthenticated(false); // Đặt lại trạng thái đăng xuất
        navigate('/login'); // Chuyển hướng về trang login
        setIsMenuOpen(false); // Đóng menu
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle trạng thái menu
    };

    const handleMouseLeave = () => {
        setIsMenuOpen(false); // Đóng menu khi chuột ra ngoài
    };

    return (
        <header className="header">
            <div className="header-logo">
                <h1>My Website</h1>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li className="dropdown" onMouseLeave={handleMouseLeave}>
                        <button className="auth-button" onClick={toggleMenu}>
                            <FaUser /> Account
                        </button>

                        {/* Menu thả xuống */}
                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                {isAuthenticated ? (
                                    <>
                                        <Link to="/account-settings" className="dropdown-item">
                                            <FaCog /> Account Settings
                                        </Link>
                                        <button onClick={handleLogout} className="dropdown-item">
                                            <FaSignOutAlt /> Logout
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
