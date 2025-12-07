import React, { useState, useEffect } from 'react';
import { type Article } from '../types';

interface ArticleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: Article | null;
    onSubmit: (data: Partial<Article>) => void;
}

const ArticleFormModal: React.FC<ArticleFormModalProps> = ({ isOpen, onClose, article, onSubmit }) => {
    const [title, setTitle] = useState(article?.title || '');
    const [abstract, setAbstract] = useState(article?.abstract || '');
    const [content, setContent] = useState(article?.content || '');

    useEffect(() => {
        setTitle(article?.title || '');
        setAbstract(article?.abstract || '');
        setContent(article?.content || '');
    }, [article, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData: Partial<Article> = {
            title,
            abstract,
            content,
        };

        onSubmit(formData);
        onClose();
    };

    const modalTitle = article ? `Редактировать статью: ${article.id}` : 'Создать новую статью';

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3>{modalTitle}</h3>
                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>Заголовок:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Краткое содержание:</label>
                    <textarea
                        value={abstract}
                        onChange={(e) => setAbstract(e.target.value)}
                        required
                        style={{ ...inputStyle, height: '80px' }}
                    />

                    <label style={labelStyle}>Содержание:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={{ ...inputStyle, height: '150px' }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                        <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#ccc', marginRight: '10px' }}>Отмена</button>
                        <button type="submit" style={buttonStyle}>{article ? 'Сохранить' : 'Создать'}</button>
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

export default ArticleFormModal;
