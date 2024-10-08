import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Header from './components/header/Header';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
        </Router>
    );
};

export default App;
