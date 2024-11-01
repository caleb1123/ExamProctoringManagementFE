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

    const handleCreateAccount = () => {
        navigate('/signup'); // Chuyển hướng đến trang đăng ký
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
                            style={{ marginBottom: '0' }} // Đảm bảo không có khoảng cách dưới trường nhập
                        />
                        <div style={{ marginTop: '0px' }}>
                            <a
                                onClick={handleCreateAccount}
                                style={{
                                    color: 'blue',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    display: 'block', // Để liên kết hiển thị trên một dòng riêng
                                    marginTop: '5px', // Thêm khoảng cách trên liên kết nếu cần
                                    marginBottom: '10px', // Bạn có thể xóa dòng này nếu không muốn khoảng cách dưới liên kết
                                }}
                            >
                                Don't have an account?
                            </a>
                        </div>
                    


                    <button
                        type="submit"
                        style={{
                            fontSize: '18px',   // Kích thước chữ
                            padding: '10px 20px', // Kích thước khoảng cách bên trong
                            borderRadius: '5px', // Bo tròn các góc
                            cursor: 'pointer', // Đổi con trỏ chuột khi di chuột qua nút
                            transition: 'background-color 0.3s' // Hiệu ứng chuyển màu
                        }}
                    >
                        Login
                    </button>
            </div>


        </form>
            </div >
        </div >
    );
};

export default Login;