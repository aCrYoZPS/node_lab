import React from 'react';
import type { Article } from '../types';
import { formatInTimezone } from '../utils';

interface ArticleCardProps {
    article: Article;
    userTimezone: string;
    onViewDetails: (id: string) => void;
}


const ArticleCard: React.FC<ArticleCardProps> = ({ article, userTimezone, onViewDetails }) => {
    return (
        <div className="card fade-in" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: 'white' }}>
            <h3>{article.title}</h3>
            <h4>Автор: {article.author.name}</h4>
            <b><p>Опубликовано: {formatInTimezone(article.createdAt, userTimezone)}</p></b>
            <p>{article.abstract}</p>

            {/* Требование: Обработчик события с передачей параметров */}
            <button
                className="btn"
                onClick={() => onViewDetails(article.id)}
            >
                Подробнее
            </button>
        </div>
    );
};

export default ArticleCard;
