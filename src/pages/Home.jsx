import { ScanLine, User, Car, Clock, MapPin, ChevronRight, QrCode, AlertCircle, CheckCircle, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Workflow } from '../utils/workflow';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    // Helper to format duration
    const formatDuration = (timestamp) => {
        const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
        if (diff < 60) return `${diff}m`;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        return `${h}h ${m}m`;
    };

    // Fix: Use useState for stable currentUser reference to prevent useEffect loops
    const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || 'null'));
    const [activeRequest, setActiveRequest] = useState(null);
    const [parkingSpots, setParkingSpots] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Poll for updates (Simulation of real-time)
        const checkForUpdates = () => {
            // 1. Get Active Request
            const activeReqs = Workflow.getUserActiveRequests(currentUser.id);
            if (activeReqs.length > 0) {
                setActiveRequest(activeReqs[0]); 
            } else {
                setActiveRequest(null);
            }

            // Helper to get address based on mall name
            const getAddress = (mallName) => {
                if (!mallName) return 'Mumbai, India';
                if (mallName.includes('Phoenix')) return 'Lower Parel, Mumbai';
                if (mallName.includes('Inorbit')) return 'Malad West, Mumbai';
                if (mallName.includes('R City')) return 'Ghatkopar, Mumbai';
                return 'Mumbai, India';
            };

            const allRequests = Workflow.getAll();
            const history = allRequests
                .filter(r => r.userId === currentUser.id && r.status === 'completed')
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Newest first
                .slice(0, 5) // Last 10 entries
                .map(r => {
                    const entryTime = new Date(r.timestamp);
                    // Mock duration/price for demo
                    const durationStr = "2h 30m"; 
                    
                    return {
                        id: r.id,
                        name: r.location || 'Phoenix Mall',
                        location: getAddress(r.location), // Real address mapping
                        price: 150, 
                        date: entryTime.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}),
                        plate: r.vehicle?.plate || 'Unknown',
                        duration: durationStr,
                        status: 'completed'
                    };
                });
            
            setParkingSpots(history);
        };

        checkForUpdates(); // Initial check
        const interval = setInterval(checkForUpdates, 1000);

        return () => clearInterval(interval);
    }, [currentUser, navigate]);

    // renderStatusBanner removed - using new card layout

    if (!currentUser) return null; // Avoid flash before redirect

    return (
        <div className="home-page">
            {/* Header Section */}
            <header className="app-header">
                <div className="header-content">
                    <h1>Smart Parking</h1>
                    <p>Welcome back, {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}!</p>
                </div>
                
                {/* Promo Banner */}
                <div className="promo-banner">
                    <div className="promo-text">
                        <span className="promo-badge">🏆 #1 IN INDIA</span>
                        <h2>Premium Parking Solution</h2>
                        <p>Trusted by 1M+ users nationwide</p>
                    </div>
                </div>
            </header>

            <div className="main-content">
                
                {/* Scan to Park Card - Always Visible */}
                <div className="action-card" onClick={() => navigate('/scan')}>
                    <div className="icon-wrapper orange-gradient">
                        <QrCode color="white" size={24} />
                    </div>
                    <div className="card-text">
                        <h3>Scan to Park</h3>
                        <p>Scan QR code at parking entrance</p>
                    </div>
                    <ChevronRight className="card-arrow" />
                </div>

                {/* Active Parking Section - Conditional */}
                {activeRequest && activeRequest.status !== 'completed' && activeRequest.status !== 'archived' && (
                    <div className="active-section">
                        <h3>Active Parking</h3>
                        {/* Clickable Card -> Goes to Ticket or Retrieval based on status */}
                        <div className="active-parking-card" 
                             onClick={() => {
                                 const isRetrieval = ['retrieval_requested', 'retrieving', 'vehicle_arrived'].includes(activeRequest.status);
                                 navigate(isRetrieval ? '/retrieval' : '/ticket');
                             }} 
                             style={{cursor: 'pointer'}}>
                            <div className="active-card-top">
                                <div className="mall-icon">
                                    <Ticket size={20} color="#059669" />
                                </div>
                                <div className="active-details">
                                    <h4>{activeRequest.location || 'Inorbit Mall'}</h4>
                                    <div className="active-meta">
                                        <span><Clock size={12} /> {new Date(activeRequest.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                        <span><Car size={12} /> {activeRequest.vehicle?.plate || 'MH 12 AB 1234'}</span>
                                    </div>
                                </div>
                                <ChevronRight color="#059669" size={20} />
                            </div>
                            
                            <div className="active-card-bottom">
                                {activeRequest.status === 'vehicle_arrived' ? (
                                    <div className="status-pill green" style={{background:'#dcfce7', color:'#16a34a'}}>
                                        <div className="dot" style={{background:'#16a34a'}}></div>
                                        <span>Vehicle Arrived</span>
                                    </div>
                                ) : activeRequest.status === 'retrieving' || activeRequest.status === 'retrieval_requested' ? (
                                    <div className="status-pill orange" style={{background:'#fff7ed', color:'#ea580c'}}>
                                        <div className="dot" style={{background:'#ea580c'}}></div>
                                        <span>Valet on the Way</span>
                                    </div>
                                ) : (
                                    <div className="status-pill green">
                                        <div className="dot"></div>
                                        <span>Parked - {formatDuration(activeRequest.timestamp)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Parking Section */}
                <div className="list-section">
                    <h3>Recent Parking</h3>
                    
                    <div className="history-list">
                        {parkingSpots.map(item => (
                            <div key={item.id} className="history-card">
                                <div className="card-row">
                                    <h4 className="place-name">{item.name}</h4>
                                    <span className="price">₹{item.price}</span>
                                </div>
                                
                                <div className="card-row">
                                    <div className="location">
                                        <MapPin size={12} />
                                        <span>{item.location}</span>
                                    </div>
                                    <span className="status-badge completed">{item.status}</span>
                                </div>

                                <div className="card-divider"></div>

                                <div className="card-footer">
                                    <div className="meta-item">
                                        <Clock size={12} />
                                        <span>{item.date}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Car size={12} />
                                        <span>{item.plate}</span>
                                    </div>
                                    <div className="meta-item duration">
                                        <span>{item.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
