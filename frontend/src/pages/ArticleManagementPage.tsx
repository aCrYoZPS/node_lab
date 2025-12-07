import React, { useState } from 'react';
import ArticleFormModal from '../components/ArticleFormModal';
import { useApiData } from '../hooks/UseApi';
import { type Article } from '../types';
import { API_BASE_URL } from '../globals';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ArticleManagementPage: React.FC = () => {
    const { user } = useAuth();
    if (user === null) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Менеджмент статей недоступен для null</h2>
                <Link to="/">Вернуться на Главную</Link>
            </div>
        );
    }

    const { data: articles, loading, error, refresh } = useApiData<Article[]>(`${API_BASE_URL}/articles/author/${user.id}`);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const handleCreate = () => {
        setSelectedArticle(null);
        setIsModalOpen(true);
    };

    const handleEdit = (article: Article) => {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(`Вы уверены, что хотите удалить статью ${id}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось удалить статью');
            }
            refresh();
            alert('Статья успешно удалена!');
        } catch (err) {
            console.error(err);
            alert(`Ошибка удаления: ${err}`);
        }
    };

    const handleFormSubmit = async (data: Partial<Article>) => {
        const url = selectedArticle
            ? `${API_BASE_URL}/articles/${selectedArticle.id}`
            : `${API_BASE_URL}/articles`;

        const method = selectedArticle ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка сохранения данных');
            }

            refresh();
            alert(`Статья успешно ${selectedArticle ? 'обновлена' : 'создана'}.`);

        } catch (err) {
            console.error(err);
            alert(`Ошибка: ${err}`);
        }
    };

    if (loading) return <div>Загрузка статей...</div>;
    if (error) return <div style={{ color: 'red' }}>Ошибка загрузки: {error}</div>;

    if (articles !== null && articles.length == 0) {
        return (
            <div style={{ padding: '20px' }}>
                <h2 style={{ paddingLeft: '0px' }}>Управление вашими статьями, {user.name}</h2>
                <button
                    onClick={handleCreate}
                    style={{ ...buttonStyle, backgroundColor: '#28a745', marginBottom: '20px' }}
                >
                    ➕ Создать новую статью
                </button>

                <ArticleFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    article={selectedArticle}
                    onSubmit={handleFormSubmit}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ paddingLeft: '0px' }}>Управление вашими статьями, {user.name}</h2>
            <button
                onClick={handleCreate}
                style={{ ...buttonStyle, backgroundColor: '#28a745', marginBottom: '20px' }}
            >
                ➕ Создать новую статью
            </button>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Заголовок</th>
                        <th style={thStyle}>Резюме</th>
                        <th style={thStyle}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {(articles || []).map((article) => {
                        return (
                            <tr key={article.id}>
                                <td style={tdStyle}>{article.id}</td>
                                <td style={tdStyle}>{article.title}</td>
                                <td style={tdStyle}>{article.abstract}</td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleEdit(article)}
                                        style={{ ...actionButtonStyle, backgroundColor: '#ffc107' }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        style={{ ...actionButtonStyle, backgroundColor: '#dc3545', marginLeft: '10px' }}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <ArticleFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                article={selectedArticle}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
};

// Simple styles for the table
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
const thStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' };
const tdStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '10px' };
const actionButtonStyle: React.CSSProperties = { padding: '5px 10px', borderRadius: '4px', border: 'none', color: 'white', cursor: 'pointer' };
const buttonStyle: React.CSSProperties = { padding: '10px 15px', borderRadius: '4px', border: 'none', color: 'white', cursor: 'pointer' };

export default ArticleManagementPage;
