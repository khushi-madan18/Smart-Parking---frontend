import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Car, ChevronDown, Download } from 'lucide-react';
import './ParkingHistory.css';

const ParkingHistory = () => {
    const navigate = useNavigate();

    const historyData = [
        {
            id: 1,
            place: 'Phoenix Mall',
            location: 'Lower Parel, Mumbai',
            price: '₹180',
            status: 'completed',
            date: '8 Dec 2025',
            car: 'MH 12 AB 1234'
        },
        {
            id: 2,
            place: 'Central Plaza',
            location: 'Andheri West, Mumbai',
            price: '₹120',
            status: 'completed',
            date: '5 Dec 2025',
            car: 'MH 14 CD 5678'
        },
        {
            id: 3,
            place: 'City Center Mall',
            location: 'Bandra East, Mumbai',
            price: '₹200',
            status: 'completed',
            date: '3 Dec 2025',
            car: 'MH 12 AB 1234'
        }
    ];

    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="history-page">
            <div className="history-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px'}}>
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Parking History</h2>
                </div>
                <p style={{paddingLeft: '40px'}}>3 total bookings</p>
            </div>

            <div className="history-list">
                {historyData.map((item) => (
                    <div key={item.id} className="history-card">
                        <div className="card-top" onClick={() => toggleExpand(item.id)} style={{cursor: 'pointer'}}>
                            <div className="place-info">
                                <h3>{item.place}</h3>
                                <div className="location-row">
                                    <MapPin size={12} />
                                    <span>{item.location}</span>
                                </div>
                            </div>
                            <div className="cost-info">
                                <span className="price">{item.price}</span>
                                <span className="status-badge">{item.status}</span>
                            </div>
                        </div>
                        
                        {/* Divider only if expanded? Or always? Design shows divider then summary then details. */}
                        {/* Actually, user said "clicks down arrow booking details should open". */}
                        {/* I'll keep summary visible, and add details below. */}

                        <div className="card-divider"></div>

                        <div className="card-bottom" onClick={() => toggleExpand(item.id)} style={{cursor:'pointer'}}>
                            <div className="meta-item">
                                <Clock size={14} />
                                <span>{item.date}</span>
                            </div>
                            <div className="meta-item">
                                <Car size={14} />
                                <span>{item.car}</span>
                            </div>
                            <ChevronDown 
                                size={16} 
                                className={`expand-icon ${expandedId === item.id ? 'rotated' : ''}`}
                                style={{transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}
                            />
                        </div>

                        {/* Expanded Details Section */}
                        {expandedId === item.id && (
                            <div className="booking-details" style={{marginTop:'16px', borderTop:'1px dashed #e2e8f0', paddingTop:'16px'}}>
                                <h4 style={{fontSize:'12px', color:'#64748b', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.5px'}}>Booking Details</h4>
                                
                                <div className="detail-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px 8px'}}>
                                    <div className="d-item">
                                        <label style={{fontSize:'11px', color:'#94a3b8', display:'block'}}>Ticket ID</label>
                                        <span style={{fontSize:'13px', color:'#1e293b', fontWeight:'500'}}>TK-2025-12-{item.id < 10 ? '0'+item.id : item.id}</span>
                                    </div>
                                    <div className="d-item">
                                        <label style={{fontSize:'11px', color:'#94a3b8', display:'block'}}>Vehicle</label>
                                        <span style={{fontSize:'13px', color:'#1e293b', fontWeight:'500'}}>Toyota Camry<br/><span style={{fontSize:'11px', color:'#64748b'}}>{item.car}</span></span>
                                    </div>
                                    <div className="d-item">
                                        <label style={{fontSize:'11px', color:'#94a3b8', display:'block'}}>Entry</label>
                                        <span style={{fontSize:'13px', color:'#1e293b', fontWeight:'500'}}>10:30 am</span>
                                    </div>
                                    <div className="d-item">
                                        <label style={{fontSize:'11px', color:'#94a3b8', display:'block'}}>Exit</label>
                                        <span style={{fontSize:'13px', color:'#1e293b', fontWeight:'500'}}>02:45 pm</span>
                                    </div>
                                     <div className="d-item">
                                        <label style={{fontSize:'11px', color:'#94a3b8', display:'block'}}>Payment</label>
                                        <span style={{fontSize:'13px', color:'#1e293b', fontWeight:'500'}}>UPI</span>
                                    </div>
                                </div>

                                <div className="duration-box" style={{background:'#eff6ff', padding:'8px', borderRadius:'8px', margin:'16px 0', textAlign:'center', color:'#3b82f6', fontSize:'13px', fontWeight:'600'}}>
                                    Duration: 4h 15m
                                </div>

                                <button className="download-btn" style={{width:'100%', padding:'12px', background:'#4f46e5', color:'white', border:'none', borderRadius:'12px', fontWeight:'500', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                                    <Download size={16} />
                                    Download Receipt
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParkingHistory;
