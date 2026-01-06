import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, CheckCircle } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        
        // 1. Get Users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // 2. Find User
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (user) {
            // 3. Set Session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // 4. Redirect to Role Selection
            navigate('/dashboard');
        } else {
            // Demo Fallback for convenience if empty
            if (formData.email === 'admin@test.com' && formData.password === 'admin') {
                const admin = { name: 'Admin', role: 'admin' };
                localStorage.setItem('currentUser', JSON.stringify(admin));
                navigate('/super-admin');
            } else {
                setError('Invalid email or password');
            }
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
