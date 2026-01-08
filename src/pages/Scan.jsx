import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, QrCode, Car, ChevronRight } from 'lucide-react';
import './Scan.css';

const Scan = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    // Simulate finding a QR code after 0.5 seconds
    const detectionTimer = setTimeout(() => {
        setIsDetected(true);
    }, 500);

    // Show popup shortly after detection simulation
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 800);

    return () => {
        clearTimeout(detectionTimer);
        clearTimeout(popupTimer);
    };
  }, []);

  return (
    <div className="scan-page">
      <div className="scan-header">
        <h2>Scan QR Code</h2>
        <button className="close-btn" onClick={() => navigate('/')}>
          <X size={24} />
        </button>
      </div>

      <div className="scanner-container">
        <div className="scanner-frame">
             {/* Corner borders simulated via CSS */}
             <div className="corner-bottom-left"></div>
             <div className="corner-bottom-right"></div>
             
             <QrCode size={64} className="qr-icon-placeholder" color="white" />
        </div>

        <div className="scan-instruction-box">
             {isDetected ? (
                 <>
                    <h3>QR Code Detected!</h3>
                    <p>Inorbit Mall</p>
                 </>
             ) : (
                <>
                    <h3>Position QR code within frame</h3>
                    <p>The scanner will automatically detect the code</p>
                </>
             )}
        </div>
      </div>

      {showPopup && (
        <div className="bottom-sheet-overlay" onClick={() => setShowPopup(false)}>
           <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-handle"></div>
              
              <div className="sheet-header">
                 <h3>Select Your Vehicle</h3>
                 <p>Choose which vehicle you're parking at Inorbit Mall</p>
              </div>

              <div className="vehicle-list">
                 <div className="vehicle-option" onClick={() => navigate('/booking')}>
                    <div className="vehicle-left">
                       <Car size={24} />
                       <div className="vehicle-details">
                          <h4>Toyota Camry</h4>
                          <span>MH 12 AB 1234</span>
                       </div>
                    </div>
                    <ChevronRight size={20} color="#ccc" />
                 </div>

                 <div className="vehicle-option" onClick={() => navigate('/booking')}>
                    <div className="vehicle-left">
                       <Car size={24} />
                       <div className="vehicle-details">
                          <h4>Honda Civic</h4>
                          <span>MH 14 CD 5678</span>
                       </div>
                    </div>
                    <ChevronRight size={20} color="#ccc" />
                 </div>
              </div>

              <button className="register-btn" onClick={() => navigate('/register-vehicle')}>
                 Register New Vehicle
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Scan;
