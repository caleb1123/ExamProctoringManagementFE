import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate
import Home from './components/Home';
import Login from './components/Login';
import Admin from './admin/Admin';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if user is authenticated

    // PrivateRoute component to protect the Admin route
    const PrivateRoute = ({ element: Component }) => {
        return isAuthenticated ? Component : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path='/admin' element={<PrivateRoute element={<Admin />} />} />
            </Routes>
        </Router>
    );
};

export default App;
