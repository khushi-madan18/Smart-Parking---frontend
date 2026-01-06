import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // Redirect to their appropriate dashboard if they try to access unauthorized route
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
