import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronRight, Mail, Phone, LogOut } from 'lucide-react';
import './Settings.css'; 

const HelpSupport = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px'}}>
                    <button className="back-btn" onClick={() => navigate('/settings')}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Help & Support</h2>
                </div>
                <p style={{paddingLeft: '40px'}}>Get assistance with your account and preferences</p>
            </div>

            <div className="settings-content">
                
                {/* FAQ Link */}
                <div className="menu-item" onClick={() => navigate('/faq')} style={{cursor: 'pointer'}}>
                    <div className="menu-icon">
                        <HelpCircle size={20} />
                    </div>
                    <div className="menu-text">
                        <h4>FAQ</h4>
                        <p>Frequently Asked Questions</p>
                    </div>
                    <ChevronRight className="arrow-icon" size={20} />
                </div>

                {/* Footer Buttons */}
                <div className="action-buttons" style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    
                    <button className="settings-btn btn-light" style={{display: 'flex', justifyContent: 'center', color: '#4f46e5', border: '1px solid #e2e8f0', background: 'white'}}>
                        <Mail size={18} />
                        Email Us
                    </button>

                    <button className="settings-btn btn-light" style={{display: 'flex', justifyContent: 'center', color: '#4f46e5', border: '1px solid #e2e8f0', background: 'white'}}>
                        <Phone size={18} />
                        Call Us
                    </button>

                    <button className="settings-btn btn-danger" onClick={handleLogout} style={{display: 'flex', justifyContent: 'center'}}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default HelpSupport;
