import React from 'react';
import type { Service } from '../types';

interface ServiceCardProps {
    service: Service;
    onViewDetails: (id: string) => void;
}

// Требование: Стрелочная функция, деструктуризация props
const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetails }) => {
    const img = service.image || "/defaultServiceImage.jpg";
    return (
        <div className="card fade-in" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: 'white' }}>
            <img src={img} alt={service.name} className='service_card_img' />
            <h3>{service.name}</h3>
            <p>Тип: {service.serviceType.name}</p>
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
