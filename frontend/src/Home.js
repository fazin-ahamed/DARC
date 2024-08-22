import React from 'react';
import { Link } from 'react-router-dom';

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
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </main>
    </div>
  );
}
