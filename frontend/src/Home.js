import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

export default function Home() {
  return (
    <div>
      <head>
        <title>Home Page</title>
        <meta name="description" content="Home Page of the DARC Project" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <main>
        <h1>Welcome to the School Project By Fazin</h1>
        <Link to="/login" className="link-spacing">Login</Link>
        <Link to="/signup" className="link-spacing">Sign Up</Link>
        <Link to="/dashboard" className="link-spacing"><Dashboard</Link>
      </main>
    </div>
  );
}
