import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import UserPanel from "./components/UserPanel";
import AdminPanel from "./components/AdminPanel";
import './App.css';


const App = () => {
    return (
        <Router>
            <nav>
                <Link to="/">User Panel</Link>
                <Link to="/admin">Admin Panel</Link>
            </nav>
            <Routes>
                <Route path="/" element={<UserPanel />} />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
        </Router>
    );
};

export default App;
