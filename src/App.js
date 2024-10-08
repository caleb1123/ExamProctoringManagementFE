import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Admin from './admin/Admin';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Sửa lại khai báo useState

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path='/admin' element={<Admin />} />
            </Routes>
        </Router>
    );
};

export default App;