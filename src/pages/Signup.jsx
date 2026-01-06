import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'user' // Default role
    });

    const handleSignup = async (e) => {
        e.preventDefault();
        
        try {
            const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';
            const res = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Signup failed');
                return;
            }

            const newUser = await res.json();
            
            // Auto Login
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join Smart Parking Solution</p>
                </div>

                <form onSubmit={handleSignup} className="auth-form">
                    <div className="input-group">
                        <User size={20} />
                        <input 
                            type="text" 
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
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

                    <div className="input-group select-group">
                        <Briefcase size={20} />
                        <select 
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="user">Car Owner (User)</option>
                            <option value="driver">Valet Driver</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Super Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-btn">Sign Up</button>
                    
                    <p className="auth-link">
                        Already have an account? <Link to="/">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
