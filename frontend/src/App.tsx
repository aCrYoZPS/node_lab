import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import ServicesPage from './pages/ServicesPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ServiceDetails from './pages/ServiceDetailsPage.tsx'
import { services } from './mockData';
import './index.css';

const NavBar = () => (
    <nav style={{ background: '#333', padding: '1rem', color: 'white', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Главная</Link>
        <Link to="/services" style={{ color: 'white', textDecoration: 'none' }}>Услуги</Link>
        <Link to="/vacancies" style={{ color: 'white', textDecoration: 'none' }}>Вакансии</Link>
        <Link to="/chat" style={{ color: 'white', textDecoration: 'none' }}>Чат</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: 'auto' }}>Вход</Link>
    </nav>
);

// Заглушка для вакансий
const VacanciesPage = () => (
    <div style={{ padding: '20px' }}>
        <h2>Наши вакансии</h2>
        <ul>
            <li>Клинер - 50 000 руб.</li>
            <li>Водитель - 60 000 руб.</li>
        </ul>
    </div>
);

function App() {
    return (
        <Router>
            <div className="app-container">
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/:id" element={<ServiceDetails />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/vacancies" element={<VacanciesPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
