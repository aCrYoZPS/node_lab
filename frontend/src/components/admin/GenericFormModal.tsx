import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../globals';
import { useAuth } from '../../context/AuthContext';

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

interface FieldDefinition {
    name: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'select';
    required?: boolean;
    options?: { value: string | number, label: string }[]; // For select fields
}

interface GenericModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    initialData: T | null;
    fields: FieldDefinition[];
    endpoint: string;
    onSuccess: () => void;
}

const GenericFormModal = <T extends { id?: string | number }>(props: GenericModalProps<T>) => {
    if (!props.isOpen) {
        return;
    }

    const { user } = useAuth();
    if (user === null) {
        return;
    }

    const [formData, setFormData] = useState<Partial<T>>({});


    useEffect(() => {
        let initialForm: Partial<T> = {};

        // Deep copy and normalize the data
        if (props.initialData) {
            initialForm = { ...props.initialData };

            props.fields.forEach(field => {
                const key = field.name as keyof T;
                const value = props.initialData![key];

                // If the field is an object (like serviceType) and is not null, extract only the ID
                if (field.type === 'select' && value && typeof value === 'object' && 'id' in value) {
                    initialForm[key] = value.id as any;
                }
            });
        }

        setFormData(initialForm);
    }, [props.initialData, props.isOpen, props.fields]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const finalPayload = { ...formData };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isEditing = !!props.initialData?.id;

        const method = isEditing ? 'PUT' : 'POST';

        const url = isEditing
            ? `${API_BASE_URL}/${props.endpoint}/${props.initialData!.id}`
            : `${API_BASE_URL}/${props.endpoint}`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },

                body: JSON.stringify(finalPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Ошибка ${method === 'POST' ? 'создания' : 'обновления'} данных.`);
            }

            alert(`Данные успешно ${method === 'POST' ? 'сохранены' : 'обновлены'}.`);

            props.onClose();
            props.onSuccess();

        } catch (err) {
            console.error('API Error:', err);
            alert(`Ошибка API: ${(err as Error).message}`);
        }
    };


    const modalTitle = props.initialData ? `Редактировать` : 'Создать';

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3>{modalTitle}</h3>
                <form onSubmit={handleSubmit} >
                    {props.fields.map((field) => (
                        <div key={field.name}>
                            <label style={labelStyle}>{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    name={field.name}
                                    value={String(formData[field.name as keyof T] || '')}
                                    onChange={handleChange}
                                    required={field.required}
                                    style={{ ...inputStyle, height: '150px' }}
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={String(formData[field.name as keyof T] || '')}
                                    onChange={handleChange}
                                    required={field.required}
                                    style={inputStyle}
                                >
                                    {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={String(formData[field.name as keyof T] || '')}
                                    onChange={handleChange}
                                    required={field.required}
                                    style={inputStyle}
                                />
                            )}
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                        <button type="button" onClick={props.onClose} style={{ ...buttonStyle, backgroundColor: '#ccc', marginRight: '10px' }}>Отмена</button>
                        <button type="submit" style={buttonStyle}>{props.initialData ? 'Сохранить' : 'Создать'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenericFormModal;
