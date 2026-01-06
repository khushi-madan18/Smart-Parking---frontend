import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
    Bell, Car, User, MapPin, Clock, ChevronRight, CheckCircle, LogOut
} from 'lucide-react';
import { Workflow } from '../utils/workflow';
import './DriverDashboard.css';

const DriverDashboard = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };
    const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || 'null'));
    
    const [pendingRequests, setPendingRequests] = useState([]);
    const [activeJob, setActiveJob] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [stats, setStats] = useState({ today: 0, parked: 0, retrieved: 0 });

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const syncData = () => {
            const allRequests = Workflow.getAll();
            const myJob = Workflow.getDriverActive(currentUser.id);
            // Only update if not animating locally to prevent flicker
            setActiveJob(prev => (prev && prev._localStatus === 'animating') ? prev : (myJob || null));

            // Always check for pending requests to show "New Assignments"
            const pending = Workflow.getPending();
            setPendingRequests(pending);

            // Calculate Stats for Today
            const todayStr = new Date().toDateString();
            const myJobsToday = allRequests.filter(r => 
                r.valetId === currentUser.id && 
                new Date(r.timestamp).toDateString() === todayStr
            );

            const parkedCount = myJobsToday.filter(r => 
                ['parked', 'retrieval_requested', 'retrieving', 'completed', 'vehicle_arrived'].includes(r.status)
            ).length;

            const retrievedCount = myJobsToday.filter(r => 
                ['completed'].includes(r.status)
            ).length;

            setStats({
                today: myJobsToday.length,
                parked: parkedCount,
                retrieved: retrievedCount
            });
        };

        syncData();
        const interval = setInterval(syncData, 1000);
        return () => clearInterval(interval);
    }, [currentUser, navigate]);

    const handleAccept = (req) => {
        Workflow.acceptRequest(req.id, currentUser);
        // Force local update immediately for better UX
        setActiveJob({...req, status: 'assigned', valetId: currentUser.id});
        // Remove from pending immediately to prevent duplicate display
        setPendingRequests(prev => prev.filter(p => p.id !== req.id));
    };

    const handleStartJob = () => {
        if (!activeJob) return;

        // 1. Parking Flow
        if (activeJob.status === 'assigned') {
            runAnimation('Parking Vehicle...', 'Vehicle Parked Successfully', 'parked');
        } 
        // 2. Retrieval Flow
        else if (activeJob.status === 'retrieval_requested') {
            // "Retrieving..." animation -> "Arrived" status
            runAnimation('Retrieving Vehicle...', 'Vehicle Arrived at Point', 'vehicle_arrived');
        }
    };

    // Note: handleMarkArrived is no longer needed with the auto-animation flow, but we can keep it safely or remove if preferred.
    // I will remove it to keep code clean if it's not used.
    
    const runAnimation = (loadingMsg, successText, finalStatus) => {
        // Set local animating state
        setActiveJob(prev => ({ 
            ...prev, 
            _localStatus: 'animating', 
            _loadingMsg: loadingMsg 
        }));

        // If retrieval, we technically enter 'retrieving' state during animation
        if (finalStatus === 'vehicle_arrived') {
             Workflow.updateStatus(activeJob.id, 'retrieving');
        }

        setTimeout(() => {
            // Update Workflow status to final (parked or vehicle_arrived)
            Workflow.updateStatus(activeJob.id, finalStatus);
            
            // Show Success Screen
            setSuccessMsg(successText);
            setShowSuccess(true);
            
            // Allow success screen to show for 2s then clear
            setTimeout(() => {
                setShowSuccess(false);
                // For both parking and retrieval (arrived), the driver's job is done/waiting
                // If parked: driver waits? No, usually 'parked' job clears or stays?
                // Previously: parked job stayed as "Vehicle Parked (Waiting)".
                // User wants: "redirect to driver's dashboard... if new requests show them".
                // This implies the job is Cleared from the "Current Assignment" view.
                
                if (finalStatus === 'parked') {
                    // If parked, keep it visible? Or clear it? 
                    // "Correct numbers should be shown in today, parked...".
                    // If we clear it, activeJob becomes null.
                    // Let's clear it to allow picking new jobs.
                     setActiveJob(null);
                } else {
                     setActiveJob(null);
                }
            }, 2000);
        }, 3000); // 3s animation
    };

    // Computed Properties
    const isAnimating = activeJob && activeJob._localStatus === 'animating';
    const isRetrievalTask = activeJob && (activeJob.status === 'retrieval_requested' || activeJob.status === 'retrieving' || activeJob.status === 'vehicle_arrived');
    const isParked = activeJob && activeJob.status === 'parked';

    return (
        <div className="driver-page">
            
            {/* Success Overlay */}
            {showSuccess && (
                <div className="success-screen">
                    <div className="success-icon">
                        <CheckCircle size={40} strokeWidth={3} />
                    </div>
                    <h2 className="success-title">Task Completed!</h2>
                    <p className="success-desc">{successMsg}</p>
                </div>
            )}

            {/* Header */}
            <div className="driver-header">
                <div className="header-top">
                    <div>
                        <p className="welcome-text">Driver Console</p>
                        <h2 className="driver-name">Welcome back,<br/>{currentUser.name}</h2>
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
                        <button className="notif-btn">
                            <Bell size={20} />
                            {pendingRequests.length > 0 && <span className="notif-badge">{pendingRequests.length}</span>}
                        </button>
                        <button onClick={handleLogout} className="notif-btn" style={{background: 'rgba(255,255,255,0.2)'}}>
                            <LogOut size={20} color="white" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="driver-content">
                
                {/* 1. New Assignments */}
                {pendingRequests.length > 0 && (
                    <>
                        <div className="section-title">
                            <Bell size={16} color="#4f46e5" /> New Assignments
                        </div>
                        {pendingRequests.map(req => (
                            <div key={req.id} className="task-card">
                                <div className="task-header">
                                    <div className="car-thumb" style={{background: '#e0e7ff', color: '#4f46e5'}}>
                                        <Car size={32} />
                                    </div>
                                    <div className="task-info">
                                        <h3>{req.vehicle?.model || 'Vehicle'}</h3>
                                        <span className="plate-no">{req.vehicle?.plate || 'Unknown Plate'}</span>
                                        {req.status === 'retrieval_requested' ? (
                                            <span className="task-badge retrieve" style={{background:'#fef3c7', color:'#d97706'}}>Retrieve Vehicle</span>
                                        ) : (
                                            <span className="task-badge park">Park Vehicle</span>
                                        )}
                                    </div>
                                </div>
                                <button className="assignment-btn accept" onClick={() => handleAccept(req)}>
                                    Accept Assignment <ChevronRight size={18} />
                                </button>
                            </div>
                        ))}
                    </>
                )}

                {/* 2. Current Assignment Area */}
                {activeJob && !isAnimating ? (
                    <>
                        <div className="section-title">Current Assignment</div>
                        <div className="task-card">
                        
                            {/* Card Header */}
                            <div className="task-header">
                                <div className="car-thumb" style={{background: isRetrievalTask ? '#fff7ed' : '#ecfdf5', color: isRetrievalTask ? '#ea580c' : '#059669'}}>
                                    <Car size={32} />
                                </div>
                                <div className="task-info">
                                    <h3>{activeJob.vehicle?.model}</h3>
                                    <span className="plate-no">{activeJob.vehicle?.plate}</span>
                                    {isRetrievalTask ? (
                                        <span className="task-badge retrieve" style={{background:'#fef3c7', color:'#d97706'}}>Retrieve Vehicle</span>
                                    ) : (
                                        <span className="task-badge park">Park Vehicle</span>
                                    )}
                                </div>
                            </div>

                            {/* Details List */}
                            <div className="detail-list">
                                <div className="detail-item">
                                    <User className="d-icon" />
                                    <div className="d-content">
                                        <label>Customer</label>
                                        <p>{activeJob.userName}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <MapPin className="d-icon" />
                                    <div className="d-content">
                                        <label>Location</label>
                                        <p>{activeJob.location}</p>
                                        <p style={{fontSize:'12px', color:'#94a3b8', fontWeight:'normal'}}>Lower Parel, Mumbai</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <MapPin className="d-icon" />
                                    <div className="d-content">
                                        <label>{isRetrievalTask ? 'Retrieve from' : 'Park at'}</label>
                                        <p>Level 2 - B34</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Clock className="d-icon" />
                                    <div className="d-content">
                                        <label>Assigned at</label>
                                        <p>{new Date(activeJob.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            {isParked ? (
                                <button className="assignment-btn" disabled style={{background:'#f1f5f9', color:'#64748b', cursor:'default'}}>
                                    Vehicle Parked (Waiting for Request)
                                </button>
                            ) : (
                                <button 
                                    className={`assignment-btn ${isRetrievalTask ? 'retrieve-btn' : 'start'}`}
                                    style={isRetrievalTask ? {background:'#ea580c', color:'white'} : {}} 
                                    onClick={handleStartJob}
                                >
                                    {isRetrievalTask ? 'Start Retrieval' : 'Start Parking'}
                                </button>
                            )}
                        </div>
                    </>
                ) : isAnimating ? (
                    /* 3. Animating View */
                    <>
                         <div className="section-title">Current Assignment</div>
                         <div className="retrieval-card">
                            <div className="retrieval-icon-large">
                                <Car size={40} />
                            </div>
                            <h3 className="retrieval-title">{activeJob._loadingMsg}</h3>
                            <p className="retrieval-subtitle">{activeJob.vehicle?.model}</p>
                            <p className="retrieval-subtitle" style={{fontSize:'12px', opacity:0.7}}>{activeJob.vehicle?.plate}</p>
                            
                            <div className="progress-container">
                                <div className="progress-bar animate"></div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* 4. Empty State */
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding: '60px 0'}}>
                        <div style={{
                            width:'80px', height:'80px', background:'#ecfdf5', borderRadius:'50%', 
                            display:'flex', alignItems:'center', justifyContent:'center', color:'#10b981', marginBottom:'24px'
                        }}>
                            <CheckCircle size={40} />
                        </div>
                        <h3 style={{fontSize:'18px', color:'#1e293b', marginBottom:'8px'}}>All Caught Up!</h3>
                        <p style={{fontSize:'14px', color:'#64748b', textAlign:'center', maxWidth:'250px'}}>
                            {pendingRequests.length > 0 ? 'You have new requests waiting above.' : 'No new parking or retrieval assignments at the moment.'}
                        </p>
                    </div>
                )}

            </div>

            {/* Sticky Stats Footer */}
            <div className="driver-stats">
                <div className="stat-item">
                    <label>Today</label>
                    <span className="val neutral">{stats.today}</span>
                </div>
                <div className="stat-item">
                    <label>Parked</label>
                    <span className="val green">{stats.parked}</span>
                </div>
                <div className="stat-item">
                    <label>Retrieved</label>
                    <span className="val orange">{stats.retrieved}</span>
                </div>
            </div>

        </div>
    );
};

export default DriverDashboard;
