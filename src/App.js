// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Admin from './admin/Admin';
import Header from './components/header/Header';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));

    // PrivateRoute component to protect the Admin route
    const PrivateRoute = ({ element: Component }) => {
        return isAuthenticated ? Component : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
            </Routes>
        </Router>
    );
};

export default App;
