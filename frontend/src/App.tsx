import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import NavBar from './components/NavBar';
import ServicesPage from './pages/ServicesPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ServiceDetailsPage from './pages/ServiceDetailsPage.tsx'
import LogoutHandler from './pages/LogoutPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import BlogPage from './pages/BlogPage.tsx';
import ArticlePage from './pages/ArticlePage.tsx';
import VacanciesPage from './pages/VacanciesPage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import ArticleManagementPage from './pages/ArticleManagementPage.tsx';
import { CartProvider } from './context/CartContext.tsx';
import CartPage from './pages/CartPage.tsx';

function App() {
    return (
        <CartProvider>
            <AuthProvider>
                <Router>
                    <div className="app-container">
                        <NavBar />
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/services" element={<ServicesPage />} />
                            <Route path="/services/:id" element={<ServiceDetailsPage />} />
                            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/vacancies" element={<VacanciesPage />} />
                            <Route path="/logout" element={<LogoutHandler />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/blog" element={<BlogPage />} />
                            <Route path="/blog/:id" element={<ArticlePage />} />
                            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                            <Route path="/article_management" element={<ProtectedRoute><ArticleManagementPage /></ProtectedRoute>} />
                            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </CartProvider>
    );
}

export default App;
