import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Calendar, Ticket, IndianRupee, MapPin, 
    Phone, FileText, CheckCircle, XCircle, Eye, User, Check
} from 'lucide-react';
import './SuperAdmin.css';

const SuperAdmin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [pendingDrivers, setPendingDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);

    // Load pending drivers from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('pendingDrivers') || '[]');
        setPendingDrivers(stored);
    }, []);

    const handleApprove = (id) => {
        const updated = pendingDrivers.filter(d => d.id !== id);
        setPendingDrivers(updated);
        localStorage.setItem('pendingDrivers', JSON.stringify(updated));
        setSelectedDriver(null); // Go back to list
        alert("Driver Approved Successfully!");
    };

    const handleReject = (id) => {
        if(window.confirm("Are you sure you want to reject this application?")) {
            const updated = pendingDrivers.filter(d => d.id !== id);
            setPendingDrivers(updated);
            localStorage.setItem('pendingDrivers', JSON.stringify(updated));
            setSelectedDriver(null); // Go back to list
        }
    };

    // Render Detailed Driver View
    if (selectedDriver) {
        return (
            <div className="super-admin-page details-page">
                <div className="super-header">
                    <div className="header-top-row">
                        <button className="back-btn" onClick={() => setSelectedDriver(null)}>
                            <ArrowLeft size={24} color="white" />
                        </button>
                        <h2>Driver Profile</h2>
                    </div>
                </div>

                <div className="details-content">
                    <div className="profile-summary">
                        <img src={selectedDriver.photo} alt={selectedDriver.fullName} className="profile-large-img" />
                    </div>

                    <div className="detail-card">
                        <h3>Personal Details</h3>
                        <div className="info-row">
                            <span className="info-label">Name:</span>
                            <span className="info-value">{selectedDriver.fullName}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Phone:</span>
                            <span className="info-value">{selectedDriver.phone}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{selectedDriver.email}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Address:</span>
                            <span className="info-value">{selectedDriver.address}</span>
                        </div>
                    </div>

                    <div className="detail-card">
                        <h3>License Details</h3>
                        <div className="info-row">
                            <span className="info-label">License No:</span>
                            <span className="info-value">{selectedDriver.licenseNumber}</span>
                        </div>
                        <img src={selectedDriver.licensePhoto} alt="License" className="license-img-preview" />
                    </div>

                    <div className="submission-meta">
                        <div className="info-row">
                            <span className="info-label">Submitted by:</span>
                            <span className="info-value">Manager</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Submitted on:</span>
                            <span className="info-value">{selectedDriver.submittedAt}</span>
                        </div>
                    </div>

                    <div className="details-actions">
                        <button 
                            className="details-btn approve"
                            onClick={() => handleApprove(selectedDriver.id)}
                        >
                            <CheckCircle size={18} /> Approve
                        </button>
                        <button 
                            className="details-btn reject"
                            onClick={() => handleReject(selectedDriver.id)}
                        >
                            <XCircle size={18} /> Reject
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main Dashboard Render
    return (
        <div className="super-admin-page">
            <div className="super-header">
                <div className="header-top-row">
                    <button className="back-btn" onClick={() => navigate('/roles')}>
                        <ArrowLeft size={24} color="white" />
                    </button>
                    <div>
                        <h2>Super Admin</h2>
                        <p style={{margin:0, fontSize: '13px', opacity: 0.8}}>System overview and approvals</p>
                    </div>
                </div>

                <div className="sa-tabs-container">
                    <button 
                        className={`sa-tab ${activeTab === 'Overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`sa-tab ${activeTab === 'Approvals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Approvals')}
                    >
                        Approvals
                        {pendingDrivers.length > 0 && <span className="badge-dot"></span>}
                    </button>
                </div>
            </div>

            <div className="sa-content">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <div className="overview-section">
                        <div className="site-select">
                            <label style={{display:'block', marginBottom: '8px', fontSize:'13px', color:'#64748b'}}>Select Site</label>
                            <div className="site-dropdown">
                                <span>Phoenix Mall - Lower Parel</span>
                                <MapPin size={16} />
                            </div>
                        </div>

                        <div style={{marginBottom: '16px', display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#64748b'}}>
                            <Calendar size={14} /> Today's Performance
                        </div>

                        <div className="performance-grid">
                            <div className="sa-card">
                                <h4>Tickets Issued</h4>
                                <div className="sa-value">87</div>
                            </div>
                            <div className="sa-card">
                                <h4>Collection</h4>
                                <div className="sa-value">₹13,050</div>
                            </div>
                        </div>

                        <div style={{marginBottom: '16px', display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#64748b'}}>
                            <TrendingUpIcon /> Overall Statistics
                        </div>

                        <div className="full-card">
                            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                                <Ticket size={20} color="#a855f7" />
                                <span style={{fontSize:'14px', color:'#475569'}}>Total Tickets</span>
                            </div>
                            <span style={{fontSize:'16px', fontWeight:'600'}}>1247</span>
                        </div>

                        <div className="full-card">
                            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                                <IndianRupee size={20} color="#10b981" />
                                <span style={{fontSize:'14px', color:'#475569'}}>Total Collection</span>
                            </div>
                            <span style={{fontSize:'16px', fontWeight:'600'}}>₹186,450</span>
                        </div>

                        <div className="full-card">
                            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                                <MapPin size={20} color="#3b82f6" />
                                <span style={{fontSize:'14px', color:'#475569'}}>Active Parking</span>
                            </div>
                            <span style={{fontSize:'16px', fontWeight:'600'}}>45</span>
                        </div>

                        <div className="full-card location">
                            <h4 style={{margin:'0 0 4px 0', color:'#1e293b'}}>Phoenix Mall - Lower Parel</h4>
                            <span style={{fontSize:'12px', color:'#64748b'}}>Lower Parel, Mumbai</span>
                        </div>
                    </div>
                )}

                {/* APPROVALS TAB */}
                {activeTab === 'Approvals' && (
                    <div className="approvals-section">
                        <h3>Pending Driver Approvals</h3>
                        
                        {pendingDrivers.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon-bg">
                                    <Check size={32} color="#7c3aed" />
                                </div>
                                <h3>All Caught Up!</h3>
                                <p>No pending driver approvals at the moment</p>
                            </div>
                        ) : (
                            pendingDrivers.map(driver => (
                                <div key={driver.id} className="approval-card">
                                    <div className="driver-brief">
                                        <img src={driver.photo} alt={driver.fullName} className="driver-avatar" />
                                        <div className="driver-detail">
                                            <h4>{driver.fullName}</h4>
                                            <div className="icon-text">
                                                <Phone size={12} /> {driver.phone}
                                            </div>
                                            <div className="icon-text">
                                                <FileText size={12} /> {driver.licenseNumber}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="submission-info">
                                        Submitted by Manager on {driver.submittedAt}
                                    </div>

                                    <div className="action-row">
                                        <button 
                                            className="action-btn view"
                                            onClick={() => setSelectedDriver(driver)}
                                        >
                                            <Eye size={14} /> View Details
                                        </button>
                                        <button 
                                            className="action-btn approve"
                                            onClick={() => handleApprove(driver.id)}
                                        >
                                            <CheckCircle size={14} /> Approve
                                        </button>
                                        <button 
                                            className="action-btn reject"
                                            onClick={() => handleReject(driver.id)}
                                        >
                                            <XCircle size={14} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

// Helper Icon for TrendingUp 
const TrendingUpIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export default SuperAdmin;
