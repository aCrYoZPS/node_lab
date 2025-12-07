import React, { useState } from 'react';
import { useApiData } from '../../hooks/UseApi';
import { API_BASE_URL } from '../../globals';
import { type ServiceType } from '../../types';
import GenericFormModal from './GenericFormModal';
import { useAuth } from '../../context/AuthContext';
import * as styles from './styles.tsx'

const ServiceTypeManagement: React.FC = () => {
    const { user } = useAuth();
    if (user === null) {
        throw new Error("FUUUUUUUUUUUUUUCK");
    }

    const { data: serviceTypes, loading, error, refresh } = useApiData<ServiceType[]>(`${API_BASE_URL}/service_types`);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ServiceType | null>(null);


    const handleCreate = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (serviceType: ServiceType) => {
        setSelectedItem(serviceType);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(`Вы уверены, что хотите удалить тип услуги ${id}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/service_types/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось удалить тип услуги');
            }
            refresh();
            alert('Тип услуги успешно удалён!');
        } catch (err) {
            console.error(err);
            alert(`Ошибка удаления: ${err}`);
        }
    };

    if (loading) return <div>Загрузка типов услуг...</div>;
    if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

    return (
        <div style={{ padding: '20px', paddingTop: '0px' }}>
            <h3>Управление типами услуг</h3>
            <button
                onClick={handleCreate}
                style={{ ...styles.buttonStyle, backgroundColor: '#28a745', marginBottom: '20px' }}
            >➕ Создать тип услуги</button>

            <table style={styles.tableStyle}>
                <thead>
                    <tr>
                        <th style={styles.thStyle}>ID</th>
                        <th style={styles.thStyle}>Название</th>
                        <th style={styles.thStyle}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {(serviceTypes || []).map((serviceType) => {
                        return (
                            <tr key={serviceType.id}>
                                <td style={styles.tdStyle}>{serviceType.id}</td>
                                <td style={styles.tdStyle}>{serviceType.name}</td>
                                <td style={styles.tdStyle}>
                                    <button
                                        onClick={() => handleEdit(serviceType)}
                                        style={{ ...styles.actionButtonStyle, backgroundColor: '#ffc107' }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(serviceType.id)}
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
                    { name: 'name', label: 'Название типа', type: 'text', required: true },
                ]}
                endpoint="service_types"
                onSuccess={refresh}
            />
        </div>
    );
};

export default ServiceTypeManagement;
