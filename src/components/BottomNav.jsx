import { Home, Ticket, Clock, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={24} strokeWidth={2} />
                <span>Home</span>
            </NavLink>
            
            <NavLink to="/ticket" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Ticket size={24} strokeWidth={2} />
                <span>Ticket</span>
            </NavLink>
            
            <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Clock size={24} strokeWidth={2} />
                <span>History</span>
            </NavLink>
            
            <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Settings size={24} strokeWidth={2} />
                <span>Settings</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
