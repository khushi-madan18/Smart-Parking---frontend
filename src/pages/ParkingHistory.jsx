import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Car, ChevronDown, Download } from 'lucide-react';
import { Workflow } from '../utils/workflow';
import './ParkingHistory.css';

const ParkingHistory = () => {
    const navigate = useNavigate();
    const [historyData, setHistoryData] = useState([]);
    const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || 'null'));

    useEffect(() => {
        if (!currentUser) return;

        const fetchHistory = async () => {
             const all = await Workflow.getAll();
             const myHistory = all.filter(r => r.userId === currentUser.id && r.status === 'completed')
                                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
     
             // Helper to get address based on mall name
             const getAddress = (mallName) => {
                 if (!mallName) return 'Mumbai, India';
                 if (mallName.includes('Phoenix')) return 'Lower Parel, Mumbai';
                 if (mallName.includes('Inorbit')) return 'Malad West, Mumbai';
                 if (mallName.includes('R City')) return 'Ghatkopar, Mumbai';
                 return 'Mumbai, India';
             };
     
             const formatted = myHistory.map(r => {
                  // Use Parked Time (Actual Entry) if available, otherwise Booking Time
                  const entry = r.parkedTimestamp ? new Date(r.parkedTimestamp) : new Date(r.timestamp);
                  let exitTimeStr = '--';
                  let durationStr = '--';
     
                  // Calculate Duration & Price
                  let priceVal = 50; // Minimum price
                  
                  if (r.exitTimestamp) {
                     const exit = new Date(r.exitTimestamp);
                     exitTimeStr = exit.toLocaleString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true});
                     
                     const diffMs = exit - entry;
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
                     place: r.location || 'Phoenix Mall',
                     location: getAddress(r.location),
                     price: `₹${priceVal}`,
                     status: 'completed',
                     date: entry.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}),
                     car: r.vehicle?.plate || 'Unknown',
                     vehicleModel: r.vehicle?.model || 'Vehicle',
                     entryTime: entry.toLocaleString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true}),
                     exitTime: exitTimeStr,
                     ticketId: `TK-${entry.getFullYear()}-${String(r.id).slice(-6)}`,
                     duration: durationStr,
                     rawPrice: priceVal,
                     rawEntry: entry,
                     rawExit: r.exitTimestamp ? new Date(r.exitTimestamp) : null
                  };
             });
             
             setHistoryData(formatted);
        };

        fetchHistory();
    }, [currentUser]);

    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleDownloadReceipt = (item) => {
        const receiptContent = `
        SMART PARKING RECEIPT
        ---------------------
        Ticket ID: ${item.ticketId}
        Date: ${item.date}
        
        Location: ${item.place}
        Address: ${item.location}
        
        Vehicle: ${item.vehicleModel} (${item.car})
        ---------------------
        Entry: ${item.entryTime}
        Exit:  ${item.exitTime}
        Duration: ${item.duration}
        ---------------------
        Total Amount: ${item.price}
        Payment Method: UPI
        Status: Paid
        
        Thank you for parking with us!
        `;
        
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${item.ticketId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
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
                <p style={{paddingLeft: '40px'}}>{historyData.length} total bookings</p>
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
                                        <span style={{fontSize:'13px', color:'#1e293b', fontWeight:'500'}}>{item.ticketId}</span>
                                    </div>
                                    <div className="d-item">
                                        <label style={{fontSize:'11px', color:'#94a3b8', display:'block'}}>Vehicle</label>
                                        <span style={{fontSize:'13px', color:'#1e293b', fontWeight:'500'}}>{item.vehicleModel}<br/><span style={{fontSize:'11px', color:'#64748b'}}>{item.car}</span></span>
                                    </div>
                                    <div className="d-item">
                                        <label style={{fontSize:'11px', color:'#94a3b8', display:'block'}}>Entry</label>
                                        <span style={{fontSize:'13px', color:'#1e293b', fontWeight:'500'}}>{item.entryTime}</span>
                                    </div>
                                    <div className="d-item">
                                        <label style={{fontSize:'11px', color:'#94a3b8', display:'block'}}>Exit</label>
                                        <span style={{fontSize:'13px', color:'#1e293b', fontWeight:'500'}}>{item.exitTime}</span>
                                    </div>
                                     <div className="d-item">
                                        <label style={{fontSize:'11px', color:'#94a3b8', display:'block'}}>Payment</label>
                                        <span style={{fontSize:'13px', color:'#1e293b', fontWeight:'500'}}>UPI</span>
                                    </div>
                                </div>

                                <div className="duration-box" style={{background:'#eff6ff', padding:'8px', borderRadius:'8px', margin:'16px 0', textAlign:'center', color:'#3b82f6', fontSize:'13px', fontWeight:'600'}}>
                                    Duration: {item.duration}
                                </div>

                                <button 
                                    className="download-btn" 
                                    onClick={() => handleDownloadReceipt(item)}
                                    style={{width:'100%', padding:'12px', background:'#4f46e5', color:'white', border:'none', borderRadius:'12px', fontWeight:'500', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}
                                >
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
