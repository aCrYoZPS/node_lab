import React from 'react';
import type { Vacancy } from '../types';

interface VacancyCardProps {
    vacancy: Vacancy;
}

// Требование: Стрелочная функция, деструктуризация props
const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy }) => {
    return (
        <div className="card fade-in" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: 'white' }}>
            <h3>{vacancy.title}</h3>
            <p>Описание должности: {vacancy.comment}</p>
            <p>Зарплата: {vacancy.salary} руб.</p>
        </div>
    );
};

export default VacancyCard;
