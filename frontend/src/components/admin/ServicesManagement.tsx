import React, { useState } from 'react';
import { useApiData } from '../../hooks/UseApi';
import { API_BASE_URL } from '../../globals';
import { type Service, type ServiceType } from '../../types';
import GenericFormModal from './GenericFormModal';
import { useAuth } from '../../context/AuthContext';
import * as styles from './styles.tsx'

const ServicesManagement: React.FC = () => {
    const { user } = useAuth();
    if (user === null) {
        throw new Error("FUUUUUUUUUUUUUUCK");
    }

    const { data: services, loading, error, refresh } = useApiData<Service[]>(`${API_BASE_URL}/services`);
    const { data: serviceTypes } = useApiData<ServiceType[]>(`${API_BASE_URL}/service_types`);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Service | null>(null);


    const handleCreate = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (service: Service) => {
        setSelectedItem(service);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(`Вы уверены, что хотите удалить услугу ${id}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось удалить услугу');
            }

            refresh();
            alert('Услуга успешно удалёна!');
        } catch (err) {
            console.error(err);
            alert(`Ошибка удаления: ${err}`);
        }
    };

    if (loading) return <div>Загрузка услуг...</div>;
    if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

    const serviceTypeOptions = (serviceTypes || []).map(type => ({
        value: type.id, // Value should be the ID
        label: type.name,
    }));

    return (
        <div style={{ padding: '20px', paddingTop: '0px' }}>
            <h3>Управление услугами</h3>
            <button
                onClick={handleCreate}
                style={{ ...styles.buttonStyle, backgroundColor: '#28a745', marginBottom: '20px' }}
            >➕ Создать новую услугу</button>

            <table style={styles.tableStyle}>
                <thead>
                    <tr>
                        <th style={styles.thStyle}>ID</th>
                        <th style={styles.thStyle}>Название</th>
                        <th style={styles.thStyle}>Описание</th>
                        <th style={styles.thStyle}>Цена</th>
                        <th style={styles.thStyle}>Тип</th>
                        <th style={styles.thStyle}>Изображение</th>
                        <th style={styles.thStyle}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {(services || []).map((service) => {
                        return (
                            <tr key={service.id}>
                                <td style={styles.tdStyle}>{service.id}</td>
                                <td style={styles.tdStyle}>{service.name}</td>
                                <td style={styles.tdStyle}>{service.description}</td>
                                <td style={styles.tdStyle}>{service.price}</td>
                                <td style={styles.tdStyle}>{service.serviceType.name}</td>
                                <td style={styles.tdStyle}>{service.image}</td>
                                <td style={styles.tdStyle}>
                                    <button
                                        onClick={() => handleEdit(service)}
                                        style={{ ...styles.actionButtonStyle, backgroundColor: '#ffc107' }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
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
                    { name: 'name', label: 'Название услуги', type: 'text', required: true },
                    { name: 'description', label: 'Описание услуги', type: 'text', required: true },
                    { name: 'price', label: 'Цена услуги', type: 'number', required: true },
                    { name: 'serviceType', label: 'Тип услуги', type: 'select', required: true, options: serviceTypeOptions },
                    { name: 'image', label: 'Картинка услуги', type: 'text', required: false },
                ]}
                endpoint="services"
                onSuccess={refresh}
            />
        </div>
    );
};

export default ServicesManagement;
