import { Home, Ticket, Clock, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';
import { Workflow } from '../utils/workflow';

const BottomNav = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const active = user ? Workflow.getUserActiveRequests(user.id) : [];
    const hasTicket = active && active.length > 0;

    const handleTicketClick = (e) => {
        if (!hasTicket) {
            e.preventDefault();
        }
    };

    return (
        <nav className="bottom-nav">
            <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={24} strokeWidth={2} />
                <span>Home</span>
            </NavLink>
            
            <NavLink 
                to="/ticket" 
                onClick={handleTicketClick} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                style={{
                    opacity: hasTicket ? 1 : 0.4,
                    pointerEvents: hasTicket ? 'auto' : 'none',
                    filter: hasTicket ? 'none' : 'grayscale(100%)'
                }}
            >
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
