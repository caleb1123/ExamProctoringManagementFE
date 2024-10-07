import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Nhớ import file CSS

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to the Home Page!</h1>
            <Link to="/login">
                <button className="login-button">Go to Login</button>
            </Link>
        </div>
    );
};

export default Home;
