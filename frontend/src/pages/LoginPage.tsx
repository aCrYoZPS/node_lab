import React, { useState } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Требование: Валидация форм (клиентская)
    const validateForm = () => {
        if (!email.includes('@')) {
            setError('Некорректный Email');
            return false;
        }
        if (password.length < 6) {
            setError('Пароль должен быть длиннее 6 символов');
            return false;
        }
        return true;
    };

    // Handler 4: Отправка формы (onSubmit)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (validateForm()) {
            alert('Успешный вход! (API запрос)');
            // Здесь была бы логика авторизации
        }
    };

    // Handler 5: Google Auth (имитация)
    const handleGoogleLogin = () => {
        console.log("Redirecting to Google OAuth...");
    };

    return (
        <div className="flex-center" style={{ height: '80vh', flexDirection: 'column' }}>
            <form onSubmit={handleSubmit} style={{ padding: '40px', background: 'white', boxShadow: 'var(--card-shadow)' }}>
                <h2>Вход в систему</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Пароль:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button type="submit" className="btn" style={{ width: '100%' }}>Войти</button>
                <hr />
                <button type="button" onClick={handleGoogleLogin} className="btn" style={{ background: '#db4437', width: '100%' }}>
                    Войти через Google
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
