import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    CheckCircle, 
    Truck, 
    Navigation, 
    Clock, 
    Car, 
    MapPin, 
    Phone, 
    MessageCircle 
} from 'lucide-react';
import { Workflow } from '../utils/workflow';
import './VehicleRetrieval.css';

const VehicleRetrieval = () => {
    const navigate = useNavigate();
    const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || 'null'));
    const [activeRequest, setActiveRequest] = useState(null);
    const [status, setStatus] = useState('requested'); // UI status mapping

    useEffect(() => {
        if (!currentUser) return;

        const checkStatus = async () => {
            const req = await Workflow.getActive(currentUser.id);
            if (req) {
                setActiveRequest(req);
                // Map backend status to UI timeline status
                if (req.status === 'retrieving') {
                     setStatus('onWay');
                } else if (req.status === 'vehicle_arrived') {
                     setStatus('arriving');
                } else {
                     setStatus('requested'); // Default for 'retrieval_requested'
                }
            } else {
                // If no active request, maybe completed? Navigate home?
                // navigate('/home');
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 1000);
        return () => clearInterval(interval);
    }, [currentUser]);

    const handleComplete = async () => {
        if (activeRequest) {
            await Workflow.updateStatus(activeRequest.id, 'completed');
            navigate('/home');
        }
    };

    const timelineSteps = [
        {
            id: 'requested',
            title: 'Request Received',
            desc: 'Valet has been notified',
            icon: <CheckCircle size={20} />,
            activeStates: ['requested', 'onWay', 'arriving']
        },
        {
            id: 'onWay',
            title: 'Car on the Way',
            desc: 'Vehicle is being brought',
            icon: <Truck size={20} />,
            activeStates: ['onWay', 'arriving']
        },
        {
            id: 'arriving',
            title: 'Car Arriving',
            desc: 'Ready for pickup',
            icon: <Navigation size={20} />,
            activeStates: ['arriving']
        }
    ];

    const [showNotification, setShowNotification] = useState(false);
    
    // Track previous status to trigger notification
    useEffect(() => {
        if (status === 'onWay') {
            setShowNotification(true);
            const timer = setTimeout(() => setShowNotification(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <div className="retrieval-page">
            
            {/* WhatsApp Notification Simulation */}
            {showNotification && (
                <div className="whatsapp-toast">
                    <div className="wa-icon">
                        <Phone size={24} fill="white" strokeWidth={0} />
                    </div>
                    <div className="wa-content">
                        <div className="wa-header">
                            <span className="wa-name">WhatsApp</span>
                            <span className="wa-time">now</span>
                        </div>
                        <p className="wa-msg">🚗 Your car is on the way! Our valet is bringing your vehicle to the pickup point.</p>
                    </div>
                </div>
            )}

            <div className="retrieval-header">
                <div className="header-content">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Vehicle Retrieval</h2>
                </div>
            </div>

            {/* Dynamic Status Card */}
            <div className={`status-card ${status === 'requested' ? 'blue' : status === 'arriving' ? 'green' : 'orange'}`}>
                <div className="status-header">
                    <div className="status-icon-box">
                        <CheckCircle size={24} color="white" />
                    </div>
                    <div className="status-text">
                        <h3>
                            {status === 'requested' ? 'Request Received' : 
                             status === 'onWay' ? 'Car on the Way' : 'Car Arriving'}
                        </h3>
                        <p>
                            {status === 'requested' ? 'Our valet has been notified' : 
                             status === 'onWay' ? 'Your vehicle is being brought to the pickup point' :
                             'Ready for pickup!'}
                        </p>
                    </div>
                </div>
                
                {status !== 'arriving' && (
                    <div className="time-badge">
                        <Clock size={16} />
                        Estimated time: {status === 'requested' ? '5-7 minutes' : '~3 minutes'}
                    </div>
                )}
            </div>

            {/* Timeline */}
            <div className="progress-card">
                <div className="card-title">Retrieval Progress</div>
                <div className="timeline">
                    {timelineSteps.map((step) => {
                        const isActive = step.activeStates.includes(status);
                        return (
                            <div key={step.id} className="timeline-step">
                                <div className={`step-circle ${isActive ? 'active' : ''}`}>
                                    {isActive ? step.icon : <Navigation size={18} className="inactive-icon" />}
                                </div>
                                <div className="step-content">
                                    <h4>{step.title}</h4>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Parking Details */}
            {activeRequest && (
                <div className="details-card">
                    <div className="card-title">Parking Details</div>
                    
                    <div className="detail-row">
                        <Car className="detail-icon" size={20} />
                        <div className="detail-info">
                            <label>Vehicle</label>
                            <p>{activeRequest.vehicle?.model || 'Vehicle'}</p>
                            <span>{activeRequest.vehicle?.plate || 'Unknown Plate'}</span>
                        </div>
                    </div>

                    <div className="detail-row">
                        <MapPin className="detail-icon" size={20} />
                        <div className="detail-info">
                            <label>Location</label>
                            <p>{activeRequest.location || 'Inorbit Mall'}</p>
                        </div>
                    </div>

                    <div className="detail-row">
                        <Clock className="detail-icon" size={20} />
                        <div className="detail-info">
                            <label>Entry Time</label>
                            <p>{new Date(activeRequest.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Support Button */}
            <div className="support-container">
                <button className="support-btn">
                    <Phone size={20} />
                    Call Support
                </button>
            </div>

            {/* Complete & Exit Section (Visible only when Arriving) */}
            {status === 'arriving' && (
                <div className="exit-card">
                    <div className="exit-text">
                        🎉 Your vehicle is ready at the pickup point!
                    </div>
                    <button className="exit-btn" onClick={handleComplete}>
                        Complete & Exit Parking
                    </button>
                </div>
            )}

        </div>
    );
};

export default VehicleRetrieval;
