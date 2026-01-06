import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, CheckCircle } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const user = await res.json();
                localStorage.setItem('currentUser', JSON.stringify(user));
                navigate('/dashboard');
            } else {
                // Demo Admin Fallback
                if (formData.email === 'admin@test.com' && formData.password === 'admin') {
                    const admin = { id: 0, name: 'Admin', role: 'admin' };
                    localStorage.setItem('currentUser', JSON.stringify(admin));
                    navigate('/super-admin');
                    return;
                }
                const data = await res.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Login to Smart Parking</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <Mail size={20} />
                        <input 
                            type="email" 
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <Lock size={20} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    
                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" className="auth-btn">Login</button>
                    
                    <p className="auth-link">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
