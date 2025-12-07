import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutHandler: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();

        const previousPath = sessionStorage.getItem('lastPath');

        if (previousPath && previousPath !== '/logout') {
            navigate(previousPath, { replace: true });
        } else {
            navigate('/', { replace: true });
        }

        sessionStorage.removeItem('lastPath');

    }, [logout, navigate]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Выход из системы...</h2>
            <p>Вы будете перенаправлены.</p>
        </div>
    );
};

export default LogoutHandler;
