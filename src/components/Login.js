import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Header from './header/Header';

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading spinner
    const [statusMessage, setStatusMessage] = useState(''); // State for success/error message
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading spinner
        setStatusMessage(''); // Reset any previous messages
        try {
            const response = await fetch('https://examproctoringmanagement.azurewebsites.net/api/Users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: username,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login response:', data);
                setIsAuthenticated(true);
                setStatusMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/Admin'); // Redirect after a brief delay
                }, 1000);
            } else {
                setStatusMessage('Sai thông tin đăng nhập!'); // Invalid login credentials
            }
        } catch (error) {
            console.error('Error during login:', error);
            setStatusMessage('Đã xảy ra lỗi trong quá trình đăng nhập!');
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    const handleCreateAccount = () => {
        navigate('/signup');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <Header isAuthenticated={false} />
            <div className="container">
                <form onSubmit={handleLogin} className="form-container">
                    <h2>Login</h2>
                    <div>
                        <label>Email:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <label>Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ marginBottom: '0', paddingRight: '30px' }}
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: showPassword ? 'blue' : 'gray'
                            }}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                        <div style={{ marginTop: '0px' }}>
                            <a
                                onClick={handleCreateAccount}
                                style={{
                                    color: 'blue',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    display: 'block',
                                    marginTop: '5px',
                                    marginBottom: '10px'
                                }}
                            >
                                Don't have an account?
                            </a>
                        </div>
                    </div>
                    <button
                        type="submit"
                        style={{
                            fontSize: '18px',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {loading && <div className="spinner"></div>} {/* Loading spinner */}
                    {statusMessage && (
                        <div className="status-message">
                            {statusMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
