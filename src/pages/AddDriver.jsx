import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Camera, User, Phone, Mail, MapPin, Calendar, CreditCard, Upload, X 
} from 'lucide-react';
import './AddDriver.css';

const AddDriver = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // Form and Validation State
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        dob: '',
        licenseNumber: '',
        licenseExpiry: ''
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [licensePreview, setLicensePreview] = useState(null);
    const [isValid, setIsValid] = useState(false);

    // Camera State
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Validate Form
    useEffect(() => {
        const { fullName, phone, licenseNumber } = formData;
        // Basic validation: required fields + photos
        const valid = 
            fullName.trim() !== '' && 
            phone.trim() !== '' && 
            licenseNumber.trim() !== '' &&
            photoPreview !== null &&
            licensePreview !== null;
        
        setIsValid(valid);
    }, [formData, photoPreview, licensePreview]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!isValid) return;

        // Create driver object
        const newDriver = {
            id: Date.now(),
            ...formData,
            photo: photoPreview,
            licensePhoto: licensePreview,
            status: 'Pending',
            submittedAt: new Date().toLocaleDateString()
        };

        // Save to localStorage (Simulating backend submission)
        const pendingDrivers = JSON.parse(localStorage.getItem('pendingDrivers') || '[]');
        localStorage.setItem('pendingDrivers', JSON.stringify([...pendingDrivers, newDriver]));

        // Navigate or show success
        alert("Driver submitted for Super Admin approval!");
        navigate('/manager');
    };

    const startCamera = async () => {
        try {
            setShowCamera(true);
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Unable to access camera. Please allow camera permissions.");
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setPhotoPreview(dataUrl);
            stopCamera();
        }
    };

    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleLicenseChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLicensePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="add-driver-page">
            <div className="form-header">
                <div className="header-row">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} color="white" />
                    </button>
                    <h2>Add Driver/Valet</h2>
                </div>
                <p>Fill in the details to add a new driver</p>
            </div>

            <div className="form-content">
                
                {/* Photo Upload */}
                <div className="photo-section">
                    <label className="section-label">Driver Photo *</label>
                    <div 
                        className={`upload-circle ${photoPreview ? 'has-image' : ''}`} 
                        onClick={startCamera}
                    >
                        {photoPreview ? (
                            <>
                                <img src={photoPreview} alt="Driver Preview" className="preview-image" />
                                <div className="retake-overlay">
                                    <Camera size={24} />
                                    <span>Retake</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <Camera size={24} />
                                <span>Take Photo</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Personal Details */}
                <div className="form-section">
                    <h3>Personal Details</h3>
                    
                    <div className="input-group">
                        <label>Full Name *</label>
                        <div className="input-wrapper">
                            <User size={18} />
                            <input 
                                type="text" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter full name" 
                                className="form-input" 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Phone Number *</label>
                        <div className="input-wrapper">
                            <Phone size={18} />
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+91 98765 43210" 
                                className="form-input" 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <Mail size={18} />
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="driver@example.com" 
                                className="form-input" 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Address</label>
                        <div className="input-wrapper">
                            <MapPin size={18} />
                            <input 
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address" 
                                className="form-input" 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Date of Birth</label>
                        <div className="input-wrapper">
                            <Calendar size={18} />
                            <input 
                                type="text" 
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                placeholder="dd/mm/yyyy" 
                                className="form-input" 
                            />
                        </div>
                    </div>
                </div>

                {/* License Details */}
                <div className="form-section">
                    <h3>License Details</h3>
                    
                    <div className="input-group">
                        <label>Driving License Number *</label>
                        <div className="input-wrapper">
                            <CreditCard size={18} />
                            <input 
                                type="text" 
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleInputChange}
                                placeholder="DL-1420110012345" 
                                className="form-input" 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>License Expiry Date</label>
                        <div className="input-wrapper">
                            <Calendar size={18} />
                            <input 
                                type="text" 
                                name="licenseExpiry"
                                value={formData.licenseExpiry}
                                onChange={handleInputChange}
                                placeholder="dd/mm/yyyy" 
                                className="form-input" 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>License Photo *</label>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={handleLicenseChange}
                        />
                        <div 
                            className={`upload-rect ${licensePreview ? 'has-image' : ''}`} 
                            onClick={handleFileClick}
                        >
                             {licensePreview ? (
                                <>
                                    <img src={licensePreview} alt="License Preview" className="preview-image" />
                                    <div className="retake-overlay">
                                        <Upload size={24} />
                                        <span>Change Photo</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Upload size={24} />
                                    <span>Upload License Photo</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <button 
                    className={`submit-btn ${isValid ? 'active' : ''}`}
                    onClick={handleSubmit}
                    disabled={!isValid}
                >
                    Submit for Approval
                </button>

            </div>

            {/* Modal-style Camera Overlay */}
            {showCamera && (
                <div className="camera-overlay">
                    <div className="camera-modal">
                        <button className="close-camera-btn" onClick={stopCamera}>
                            <X size={20} />
                        </button>
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="camera-video"
                        />
                        <div className="camera-controls">
                            <button className="capture-btn" onClick={capturePhoto}>
                                <div className="capture-inner"></div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddDriver;
