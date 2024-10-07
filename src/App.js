import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} /> {/* Trang chính là Home */}
                <Route path="/login" element={<Login />} /> {/* Đổi path thành /login */}
            </Routes>
        </Router>
    );
};

export default App;
