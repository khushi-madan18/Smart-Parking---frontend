import { useNavigate } from 'react-router-dom';
import { User, Car, Shield, UserCog } from 'lucide-react';
import './RoleSelector.css';

const RoleSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="role-container">
      <h2 className="role-title">Select Role</h2>
      <div className="roles-grid">
         <button className="role-card" onClick={() => navigate('/home')}>
            <div className="icon-box user"><User size={32} /></div>
            <span className="role-label">User</span>
         </button>
         <button className="role-card" onClick={() => navigate('/driver')}>
            <div className="icon-box driver"><Car size={32} /></div>
            <span className="role-label">Driver</span>
         </button>
         <button className="role-card" onClick={() => navigate('/manager')}>
            <div className="icon-box manager"><UserCog size={32} /></div>
            <span className="role-label">Manager</span>
         </button>
         <button className="role-card" onClick={() => navigate('/super-admin')}>
            <div className="icon-box admin"><Shield size={32} /></div>
            <span className="role-label">Admin</span>
         </button>
      </div>
    </div>
  );
};

export default RoleSelector;
