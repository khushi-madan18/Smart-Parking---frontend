import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UserPlus, Search, Car, Phone, Edit, MapPin, Clock 
} from 'lucide-react';
import './ManagerDashboard.css';

const initialData = [
    {
        id: 1,
        carModel: 'Honda City',
        plate: 'MH 02 AB 1234',
        status: 'Parked',
        customer: 'Amit Sharma',
        valet: 'Rajesh Kumar',
        valetId: 'V001',
        location: 'Phoenix Mall',
        subLocation: 'Lower Parel, Mumbai',
        entryTime: '4 Jan, 06:59 pm',
        duration: '2h 0m'
    },
    {
        id: 2,
        carModel: 'Maruti Swift',
        plate: 'MH 12 CD 5678',
        status: 'Retrieving',
        customer: 'Priya Verma',
        valet: 'Vikram Singh',
        valetId: 'V003',
        location: 'Phoenix Mall',
        subLocation: 'Lower Parel, Mumbai',
        entryTime: '4 Jan, 05:30 pm',
        duration: '3h 30m'
    },
    {
        id: 3,
        carModel: 'Toyota Innova',
        plate: 'MH 14 EF 9012',
        status: 'Parked',
        customer: 'Rahul Roy',
        valet: 'Suresh Patil',
        valetId: 'V002',
        location: 'Phoenix Mall',
        subLocation: 'Level 1 - C56',
        entryTime: '4 Jan, 07:15 pm',
        duration: '1h 45m'
    },
    {
        id: 4,
        carModel: 'Hyundai Creta',
        plate: 'MH 04 GH 3456',
        status: 'Parked',
        customer: 'Sneha Gupta',
        valet: 'Rajesh Kumar',
        valetId: 'V001',
        location: 'Phoenix Mall',
        subLocation: 'Level 2 - B12',
        entryTime: '4 Jan, 08:00 pm',
        duration: '1h 0m'
    },
    {
        id: 5,
        carModel: 'BMW X1',
        plate: 'MH 01 IJ 7890',
        status: 'Returned',
        customer: 'Kabir Bedi',
        valet: 'Vikram Singh',
        valetId: 'V003',
        location: 'Phoenix Mall',
        subLocation: 'Output Gate',
        entryTime: '4 Jan, 04:00 pm',
        duration: 'Completed'
    }
];

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [parkingData] = useState(initialData);

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

    // Filter Data
    const filteredData = useMemo(() => {
        return parkingData.filter(item => {
            const matchesTab = activeTab === 'All' || item.status === activeTab;
            const lowerSearch = searchTerm.toLowerCase();
            const matchesSearch = 
                item.carModel.toLowerCase().includes(lowerSearch) ||
                item.plate.toLowerCase().includes(lowerSearch) ||
                item.customer.toLowerCase().includes(lowerSearch) ||
                item.valet.toLowerCase().includes(lowerSearch);
            
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchTerm, parkingData]);

    // Derived Status Classes
    const getStatusClass = (status) => {
        switch(status) {
            case 'Parked': return 'parked';
            case 'Retrieving': return 'retrieving'; // You might need CSS for this
            case 'Returned': return 'returned';     // And this
            default: return '';
        }
    };
    
    // Inline styles for chips if not in CSS
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
                    <span className="value">₹825</span>
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
