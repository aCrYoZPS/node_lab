import { useParams, Link } from 'react-router-dom';
import { useApiData } from '../hooks/UseApi.tsx';
import { API_BASE_URL } from '../globals.ts'
import type { Article } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { formatInTimezone } from '../utils.ts';

const ArticlePage = () => {
    const { user } = useAuth();
    const { id } = useParams();
    let { data: article, loading, error } = useApiData<Article>(`${API_BASE_URL}/articles/${id}`);

    if (!article) {
        return <div>Статья не найдена</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>{article.title}</h1>
            <h2>Автор: {article.author.name}</h2>
            <h2>Опубликовано: {formatInTimezone(article.createdAt, user?.timezone || "UTC")}</h2>
            <p className="article_content">{article.content}</p>
            <br />
            <Link to="/blog" className="btn">Назад в блог</Link>
        </div>
    );
};

export default ArticlePage;
