import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SIGNUP_URL}`, { username, email, password });
            localStorage.setItem('token', response.data.access_token);
            router.push('/login');
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
