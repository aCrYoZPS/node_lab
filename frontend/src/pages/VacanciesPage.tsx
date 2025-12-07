import { API_BASE_URL } from '../globals.ts'
import type { Vacancy } from '../types.ts';
import { useApiData } from '../hooks/UseApi.tsx';
import VacancyCard from '../components/VacancyCard.tsx';

function VacanciesPage() {

    const { data: vacancies, loading, error } = useApiData<Vacancy[]>(`${API_BASE_URL}/vacancies`);
    if (vacancies === null) {
        return <div>Error: got null instead of vacancies</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h2>Вакансии</h2>

            <div className="grid-catalog">
                {vacancies.map(vacancy => (
                    // Требование: Использование компонентов внутри компонентов
                    <VacancyCard
                        key={vacancy.id}
                        vacancy={vacancy}
                    />
                ))}
            </div>
        </div>
    );
}

export default VacanciesPage;
