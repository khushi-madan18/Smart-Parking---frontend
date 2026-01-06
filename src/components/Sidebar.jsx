import { Home, Ticket, History, Settings, Car } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
         <div className="logo-icon">
            <Car size={24} color="white" />
         </div>
         {/* Logo text removed for cleaner look */}
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/home" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
           <Home size={20} />
           <span>Home</span>
        </NavLink>
        <NavLink to="/ticket" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
           <Ticket size={20} />
           <span>Ticket</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
           <History size={20} />
           <span>History</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
           <Settings size={20} />
           <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
         <div className="user-profile">
            <div className="profile-img">U</div>
            <div className="profile-info">
               <span className="profile-name">John Doe</span>
               <span className="profile-role">Premium User</span>
            </div>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
