import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import file CSS

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Bạn có thể thực hiện xác thực ở đây (gọi API, v.v.)
        console.log('Username:', username);
        console.log('Password:', password);
        
        // Chuyển đến trang chính sau khi đăng nhập thành công
        navigate('/home');
    };

    return (
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
    );
};

export default Login;
