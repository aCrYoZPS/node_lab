import React, { useState } from 'react';
import { useApiData } from '../../hooks/UseApi';
import { type Article } from '../../types';
import { API_BASE_URL } from '../../globals';
import { useAuth } from '../../context/AuthContext';
import GenericFormModal from './GenericFormModal.tsx';
import * as styles from "./styles.tsx"

const ArticlesManagement: React.FC = () => {
    const { user } = useAuth();
    if (user === null) {
        throw new Error("FUCK");
    }

    const { data: articles, loading, error, refresh } = useApiData<Article[]>(`${API_BASE_URL}/articles`);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Article | null>(null);

    const handleCreate = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (article: Article) => {
        setSelectedItem(article);
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

    if (loading) return <div>Загрузка статей...</div>;
    if (error) return <div style={{ color: 'red' }}>Ошибка загрузки: {error}</div>;

    return (
        <div style={{ padding: '20px', paddingTop: '0px' }}>
            <h3>Управление статьями</h3>
            <button
                onClick={handleCreate}
                style={{ ...styles.buttonStyle, backgroundColor: '#28a745', marginBottom: '20px' }}
            >
                ➕ Создать новую статью
            </button>

            <table style={styles.tableStyle}>
                <thead>
                    <tr>
                        <th style={styles.thStyle}>ID</th>
                        <th style={styles.thStyle}>Заголовок</th>
                        <th style={styles.thStyle}>Резюме</th>
                        <th style={styles.thStyle}>Автор</th>
                        <th style={styles.thStyle}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {(articles || []).map((article) => {
                        const authorName = article.author.name.length < 18 ? article.author.name : `${article.author.name.substring(0, 15)}...`;
                        return (
                            <tr key={article.id}>
                                <td style={styles.tdStyle}>{article.id}</td>
                                <td style={styles.tdStyle}>{article.title}</td>
                                <td style={styles.tdStyle}>{article.abstract}</td>
                                <td style={styles.tdStyle}>{authorName}</td>
                                <td style={styles.tdStyle}>
                                    <button
                                        onClick={() => handleEdit(article)}
                                        style={{ ...styles.actionButtonStyle, backgroundColor: '#ffc107' }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        style={{ ...styles.actionButtonStyle, backgroundColor: '#dc3545', marginLeft: '10px' }}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <GenericFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedItem}
                fields={[
                    { name: 'title', label: 'Заголовок', type: 'text', required: true },
                    { name: 'abstract', label: 'Краткое содержание', type: 'text', required: true },
                    { name: 'content', label: 'Содержание', type: 'textarea', required: true },
                ]}
                endpoint="articles"
                onSuccess={refresh}
            />
        </div>
    );
};


export default ArticlesManagement;
