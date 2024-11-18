import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:5000/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });

        const data = await response.json();
        if (response.ok) {
            document.cookie = `session=${data.token}; path=/`;
            navigate(`/${role}/dashboard`);
        } else {
            alert(data.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
