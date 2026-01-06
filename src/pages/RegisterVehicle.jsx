import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Hash, Car, Phone, Zap } from 'lucide-react';
import './RegisterVehicle.css';

const RegisterVehicle = () => {
  const navigate = useNavigate();
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    plateNumber: '',
    mobile: ''
  });
  
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Regex patterns
  const plateRegex = /^[A-Z]{2}\s\d{2}\s[A-Z]{1,3}\s\d{4}$/i; 
  const phoneRegex = /^\d{10}$/; 

  // Refs for click outside
  const brandRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const isValid = 
        formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        selectedBrand !== '' &&
        selectedModel !== '' &&
        plateRegex.test(formData.plateNumber) &&
        phoneRegex.test(formData.mobile);
    
    setIsFormValid(isValid);
  }, [formData, selectedBrand, selectedModel]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandRef.current && !brandRef.current.contains(event.target)) {
        setShowBrandDropdown(false);
      }
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        setShowModelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const brands = [
      { name: 'Toyota', icon: '🚗' },
      { name: 'Honda', icon: '🚙' },
      { name: 'Hyundai', icon: '🚕' },
      { name: 'Maruti Suzuki', icon: '🚗' },
      { name: 'Tata', icon: '🚙' },
      { name: 'Mahindra', icon: '🛻' },
      { name: 'Ford', icon: '🚙' },
      { name: 'BMW', icon: '🏎️' },
      { name: 'Mercedes-Benz', icon: '🏎️' },
      { name: 'Audi', icon: '🏎️' }
  ];

  // Expanded models list to prevent fallback issues
  const models = {
      'Toyota': ['Camry', 'Corolla', 'Fortuner', 'Innova', 'Glanza'],
      'Honda': ['City', 'Civic', 'Amaze', 'Elevate'],
      'Hyundai': ['Creta', 'Venue', 'Verna', 'Tucson'],
      'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Grand Vitara'],
      'Tata': ['Nexon', 'Harrier', 'Safari', 'Punch'],
      'Mahindra': ['XUV700', 'Thar', 'Scorpio-N', 'Bolero'],
      'Ford': ['EcoSport', 'Endeavour', 'Figo'],
      'BMW': ['3 Series', '5 Series', 'X1', 'X5'],
      'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'S-Class'],
      'Audi': ['A4', 'A6', 'Q3', 'Q5'],
      'default': ['Model X', 'Model Y'] 
  };

  const getModels = () => {
      if (!selectedBrand) return [];
      return models[selectedBrand] || models['default'];
  };

  return (
    <div className="register-page">
      <div className="register-header">
        <div className="header-top">
            <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
            </button>
            <h2>Register Vehicle</h2>
        </div>
        <p className="header-subtitle">Add your vehicle details for quick parking</p>
      </div>

      <div className="register-form">
        
        <div className="form-group">
            <label>First Name</label>
            <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name" 
                    className="form-input" 
                />
            </div>
        </div>

        <div className="form-group">
            <label>Last Name</label>
            <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name" 
                    className="form-input" 
                />
            </div>
        </div>

        <div className="form-group">
            <label>Car Number Plate</label>
            <div className="input-wrapper">
                <Hash size={20} className="input-icon" />
                <input 
                    type="text" 
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={(e) => {
                        handleInputChange({
                            target: { name: 'plateNumber', value: e.target.value.toUpperCase() }
                        });
                    }}
                    placeholder="MH 12 AB 1234" 
                    className="form-input" 
                />
            </div>
        </div>

        <div className="form-group" ref={brandRef}>
            <label>Car Brand</label>
            <div className="input-wrapper">
                <div 
                    className={`custom-select ${!selectedBrand ? 'placeholder' : ''} ${showBrandDropdown ? 'active' : ''}`}
                    onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                >
                    {selectedBrand || "Select brand"}
                </div>
                <Car size={20} className="input-icon" />
                
                {showBrandDropdown && (
                    <div className="dropdown-menu">
                        <div className="dropdown-header">✓ Select brand</div>
                        {brands.map((brand) => (
                            <div 
                                key={brand.name} 
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedBrand(brand.name);
                                    setShowBrandDropdown(false);
                                    setSelectedModel('');
                                }}
                            >
                                <span>{brand.icon}</span>
                                {brand.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="form-group" ref={modelRef}>
            <label>Car Model</label>
            <div className="input-wrapper">
                <div 
                    className={`custom-select ${!selectedModel ? 'placeholder' : ''} ${showModelDropdown ? 'active' : ''}`}
                    onClick={() => {
                        if (selectedBrand) {
                             setShowModelDropdown(!showModelDropdown);
                        } else {
                             alert("Please select a car brand first");
                        }
                    }}
                >
                    {selectedModel || "Select model"}
                </div>
                <Car size={20} className="input-icon" />

                {showModelDropdown && (
                    <div className="dropdown-menu">
                        <div className="dropdown-header">✓ Select model</div>
                        {getModels().map((model) => (
                            <div 
                                key={model} 
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedModel(model);
                                    setShowModelDropdown(false);
                                }}
                            >
                                {model}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="form-group">
            <label>Mobile Number</label>
            <div className="input-wrapper">
                <Phone size={20} className="input-icon" />
                <input 
                    type="tel" 
                    name="mobile"
                    value={formData.mobile}
                    onChange={(e) => {
                         const re = /^[0-9\b]+$/;
                         if (e.target.value === '' || re.test(e.target.value)) {
                            handleInputChange(e);
                         }
                    }}
                    placeholder="+91 XXXXX XXXXX" 
                    className="form-input" 
                    maxLength={10}
                />
            </div>
        </div>

        <div className="auto-fill-info">
            <div className="info-icon-box">
                <Zap size={18} />
            </div>
            <div className="info-text">
                <h4>Auto-fill next time</h4>
                <p>Your vehicle will be automatically detected when you scan a QR code</p>
            </div>
        </div>

        <button 
            className={`save-btn ${isFormValid ? 'active' : ''}`}
            disabled={!isFormValid}
            onClick={() => {
                const profile = {
                    ...formData,
                    brand: selectedBrand,
                    model: selectedModel
                };
                localStorage.setItem('userProfile', JSON.stringify(profile));
                navigate('/booking');
            }} 
        >
            Save Vehicle Profile
        </button>

      </div>
    </div>
  );
};

export default RegisterVehicle;
