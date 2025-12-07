import { useNavigate } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import { useApiData } from "../hooks/UseApi";
import { useAuth } from "../context/AuthContext";
import { type Article } from "../types";
import { API_BASE_URL } from "../globals";
import React from "react";

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleViewDetails = (id: string) => {
        navigate(`/blog/${id}`);
    };

    const { data: latestArticle, loading, error } = useApiData<Article | null>(`${API_BASE_URL}/articles/latest`);

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Добро пожаловать в CleanPro</h1>
                <p>Лучший клининг в вашем городе.</p>
                <h3>Последняя статья блога</h3>
                <p>Загрузка последней статьи...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Добро пожаловать в CleanPro</h1>
                <p>Лучший клининг в вашем городе.</p>
                <h3>Последняя статья блога</h3>
                <p style={{ color: 'red' }}>⚠️ Ошибка при загрузке статьи: {error}. Пожалуйста, попробуйте позже.</p>
            </div>
        );
    }

    if (!latestArticle) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Добро пожаловать в CleanPro</h1>
                <p>Лучший клининг в вашем городе.</p>
                <h3>Последняя статья блога</h3>
                <p>В данный момент новые статьи в блоге отсутствуют.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Добро пожаловать в CleanPro</h1>
            <p>Лучший клининг в вашем городе.</p>

            <h3>Последняя статья блога</h3>

            <div style={{ maxWidth: '400px' }}>
                <ArticleCard
                    key={latestArticle.id}
                    article={latestArticle}
                    userTimezone={user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                    onViewDetails={handleViewDetails}
                />
            </div>
        </div>
    );
}

export default HomePage;
