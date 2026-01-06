import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UserPlus, Search, Car, Phone, Edit, MapPin, Clock 
} from 'lucide-react';
import { Workflow } from '../utils/workflow';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [parkingData, setParkingData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const allRequests = await Workflow.getAll();
            const formatted = allRequests.map(r => {
                let status = 'Parked';
                if (['retrieval_requested', 'retrieving', 'vehicle_arrived'].includes(r.status)) status = 'Retrieving';
                if (r.status === 'completed') status = 'Returned';
                if (r.status === 'requested' || r.status === 'assigned') status = 'Parked'; // Grouping pending as parked/active

                // Calculate duration
                const entryTime = r.parkedTimestamp ? new Date(r.parkedTimestamp) : new Date(r.timestamp);
                let durationStr = '--';
                if (r.exitTimestamp) {
                    const diff = Math.floor((new Date(r.exitTimestamp) - entryTime) / 60000);
                    const h = Math.floor(diff / 60);
                    const m = diff % 60;
                    durationStr = `${h}h ${m}m`;
                } else {
                    const diff = Math.floor((Date.now() - entryTime) / 60000);
                    const h = Math.floor(diff / 60);
                    const m = diff % 60;
                    durationStr = `${h}h ${m}m`;
                }

                return {
                    id: r.id,
                    carModel: r.vehicle?.model || 'Vehicle',
                    plate: r.vehicle?.plate || 'Unknown',
                    status: status,
                    customer: r.userName || 'Guest',
                    valet: r.valetName || (status === 'Parked' && r.status === 'requested' ? 'Unassigned' : 'Unknown'),
                    valetId: r.valetId ? `V${String(r.valetId).slice(-3)}` : '--',
                    location: r.location || 'Phoenix Mall',
                    subLocation: r.spotId || 'TBD',
                    entryTime: entryTime.toLocaleString('en-US', {day:'numeric', month:'short', hour:'numeric', minute:'2-digit', hour12:true}),
                    duration: durationStr,
                    rawStatus: r.status // For detailed filtering if needed
                };
            }).sort((a, b) => b.id - a.id); // Newest first

            setParkingData(formatted);
        };

        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    // Calculate Counts
    const counts = useMemo(() => {
        const stats = {
            All: parkingData.length,
            Parked: 0,
            Retrieving: 0,
            Returned: 0
        };
        parkingData.forEach(item => {
            if (stats[item.status] !== undefined) {
                stats[item.status]++;
            }
        });
        return stats;
    }, [parkingData]);

    // Calculate Revenue (Mock logic based on Returned cars)
    const revenue = useMemo(() => {
        // ₹50 flat for simplicty or dynamic based on duration if we parsed it
        // Let's assume average ₹100 per completed car
        return counts.Returned * 150; 
    }, [counts]);

    // Filter Data
    const filteredData = useMemo(() => {
        return parkingData.filter(item => {
            const matchesTab = activeTab === 'All' || item.status === activeTab;
            const lowerSearch = searchTerm.toLowerCase();
            const matchesSearch = 
                item.carModel.toLowerCase().includes(lowerSearch) ||
                item.plate.toLowerCase().includes(lowerSearch) ||
                item.customer.toLowerCase().includes(lowerSearch) ||
                (item.valet && item.valet.toLowerCase().includes(lowerSearch));
            
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchTerm, parkingData]);

    // Derived Status Classes
    const getBadgeStyle = (status) => {
        if (status === 'Parked') return { background: '#ecfdf5', color: '#10b981' };
        if (status === 'Retrieving') return { background: '#fff7ed', color: '#f97316' };
        if (status === 'Returned') return { background: '#f1f5f9', color: '#64748b' };
        return {};
    };

    return (
        <div className="manager-page">
            <div className="manager-header">
                <div className="header-top">
                    <h2>Manager Dashboard</h2>
                    <button className="add-driver-btn" onClick={() => navigate('/add-driver')}>
                        <UserPlus size={16} />
                        Add Driver
                    </button>
                </div>
                <p>Manage valet assignments and parking operations</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Active Cars</h4>
                    <span className="value">{counts.Parked + counts.Retrieving}</span>
                </div>
                <div className="stat-card">
                    <h4>Retrieving</h4>
                    <span className="value">{counts.Retrieving}</span>
                </div>
                <div className="stat-card">
                    <h4>Total Today</h4>
                    <span className="value">{counts.All}</span>
                </div>
                <div className="stat-card">
                    <h4>Revenue</h4>
                    <span className="value">₹{revenue}</span>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="controls-section">
                <div className="search-bar">
                    <Search size={18} color="#94a3b8" />
                    <input 
                        type="text" 
                        placeholder="Search by plate, customer or valet..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filters">
                    {['All', 'Parked', 'Retrieving', 'Returned'].map((tab) => (
                        <button 
                            key={tab} 
                            className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab} ({counts[tab] || 0})
                        </button>
                    ))}
                </div>
            </div>

            {/* Parking List */}
            <div className="parking-list">
                {filteredData.length === 0 ? (
                    <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>
                        No records found
                    </div>
                ) : (
                    filteredData.map(item => (
                        <div key={item.id} className="parking-card">
                            <div className="card-header">
                                <div className="car-info">
                                    <div className="car-icon-bg">
                                        <Car size={20} />
                                    </div>
                                    <div className="car-text">
                                        <h3>{item.carModel}</h3>
                                        <p>{item.plate}</p>
                                    </div>
                                </div>
                                <span className={`status-badge`} style={getBadgeStyle(item.status)}>{item.status}</span>
                            </div>

                            <div className="info-grid">
                                <div className="info-group">
                                    <div className="info-box" style={{marginBottom: '12px'}}>
                                        <label>Customer</label>
                                        <p>{item.customer}</p>
                                    </div>
                                    <div className="info-box">
                                        <label>Valet Assigned</label>
                                        <p>{item.valet}</p>
                                        <div className="sub">ID: {item.valetId}</div>
                                    </div>
                                </div>
                                <button className="call-btn">
                                    <Phone size={18} />
                                </button>
                            </div>

                            {item.status !== 'Returned' && (
                                <button className="reassign-btn">
                                    <Edit size={16} />
                                    Reassign Valet
                                </button>
                            )}

                            <div className="details-section">
                                <div className="detail-row">
                                    <MapPin size={16} />
                                    <div className="info-box">
                                        <label>Location</label>
                                        <p>{item.location}</p>
                                        <div className="sub">{item.subLocation}</div>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <Clock size={16} />
                                    <div className="info-box">
                                        <label>Entry Time</label>
                                        <p>{item.entryTime}</p>
                                        <div className="sub">Duration: {item.duration}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;
