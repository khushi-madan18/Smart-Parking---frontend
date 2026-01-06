import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Edit2, 
    Car, 
    FileText, 
    HelpCircle, 
    MessageCircle, 
    ChevronRight, 
    Download, 
    Shield, 
    LogOut 
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const getVehicleCount = () => {
        const stored = JSON.parse(localStorage.getItem('userVehicles') || '[]');
        const myVehicles = stored.filter(v => v.userId === currentUser.id);
        return myVehicles.length;
    };

    const menuItems = [
        {
            icon: <Car size={20} />,
            title: 'Manage Vehicles',
            subtitle: `${getVehicleCount()} vehicles saved`,
            path: '/manage-vehicles'
        },
        {
            icon: <FileText size={20} />,
            title: 'Transaction History',
            subtitle: 'View all payments'
        },
        {
            icon: <HelpCircle size={20} />,
            title: 'Help & Support',
            subtitle: 'Get assistance',
            path: '/help-support'
        },
        {
            icon: <MessageCircle size={20} />,
            title: 'FAQ',
            subtitle: 'Frequently Asked Questions',
            path: '/faq'
        }
    ];

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px'}}>
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Settings</h2>
                </div>
                <p style={{paddingLeft: '40px'}}>Manage your account and preferences</p>
            </div>

            <div className="settings-content">
                
                {/* Profile Card */}
                <div className="profile-card">
                    <div className="avatar">{currentUser.name ? currentUser.name[0] : 'U'}</div>
                    <div className="profile-info">
                        <h3>{currentUser.name || 'User'}</h3>
                        <p>{currentUser.phone || currentUser.email || 'No contact info'}</p>
                    </div>
                    <button className="edit-btn">
                        <Edit2 size={16} />
                    </button>
                </div>

                {/* Menu List */}
                {menuItems.map((item, index) => (
                    <div 
                        key={index} 
                        className="menu-item" 
                        onClick={() => item.path && navigate(item.path)}
                        style={{ cursor: item.path ? 'pointer' : 'default' }}
                    >
                        <div className="menu-icon">{item.icon}</div>
                        <div className="menu-text">
                            <h4>{item.title}</h4>
                            <p>{item.subtitle}</p>
                        </div>
                        <ChevronRight className="arrow-icon" size={20} />
                    </div>
                ))}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="settings-btn btn-light">
                        <Download size={18} />
                        Export Parking Data
                    </button>
                    
                    {/* Only show Manager Dashboard link if allowed role (optional, keeping for now) */}
                    {(currentUser.role === 'manager' || currentUser.role === 'admin') && (
                        <button className="settings-btn btn-dark" onClick={() => navigate('/manager')}>
                            <Shield size={18} />
                            Manager Dashboard
                        </button>
                    )}
                    
                    <button className="settings-btn btn-danger" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                <div className="login-info">
                    Logged in as {currentUser.email || 'Guest'}
                </div>

            </div>
        </div>
    );
};

export default Settings;
