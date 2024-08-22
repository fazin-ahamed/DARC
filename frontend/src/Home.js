import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/globals.css';

function Home() {
  return (
    <div>
      <nav>
        <Link to="/" className="link-spacing">Home</Link>
        <Link to="/login" className="link-spacing">Login</Link>
        <Link to="/signup" className="link-spacing">Sign Up</Link>
        <Link to="/dashboard" className="link-spacing">Dashboard</Link>
      </nav>
      <main>
        <h1>Welcome to the Home Page</h1>
      </main>
    </div>
  );
}

export default Home;
