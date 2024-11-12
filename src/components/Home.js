import React from 'react';
import { Link } from 'react-router-dom';
import Header from './header/Header'; // Nhớ import Header
import './Home.css'; // Nhớ import file CSS

const Home = ({ isAuthenticated }) => { // Nhận isAuthenticated từ props
    return (
        <>
            <div className="home-container">
                <h1>Welcome to the Home Page!</h1>
               
            </div>
        </>
    );
};

export default Home;