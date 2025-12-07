import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../globals.ts';
import type { Article } from '../types.ts';
import { useApiData } from '../hooks/UseApi.tsx';
import ArticleCard from '../components/ArticleCard.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import moment from 'moment-timezone';

/**
 * Calculates the UTC timestamp for the start of the day (00:00:00) 
 * for the given local date string, interpreted in the specified timezone.
 * * @param dateString The date in 'YYYY-MM-DD' format.
 * @param timezone The IANA timezone string (e.g., 'Europe/Kyiv').
 * @returns UTC timestamp (number)
 */
const getUtcStartTimestamp = (dateString: string, timezone: string): number => {
    if (!dateString) {
        return 0;
    }

    const startOfDay = moment.tz(dateString, 'YYYY-MM-DD', timezone).startOf('day');

    return startOfDay.valueOf();
};

/**
 * Calculates the UTC timestamp for the end of the day (23:59:59.999) 
 * for the given local date string, interpreted in the specified timezone.
 * * @param dateString The date in 'YYYY-MM-DD' format.
 * @param timezone The IANA timezone string (e.g., 'Europe/Kyiv').
 * @returns UTC timestamp (number)
 */
const getUtcEndTimestamp = (dateString: string, timezone: string): number => {
    if (!dateString) {
        return Number.MAX_SAFE_INTEGER;
    }

    const endOfDay = moment.tz(dateString, 'YYYY-MM-DD', timezone).endOf('day');

    return endOfDay.valueOf();
};


function BlogPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const { data: articles, loading, error } = useApiData<Article[]>(`${API_BASE_URL}/articles`);

    if (articles === null) {
        return <div>Error: got null instead of articles</div>;
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleViewDetails = (id: string) => {
        navigate(`/blog/${id}`);
    };

    // Calculate UTC timestamps for filtering once per render
    const minTimeUtc = getUtcStartTimestamp(startDate, user?.timezone || "UTC");
    const maxTimeUtc = getUtcEndTimestamp(endDate, user?.timezone || "UTC");

    // 4. Логика фильтрации
    const filteredArticles = articles.filter(
        a => {
            // A. Фильтрация по тексту
            const textMatch = (
                a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.author.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const articleTimeUtc = new Date(a.createdAt).getTime();

            const dateMatch = articleTimeUtc >= minTimeUtc && articleTimeUtc <= maxTimeUtc;

            return textMatch && dateMatch;
        }
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h2>Блог</h2>

            <div
                className="filters"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '20px',
                    background: 'white',
                    marginBottom: '20px'
                }}
            >
                {/* Фильтр по тексту */}
                <input
                    type="text"
                    placeholder="Поиск статьи..."
                    onChange={handleSearch}
                    style={{ padding: '8px', minWidth: '200px' }}
                />

                {/* Фильтр по дате НАЧАЛА */}
                <label>
                    С:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ padding: '8px', marginLeft: '5px' }}
                    />
                </label>

                {/* Фильтр по дате ОКОНЧАНИЯ */}
                <label>
                    По:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{ padding: '8px', marginLeft: '5px' }}
                    />
                </label>
                <Link to="/article_management" className="btn nav-right">Управление статьями</Link>
            </div>

            <div className="grid-catalog">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map(article => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            // Pass the user's timezone for display formatting in ArticleCard
                            userTimezone={user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                            onViewDetails={handleViewDetails}
                        />
                    ))
                ) : (
                    <p>Статей по заданным критериям не найдено.</p>
                )}
            </div>
        </div>
    );
}

export default BlogPage;
