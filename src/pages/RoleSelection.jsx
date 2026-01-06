import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Briefcase, Car, ArrowRight } from 'lucide-react';
import './RoleSelection.css';

const RoleSelection = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!user) {
            navigate('/login');
        } else {
            setCurrentUser(user);
        }
    }, [navigate]);

    const handleContinue = () => {
        if (!currentUser) return;

        switch(currentUser.role) {
            case 'driver':
                navigate('/driver');
                break;
            case 'manager':
                navigate('/manager');
                break;
            case 'admin':
                navigate('/super-admin');
                break;
            default:
                navigate('/home');
        }
    };

    if (!currentUser) return null;

    const getRoleIcon = () => {
        switch(currentUser.role) {
            case 'driver': return <Car size={40} />;
            case 'manager': return <Briefcase size={40} />;
            case 'admin': return <Shield size={40} />;
            default: return <User size={40} />;
        }
    };

    const getRoleLabel = () => {
        switch(currentUser.role) {
            case 'driver': return 'Driver';
            case 'manager': return 'Manager';
            case 'admin': return 'Super Admin';
            default: return 'User';
        }
    };

    return (
        <div className="role-selection-page">
            <div className="role-card" onClick={handleContinue}>
                <div className="role-icon-box">
                    {getRoleIcon()}
                </div>
                <h2 className="role-title">Continue as<br/>{getRoleLabel()}</h2>
                
                <div className="user-info">
                    <p className="user-name">{currentUser.name}</p>
                    <p className="user-email">{currentUser.email}</p>
                </div>

                <div className="continue-indicator">
                    <span>Access Dashboard</span>
                    <ArrowRight size={20} />
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
