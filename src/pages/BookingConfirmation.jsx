import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Car, MapPin, Smartphone, CreditCard, Banknote, Landmark, Loader2 } from 'lucide-react';
import { Workflow } from '../utils/workflow';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || 'null'));

  useEffect(() => {
      if (!currentUser) {
          navigate('/login');
      }
  }, [currentUser, navigate]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    // We can keep the delay for UX simulation + async call
    
    if (currentUser) {
        const model = document.getElementById('vehicle-model').value || 'Toyota Camry';
        const plate = document.getElementById('vehicle-plate').value || 'MH 12 AB 1234';
        
        await Workflow.createRequest(
            currentUser, 
            { plate, model }, 
            'Inorbit Mall'
        );
    }
    
    setTimeout(() => {
        setIsProcessing(false);
        // Navigate to Home to see the live status
        navigate('/home');
    }, 2000);
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h2>Confirm Parking</h2>
      </div>

      <div className="success-banner">
        <CheckCircle size={16} />
        <span>Auto-filled from saved vehicle</span>
      </div>

      <div className="info-card">
        <div className="card-title">
          <Car size={16} />
          <span>Vehicle Details</span>
        </div>
        
        {/* Simple inline registration/selection for now */}
        <div className="detail-row">
           <span className="label">Owner</span>
           <span className="value">{currentUser?.name || 'User'}</span>
        </div>

        <div style={{marginTop: '12px'}}>
            <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Select or Enter Vehicle Model</label>
            <input 
                type="text" 
                placeholder="e.g. Toyota Camry"
                style={{width:'100%', padding:'8px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'14px', marginBottom:'12px'}}
                id="vehicle-model"
                defaultValue="Toyota Camry"
            />
            
            <label style={{fontSize:'12px', color:'#64748b', display:'block', marginBottom:'4px'}}>Vehicle Plate Number</label>
            <input 
                type="text" 
                placeholder="e.g. MH 12 AB 1234"
                style={{width:'100%', padding:'8px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'14px', textTransform:'uppercase'}}
                id="vehicle-plate"
                defaultValue="MH 12 AB 1234"
            />
        </div>
      </div>

      <div className="info-card">
        <div className="card-title">
           <MapPin size={16} />
           <span>Parking Location</span>
        </div>
        <div className="location-content">Inorbit Mall</div>
        <div className="location-sub">Malad West, Mumbai</div>
      </div>

      <div className="payment-section">
         <div className="section-label">Payment Method</div>
         <span className="section-sublabel">Choose how you want to pay</span>
         
         <div className="payment-grid">
            <div 
              className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
               <Smartphone size={24} />
               <span className="payment-label">UPI</span>
               {paymentMethod === 'upi' && <CheckCircle size={14} color="#4834d4" />}
            </div>

            <div 
              className={`payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('netbanking')}
            >
               <Landmark size={24} />
               <span className="payment-label">Netbanking</span>
            </div>

            <div 
              className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
               <CreditCard size={24} />
               <span className="payment-label">Credit/Debit Card</span>
            </div>

            <div 
              className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
               <Banknote size={24} />
               <span className="payment-label">Cash</span>
            </div>
         </div>
      </div>

      <div className="cost-summary">
         <div className="cost-row">
            <span>Base Rate</span>
            <span>₹100</span>
         </div>
         <div className="cost-row">
            <span>Service Fee</span>
            <span>₹30</span>
         </div>
         <div className="cost-row">
            <span>GST (18%)</span>
            <span>₹20</span>
         </div>
         <div className="cost-row total">
            <span>Total Amount</span>
            <span>₹150</span>
         </div>
      </div>

      <button 
        className="park-btn" 
        onClick={handlePayment} 
        disabled={isProcessing}
        style={{ opacity: isProcessing ? 0.8 : 1 }}
      >
         {isProcessing ? (
             <>
                <Loader2 size={20} className="animate-spin" />
                <span>Processing Payment...</span>
             </>
         ) : (
             <>
                <Car size={20} />
                <span>Park My Car</span>
             </>
         )}
      </button>

    </div>
  );
};

export default BookingConfirmation;
