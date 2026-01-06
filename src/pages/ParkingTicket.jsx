import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Car, MapPin, Clock, CreditCard, Download, Share2, Smartphone, Hash } from 'lucide-react';
import { QrCode } from 'lucide-react';
import { Workflow } from '../utils/workflow';
import './ParkingTicket.css';

const ParkingTicket = () => {
  const navigate = useNavigate();
  
  const formatDuration = (timestamp) => {
      const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
      if (diff < 60) return `${diff}m`;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return `${h}h ${m}m`;
  };

  const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || 'null'));
  const [activeRequest, setActiveRequest] = useState(null);

  useEffect(() => {
    if (!currentUser) {
        navigate('/login');
        return;
    }

    const checkActive = () => {
        const reqs = Workflow.getUserActiveRequests(currentUser.id);
        if (reqs && reqs.length > 0) {
            setActiveRequest(reqs[0]);
        } else {
            // Requirement: "when there's no active parking the ticket route when clicked should not open"
            // Redirect back to home
            navigate('/home'); 
        }
    };

    checkActive();
    // Optional: Poll for status updates (e.g. if retrieval starts)
    const interval = setInterval(checkActive, 2000);
    return () => clearInterval(interval);

  }, [currentUser, navigate]);

  const handleRetrieval = () => {
      if (activeRequest) {
          // Initiate retrieval
          Workflow.updateStatus(activeRequest.id, 'retrieval_requested');
          
          // Navigate to Retrieval Timeline Page as per latest flow
          navigate('/retrieval');
      }
  };

  if (!activeRequest) {
      return (
          <div className="ticket-page" style={{justifyContent:'center', alignItems:'center'}}>
              <div className="pulse-dot" style={{background:'#4834d4', width:'12px', height:'12px'}}></div>
              <span style={{marginTop:'12px', color:'#64748b'}}>Loading Ticket...</span>
          </div>
      );
  }

  return (
    <div className="ticket-page">
      <div className="ticket-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>
        <h2>Parking Ticket</h2>
      </div>

      <div className="active-banner" style={{background: '#059669'}}>
        <div className="pulse-dot"></div>
        <span>Active Parking Session</span>
      </div>

      <div className="ticket-card">
        {/* ... existing card content ... */}
        <div className="ticket-top">
            <h3>Smart Parking System</h3>
            <h2>Digital Parking Ticket</h2>
            <div className="mall-name">{activeRequest.location || 'Inorbit Mall'}</div>

            <div className="qr-container">
               <QrCode size={80} color="#2d3436" />
            </div>
        </div>

        <div className="ticket-details">
            <div className="ticket-row">
               <Hash size={18} />
               <div className="row-content">
                  <span className="row-label">Ticket ID</span>
                  {/* Safely handle ID */}
                  <span className="row-value">{`TK-${new Date().getFullYear()}-${String(activeRequest.id).slice(0,8)}`}</span>
               </div>
            </div>

            <div className="ticket-row">
               <Car size={18} />
               <div className="row-content">
                  <span className="row-label">Vehicle</span>
                  <span className="row-value">{activeRequest.vehicle?.model || 'Vehicle'}</span>
                  <span className="row-value sub">{activeRequest.vehicle?.plate || 'Unknown Plate'}</span>
               </div>
            </div>

            <div className="ticket-row">
               <MapPin size={18} />
               <div className="row-content">
                  <span className="row-label">Location</span>
                  <span className="row-value">{activeRequest.location}</span>
               </div>
            </div>

            <div className="ticket-row">
               <Clock size={18} />
               <div className="row-content">
                  <span className="row-label">Entry Time</span>
                  <span className="row-value">{new Date(activeRequest.timestamp).toLocaleString([], {weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}</span>
                  <span className="row-value sub">Duration: {formatDuration(activeRequest.timestamp)}</span>
               </div>
            </div>

            <div className="ticket-row">
               <CreditCard size={18} />
               <div className="row-content">
                  <span className="row-label">Amount Paid</span>
                  <span className="row-value">₹150</span>
               </div>
            </div>
        </div>
        
         <div className="powered-by" style={{textAlign: 'center', paddingBottom: '20px', fontSize: '11px', color: '#ccc'}}>
            Powered by Smart Parking
         </div>
      </div>

      <div className="ticket-actions">
         <button 
            className="primary-btn"
            onClick={handleRetrieval}
         >
            <Car size={20} />
            <span>Get My Car</span>
         </button>

         <button className="secondary-btn">
            <Download size={20} />
            <span>Download Ticket</span>
         </button>


         <button className="secondary-btn">
            <Share2 size={20} />
            <span>Share Ticket</span>
         </button>
      </div>

      <div className="ticket-warning">
         <Smartphone size={20} color="#d97706" />
         <div className="warning-text">
            <h4>Keep this ticket handy</h4>
            <p>Show this QR code when retrieving your vehicle</p>
         </div>
      </div>

    </div>
  );
};

export default ParkingTicket;
