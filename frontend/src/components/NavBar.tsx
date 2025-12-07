import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React, { useEffect } from 'react';

const actionStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid white',
    cursor: 'pointer',
    textAlign: 'center' as const,
    display: 'inline-flex',
    alignItems: 'center',
    height: '100%',
    whiteSpace: 'nowrap'
};

const NavBar: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user && user.isAdmin;

    const location = useLocation();

    useEffect(() => {
        if (user && location.pathname !== '/login' && location.pathname !== '/logout') {
            sessionStorage.setItem('lastPath', location.pathname);
        }
    }, [location.pathname, user]);

    return (
        <nav style={{ background: '#333', padding: '1rem', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Главная</Link>
            <Link to="/services" style={{ color: 'white', textDecoration: 'none' }}>Услуги</Link>
            <Link to="/vacancies" style={{ color: 'white', textDecoration: 'none' }}>Вакансии</Link>
            <Link to="/blog" style={{ color: 'white', textDecoration: 'none' }}>Блог</Link>
            <Link to="/chat" style={{ color: 'white', textDecoration: 'none' }}>Чат</Link>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <span style={{ fontWeight: 'bold' }}>
                            Привет, {user.name || user.email.split('@')[0]} 👋
                        </span>

                        {isAdmin && (
                            <Link
                                to="/admin"
                                style={{
                                    ...actionStyle,
                                    color: '#00bcd4',
                                    borderColor: '#00bcd4',
                                    background: 'rgba(0, 188, 212, 0.1)'
                                }}
                            >
                                Админ-панель
                            </Link>
                        )}

                        <Link
                            to="/cart"
                            style={{
                                background: 'transparent',
                                border: '1px solid white',
                                ...actionStyle,
                            }}
                        >
                            Корзина
                        </Link>
                        <Link
                            to="/logout"
                            style={{
                                background: 'transparent',
                                border: '1px solid white',
                                ...actionStyle,
                            }}
                        >
                            Выход
                        </Link>
                    </>
                ) : (
                    <Link
                        to="/login"
                        style={{
                            background: 'transparent',
                            border: '1px solid white',
                            ...actionStyle,
                        }}
                    >
                        Вход
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
