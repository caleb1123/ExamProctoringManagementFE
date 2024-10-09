import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Header from './header/Header';

const Login = ({ setIsAuthenticated }) => { // Nhận setIsAuthenticated từ props
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Xử lý logic đăng nhập, có thể kiểm tra username/password giả định
        if (username === 'admin' && password === '123456') {
            setIsAuthenticated(true); // Đặt trạng thái đăng nhập thành công
            navigate('/Admin'); // Chuyển hướng về trang chủ
        } else {
            alert('Sai thông tin đăng nhập!');
        }
    };

    return (
        <div>
            <Header isAuthenticated={false} /> {/* Truyền isAuthenticated vào Header */}
            <div className="container">
                <form onSubmit={handleLogin} className="form-container">
                    <h2>Login</h2>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;