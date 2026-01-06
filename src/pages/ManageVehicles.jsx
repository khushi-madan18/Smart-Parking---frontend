import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Trash2, Plus, Edit2 } from 'lucide-react';
import './Settings.css'; // Reusing Settings styling for consistency

const ManageVehicles = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [currentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser') || '{}'));

    useEffect(() => {
        // Load stored vehicles for this user, or defaulting to an empty list
        // Note: For a real app, this should be an API call.
        // We simulate a shared 'userVehicles' storage
        const stored = JSON.parse(localStorage.getItem('userVehicles') || '[]');
        let myVehicles = stored.filter(v => v.userId === currentUser.id);
        
        // Seed default vehicles if none exist for anyone (fresh state)
        if (stored.length === 0) {
             const defaults = [
                { id: 101, userId: currentUser.id, model: 'Honda City', plate: 'MH 14 CD 5678' },
                { id: 102, userId: currentUser.id, model: 'Toyota Innova', plate: 'MH 12 AB 1234' }
             ];
             localStorage.setItem('userVehicles', JSON.stringify(defaults));
             myVehicles = defaults;
        }
        
        setVehicles(myVehicles);
    }, [currentUser]);

    const handleRemove = (vehicleId) => {
        if (window.confirm('Are you sure you want to remove this vehicle?')) {
            const allVehicles = JSON.parse(localStorage.getItem('userVehicles') || '[]');
            const updated = allVehicles.filter(v => v.id !== vehicleId);
            localStorage.setItem('userVehicles', JSON.stringify(updated));
            setVehicles(vehicles.filter(v => v.id !== vehicleId));
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px'}}>
                    <button className="back-btn" onClick={() => navigate('/settings')}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Manage Vehicles</h2>
                </div>
                <p style={{paddingLeft: '40px'}}>{vehicles.length} vehicles registered</p>
            </div>

            <div className="settings-content" style={{gap: '16px'}}>
                {vehicles.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>
                        <Car size={48} style={{margin: '0 auto 16px', opacity: 0.5}} />
                        <p>No vehicles added yet.</p>
                    </div>
                ) : (
                    vehicles.map(v => (
                        <div key={v.id} className="menu-item" style={{display: 'block', padding: '16px'}}>
                            <div style={{display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px'}}>
                                <div className="menu-icon" style={{background: '#eff6ff', color: '#3b82f6'}}>
                                    <Car size={24} />
                                </div>
                                <div>
                                    <h4 style={{fontSize: '16px', marginBottom: '4px'}}>{v.model}</h4>
                                    <p style={{fontSize: '14px', color: '#64748b', fontWeight: '500'}}>{v.plate}</p>
                                    <p style={{fontSize: '12px', color: '#94a3b8'}}>
                                        {v.firstName ? `${v.firstName} ${v.lastName}` : (v.ownerName || currentUser.name)}
                                    </p>
                                </div>
                            </div>
                            
                            <div style={{display: 'flex', gap: '12px'}}>
                                <button className="settings-btn btn-light" style={{flex: 1, fontSize: '13px', padding: '10px'}}>
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button 
                                    className="settings-btn btn-danger" 
                                    style={{flex: 1, fontSize: '13px', padding: '10px', background: '#fef2f2', color: '#ef4444', border: 'none'}}
                                    onClick={() => handleRemove(v.id)}
                                >
                                    <Trash2 size={14} /> Remove
                                </button>
                            </div>
                        </div>
                    ))
                )}

                <button 
                    className="primary-btn" 
                    style={{marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px'}}
                    onClick={() => navigate('/register-vehicle', { state: { source: 'settings' } })}
                >
                    <Plus size={20} />
                    Add New Vehicle
                </button>
            </div>
        </div>
    );
};

export default ManageVehicles;
