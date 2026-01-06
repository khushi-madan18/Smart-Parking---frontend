import { ScanLine, User, Car, Clock, MapPin, ChevronRight, QrCode, AlertCircle, CheckCircle, Ticket, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Workflow } from '../utils/workflow';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };
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
        const checkForUpdates = async () => {
            // 1. Get Active Request
            const activeReqs = await Workflow.getUserActiveRequests(currentUser.id);
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

            const allRequests = await Workflow.getAll();
            const history = allRequests
                .filter(r => r.userId == currentUser.id && r.status === 'completed')
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Newest first
                .slice(0, 5) // Last 10 entries
                .map(r => {
                    // Use Parked Time (Actual Entry) if available, otherwise Booking Time
                    const entryTime = r.parkedTimestamp ? new Date(r.parkedTimestamp) : new Date(r.timestamp);
                    let durationStr = '--';
                    let priceVal = 50;

                    // Strict Duration Calculation: Only if exitTimestamp exists
                    if (r.exitTimestamp) {
                        const exitTime = new Date(r.exitTimestamp);
                        const diffMs = exitTime - entryTime;
                        const totalMins = Math.floor(diffMs / 60000);
                        const h = Math.floor(totalMins / 60);
                        const m = totalMins % 60;
                        durationStr = `${h}h ${m}m`;

                        // Pricing Logic: ₹50 for first hour, ₹30 for subsequent hours
                        // Or simply ₹50/hr for simplicity to match the ₹150 example (3hrs)
                        const hours = Math.ceil(totalMins / 60);
                        priceVal = Math.max(50, hours * 50);
                    }
                    
                    return {
                        id: r.id,
                        name: r.location || 'Phoenix Mall',
                        location: getAddress(r.location), // Real address mapping
                        price: `₹${priceVal}`, 
                        // Show "6 Jan, 10:30 PM" to verify entry time
                        date: entryTime.toLocaleString('en-US', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true }),
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
                <div className="header-content" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <h1>Smart Parking</h1>
                        <p>Welcome back, {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}!</p>
                    </div>
                    <button onClick={handleLogout} style={{background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', cursor: 'pointer'}}>
                        <LogOut size={20} />
                    </button>
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

                {/* Active Parking Section */}
                <div className="active-section">
                    <h3>Active Parking</h3>
                    
                    {activeRequest && activeRequest.status !== 'completed' && activeRequest.status !== 'archived' ? (
                        /* Clickable Card -> Goes to Ticket or Retrieval based on status */
                        <div className="active-parking-card" 
                             onClick={() => {
                                 navigate('/ticket');
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
                                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                                        <div className="status-pill green" style={{background:'#dcfce7', color:'#16a34a'}}>
                                            <div className="dot" style={{background:'#16a34a'}}></div>
                                            <span>Vehicle Arrived</span>
                                        </div>
                                    </div>
                                ) : activeRequest.status === 'retrieving' || activeRequest.status === 'retrieval_requested' ? (
                                    <div className="status-pill orange" style={{background:'#fff7ed', color:'#ea580c'}}>
                                        <div className="dot" style={{background:'#ea580c'}}></div>
                                        <span>Valet on the Way</span>
                                    </div>
                                ) : (activeRequest.status === 'requested' || activeRequest.status === 'waiting') ? (
                                    <div className="status-pill orange" style={{background:'#fffbeb', color:'#d97706'}}>
                                        <div className="dot" style={{background:'#d97706'}}></div>
                                        <span>Finding Valet...</span>
                                    </div>
                                ) : activeRequest.status === 'assigned' ? (
                                    <div className="status-pill blue" style={{background:'#eff6ff', color:'#2563eb'}}>
                                        <div className="dot" style={{background:'#2563eb'}}></div>
                                        <span>Valet Assigned</span>
                                    </div>
                                ) : (
                                    <div className="status-pill green">
                                        <div className="dot"></div>
                                        <span>Parked - {formatDuration(activeRequest.timestamp)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Empty State: All Caught Up */
                        <div className="active-parking-card empty-state" style={{background:'white', border:'1px solid #f1f5f9', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'30px 20px', gap:'16px'}}>
                             <div style={{width:'48px', height:'48px', background:'#ecfdf5', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#10b981'}}>
                                <CheckCircle size={24} />
                             </div>
                             <div style={{textAlign:'center'}}>
                                <h4 style={{fontSize:'16px', fontWeight:'700', color:'#1e293b', margin:'0 0 4px 0'}}>All Caught Up!</h4>
                                <p style={{fontSize:'13px', color:'#64748b', margin:0}}>No active parking sessions.</p>
                             </div>
                        </div>
                    )}
                </div>

                {/* Recent Parking Section */}
                <div className="list-section">
                    <h3>Recent Parking</h3>
                    
                    <div className="history-list">
                        {parkingSpots.map(item => (
                            <div key={item.id} className="history-card">
                                <div className="card-row">
                                    <h4 className="place-name">{item.name}</h4>
                                    <span className="price">{item.price}</span>
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
