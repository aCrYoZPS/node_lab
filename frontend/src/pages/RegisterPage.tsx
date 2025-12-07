import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TimezoneSelector from '../components/TimezoneSelector'

const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [timezone, setTimezone] = useState(defaultTimezone);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const validateForm = () => {
        if (!email.includes('@')) {
            setError('Некорректный Email');
            return false;
        }

        if (password.length < 6) {
            setError('Пароль должен быть длиннее 6 символов');
            return false;
        }

        if (password.length > 32) {
            setError('Пароль должен быть короче 32 символов');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            console.log(`sent timezone: ${timezone}`);
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    timezone: timezone,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Неизвестная ошибка сервера.' }));
                setError(errorData.message || 'Ошибка входа. Проверьте логин/пароль.');
                return;
            }

            const data = await response.json();

            const loggedInUser = {
                ...data.user,
                token: data.token
            };

            login(loggedInUser);
            navigate(from, { replace: true });

        } catch (error) {
            console.error('Ошибка при выполнении POST-запроса:', error);
            setError('Не удалось подключиться к серверу.');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/auth/google';
    };

    return (
        <div className="flex-center" style={{ height: '80vh', flexDirection: 'column' }}>
            <form onSubmit={handleSubmit} style={{ padding: '40px', background: 'white', boxShadow: 'var(--card-shadow)', width: '300px' }}>
                <h2>Вход в систему</h2>
                {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

                <div style={{ marginBottom: '15px' }}>
                    <label>Имя пользователя:</label><br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Пароль:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <TimezoneSelector onTimezoneChange={setTimezone} />
                </div>

                <p style={{ marginTop: '-5px', marginBottom: '15px', fontSize: '0.9em' }}>
                    Уже зарегистрированы в CleanPro?<br />
                    <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                        <b>Войдите в аккаунт.</b>
                    </Link>
                </p>

                <button
                    type="submit"
                    className="btn"
                    style={{ width: '100%', padding: '10px' }}
                >
                    Зарегистрироваться
                </button>

                <hr style={{ margin: '15px 0' }} />

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="btn"
                    style={{ background: '#db4437', width: '100%', padding: '10px' }}
                >
                    Зарегистрироваться через Google
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
