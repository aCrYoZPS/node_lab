import React, { useState, useEffect } from 'react';
import { type Vacancy } from '../types';

interface VacancyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    vacancy: Vacancy | null;
    onSubmit: (data: Partial<Vacancy>) => void;
}

const VacancyFormModal: React.FC<VacancyFormModalProps> = ({ isOpen, onClose, vacancy, onSubmit }) => {
    const [title, setTitle] = useState(vacancy?.title || '');
    const [comment, setComment] = useState(vacancy?.comment || '');
    const [salary, setSalary] = useState(vacancy?.salary || 0);

    useEffect(() => {
        setTitle(vacancy?.title || '');
        setComment(vacancy?.comment || '');
        setSalary(vacancy?.salary || 0);
    }, [vacancy, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData: Partial<Vacancy> = {
            title,
            comment,
            salary,
        };

        onSubmit(formData);
        onClose();
    };

    const modalTitle = vacancy ? `Редактировать вакансию: ${vacancy.id}` : 'Создать новую вакансию';

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3>{modalTitle}</h3>
                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>Должность:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Описание вакансии:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        style={{ ...inputStyle, height: '80px' }}
                    />

                    <label style={labelStyle}>Зарплата:</label>
                    <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        required
                        style={inputStyle}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                        <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#ccc', marginRight: '10px' }}>Отмена</button>
                        <button type="submit" style={buttonStyle}>{vacancy ? 'Сохранить' : 'Создать'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContentStyle: React.CSSProperties = {
    background: '#fff', padding: '30px', borderRadius: '8px',
    maxWidth: '600px', width: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '5px', marginTop: '10px', fontWeight: 'bold'
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px', border: '1px solid #ddd',
    borderRadius: '4px', boxSizing: 'border-box'
};

const buttonStyle: React.CSSProperties = {
    padding: '10px 15px', borderRadius: '4px', border: 'none',
    backgroundColor: '#007bff', color: 'white', cursor: 'pointer'
};

export default VacancyFormModal;
