import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminStatus?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminStatus }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <p>Loading user session...</p>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminStatus && adminStatus === "admin" && !user.isAdmin) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Доступ запрещен</h2>
                <p>У вас нет прав для просмотра этой страницы.</p>
                <Navigate to="/" replace />
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
