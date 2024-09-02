import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './app'; // Rename if necessary
import Dashboard from './dashboard'; // Import your Dashboard component
import './monaco-loader';

const AppRouter = () => (
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </Router>
);

export default AppRouter;
