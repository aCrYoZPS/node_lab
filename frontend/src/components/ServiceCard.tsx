import React from 'react';
import type { Service } from '../types';

interface ServiceCardProps {
    service: Service;
    onViewDetails: (id: number) => void; // Передача параметра в обработчик
}

// Требование: Стрелочная функция, деструктуризация props
const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetails }) => {
    return (
        <div className="card fade-in" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: 'white' }}>
            <img src={service.image} alt={service.title} style={{ width: '100%' }} />
            <h3>{service.title}</h3>
            <p>Цена: {service.price} руб.</p>

            {/* Требование: Обработчик события с передачей параметров */}
            <button
                className="btn"
                onClick={() => onViewDetails(service.id)}
            >
                Подробнее
            </button>
        </div>
    );
};

export default ServiceCard;
