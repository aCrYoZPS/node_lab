import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ServiceTypeManagement from '../components/admin/ServiceTypeManagement'
import ArticlesManagement from '../components/admin/ArticlesManagement';
import VacanciesManagement from '../components/admin/VacanciesManagement';
import ServicesManagement from '../components/admin/ServicesManagement';

type AdminSection = 'articles' | 'services' | 'serviceTypes' | 'vacancies';

const AdminPage: React.FC = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState<AdminSection>('articles');

    if (!user?.isAdmin) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Административная панель недоступна не администраторам</h2>
                <Link to="/">Вернуться на Главную</Link>
            </div>
        );
    }

    const renderManagementComponent = () => {
        switch (activeSection) {
            case 'articles':
                return <ArticlesManagement />;
            case 'services':
                return <ServicesManagement />;
            case 'serviceTypes':
                return <ServiceTypeManagement />;
            case 'vacancies':
                return <VacanciesManagement />;
            default:
                return <div>Выберите раздел для управления.</div>;
        }
    };

    const navButtonStyle: React.CSSProperties = {
        padding: '10px 15px',
        marginRight: '10px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
    };

    const activeButtonStyle: React.CSSProperties = {
        ...navButtonStyle,
        backgroundColor: '#007bff',
        color: 'white',
        borderColor: '#007bff'
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Административная панель</h2>

            {/* Navigation Tabs */}
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                <button
                    onClick={() => setActiveSection('articles')}
                    style={activeSection === 'articles' ? activeButtonStyle : navButtonStyle}
                >
                    Статьи (Articles)
                </button>
                <button
                    onClick={() => setActiveSection('services')}
                    style={activeSection === 'services' ? activeButtonStyle : navButtonStyle}
                >
                    Услуги (Services)
                </button>
                <button
                    onClick={() => setActiveSection('serviceTypes')}
                    style={activeSection === 'serviceTypes' ? activeButtonStyle : navButtonStyle}
                >
                    Типы услуг (Service Types)
                </button>
                <button
                    onClick={() => setActiveSection('vacancies')}
                    style={activeSection === 'vacancies' ? activeButtonStyle : navButtonStyle}
                >
                    Вакансии (Vacancies)
                </button>
            </div>

            <div style={{ border: '1px solid #eee', padding: '20px', borderRadius: '4px' }}>
                {renderManagementComponent()}
            </div>
        </div>
    );
};

export default AdminPage;
