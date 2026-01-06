import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Mail, Phone, LogOut } from 'lucide-react';
import './Settings.css';

const FAQ = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const faqs = [
        {
            question: "How do I add a vehicle?",
            answer: "Go to the \"Manage Vehicles\" section and click \"Add New Vehicle\"."
        },
        {
            question: "How do I remove a vehicle?",
            answer: "Go to the \"Manage Vehicles\" section and click \"Remove\" next to the vehicle you want to delete."
        },
        {
            question: "How do I manage payment methods?",
            answer: "Go to the \"Payment Methods\" section and add or remove payment options."
        },
        {
            question: "How do I view transaction history?",
            answer: "Go to the \"Transaction History\" section to view all your payments."
        }
    ];

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px'}}>
                    <button className="back-btn" onClick={() => navigate('/help-support')}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>FAQ</h2>
                </div>
                <p style={{paddingLeft: '40px'}}>Frequently Asked Questions</p>
            </div>

            <div className="settings-content">
                
                {/* FAQ List */}
                <div className="faq-list" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    {faqs.map((item, index) => (
                        <div key={index} className="menu-item" style={{display: 'flex', alignItems: 'flex-start', cursor: 'default', pointerEvents: 'none'}}>
                            <div className="menu-icon" style={{marginTop: '2px'}}>
                                <HelpCircle size={20} />
                            </div>
                            <div className="menu-text">
                                <h4 style={{marginBottom: '4px'}}>{item.question}</h4>
                                <p style={{lineHeight: '1.4'}}>{item.answer}</p>
                            </div>
                        </div>
                    ))}
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

export default FAQ;
