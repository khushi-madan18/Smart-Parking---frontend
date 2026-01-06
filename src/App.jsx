import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import RoleSelection from './pages/RoleSelection';

// Pages
import Home from './pages/Home';
import RoleSelector from './pages/RoleSelector'; // Keep existing if needed, or remove later
import Scan from './pages/Scan';
import BookingConfirmation from './pages/BookingConfirmation';
import ParkingTicket from './pages/ParkingTicket';
import RegisterVehicle from './pages/RegisterVehicle';
import VehicleRetrieval from './pages/VehicleRetrieval';
import ParkingHistory from './pages/ParkingHistory';
import Settings from './pages/Settings';
import ManageVehicles from './pages/ManageVehicles';

import HelpSupport from './pages/HelpSupport';
import FAQ from './pages/FAQ';
import ManagerDashboard from './pages/ManagerDashboard';
import AddDriver from './pages/AddDriver';
import SuperAdmin from './pages/SuperAdmin';
import DriverDashboard from './pages/DriverDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Components
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppLayout = () => {
    const location = useLocation();
    
    // Bottom Nav visible mainly for the User Flow
    const bottomNavRoutes = ['/home', '/ticket', '/history', '/settings'];
    const showBottomNav = bottomNavRoutes.includes(location.pathname);

    // Hide sidebar on:
    // 1. All bottom nav routes (User flow)
    // 2. Full screen flows (Scan, Booking, Retrieval, Register, Roles, Dashboard)
    // 3. Manager/Driver special dashboards
    // 4. Auth pages
    const hideSidebarRoutes = [
        ...bottomNavRoutes,
        '/', '/login', '/signup', 
        '/scan', '/booking', '/register-vehicle', '/retrieval', '/roles', '/dashboard',
        '/manager', '/add-driver', '/super-admin', '/driver',
        '/manage-vehicles', '/add-vehicle',
        '/help-support', '/faq'
    ];
    
    const showSidebar = !hideSidebarRoutes.includes(location.pathname);

    return (
      <div className="app-layout">
        {showSidebar && <Sidebar />}
        
        {/* main-wrapper full-width if sidebar is hidden */}
        <main className={`main-wrapper ${!showSidebar ? 'full-width' : ''}`}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Interstitial Role Selection */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <RoleSelection />
                </ProtectedRoute>
            } />

            {/* Protected User Routes */}
            <Route path="/home" element={<ProtectedRoute allowedRoles={['user']}><Home /></ProtectedRoute>} />
            <Route path="/scan" element={<ProtectedRoute allowedRoles={['user']}><Scan /></ProtectedRoute>} />
            <Route path="/booking" element={<ProtectedRoute allowedRoles={['user']}><BookingConfirmation /></ProtectedRoute>} />
            <Route path="/ticket" element={<ProtectedRoute allowedRoles={['user']}><ParkingTicket /></ProtectedRoute>} />
            <Route path="/register-vehicle" element={<ProtectedRoute allowedRoles={['user']}><RegisterVehicle /></ProtectedRoute>} />
            <Route path="/retrieval" element={<ProtectedRoute allowedRoles={['user']}><VehicleRetrieval /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute allowedRoles={['user']}><ParkingHistory /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['user']}><Settings /></ProtectedRoute>} />
            <Route path="/manage-vehicles" element={<ProtectedRoute allowedRoles={['user']}><ManageVehicles /></ProtectedRoute>} />

            <Route path="/help-support" element={<ProtectedRoute allowedRoles={['user']}><HelpSupport /></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute allowedRoles={['user']}><FAQ /></ProtectedRoute>} />
            
            {/* Protected Admin/Driver Routes */}
            <Route path="/manager" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
            <Route path="/add-driver" element={<ProtectedRoute allowedRoles={['manager']}><AddDriver /></ProtectedRoute>} />
            <Route path="/super-admin" element={<ProtectedRoute allowedRoles={['admin']}><SuperAdmin /></ProtectedRoute>} />
            <Route path="/driver" element={<ProtectedRoute allowedRoles={['driver']}><DriverDashboard /></ProtectedRoute>} />
            
            <Route path="/roles" element={<RoleSelector />} />

          </Routes>
        </main>
        
        {showBottomNav && <BottomNav />}
      </div>
    );
};


function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppLayout />
    </Router>
  );
}

export default App;
