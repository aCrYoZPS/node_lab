import React, { useState } from 'react';
import { useApiData } from '../../hooks/UseApi';
import { type Vacancy } from '../../types';
import { API_BASE_URL } from '../../globals';
import { useAuth } from '../../context/AuthContext';
import GenericFormModal from './GenericFormModal.tsx';
import * as styles from "./styles.tsx"

const VacanciesManagement: React.FC = () => {
    const { user } = useAuth();
    if (user === null) {
        throw new Error("FUCK");
    }

    const { data: vacancies, loading, error, refresh } = useApiData<Vacancy[]>(`${API_BASE_URL}/vacancies`);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Vacancy | null>(null);

    const handleCreate = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (vacancy: Vacancy) => {
        setSelectedItem(vacancy);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(`Вы уверены, что хотите удалить вакансию ${id}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/vacancies/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось удалить вакансию');
            }
            refresh();
            alert('Вакансия успешно удалена!');
        } catch (err) {
            console.error(err);
            alert(`Ошибка удаления: ${err}`);
        }
    };

    if (loading) return <div>Загрузка вакансий...</div>;
    if (error) return <div style={{ color: 'red' }}>Ошибка загрузки: {error}</div>;

    return (
        <div style={{ padding: '20px', paddingTop: '0px' }}>
            <h3>Управление вакансиями</h3>
            <button
                onClick={handleCreate}
                style={{ ...styles.buttonStyle, backgroundColor: '#28a745', marginBottom: '20px' }}
            >
                ➕ Создать новую вакансию
            </button>

            <table style={styles.tableStyle}>
                <thead>
                    <tr>
                        <th style={styles.thStyle}>ID</th>
                        <th style={styles.thStyle}>Должность</th>
                        <th style={styles.thStyle}>Описание</th>
                        <th style={styles.thStyle}>Зарплата</th>
                        <th style={styles.thStyle}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {(vacancies || []).map((vacancy) => {
                        return (
                            <tr key={vacancy.id}>
                                <td style={styles.tdStyle}>{vacancy.id}</td>
                                <td style={styles.tdStyle}>{vacancy.title}</td>
                                <td style={styles.tdStyle}>{vacancy.comment}</td>
                                <td style={styles.tdStyle}>{vacancy.salary}</td>
                                <td style={styles.tdStyle}>
                                    <button
                                        onClick={() => handleEdit(vacancy)}
                                        style={{ ...styles.actionButtonStyle, backgroundColor: '#ffc107' }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vacancy.id)}
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
                    { name: 'title', label: 'Должность', type: 'text', required: true },
                    { name: 'comment', label: 'Описание', type: 'text', required: true },
                    { name: 'salary', label: 'Зарплата', type: 'number', required: true },
                ]}
                endpoint="articles"
                onSuccess={refresh}
            />
        </div>
    );
};


export default VacanciesManagement;
