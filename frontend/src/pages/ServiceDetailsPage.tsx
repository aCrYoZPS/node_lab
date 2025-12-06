import { useParams, Link } from 'react-router-dom';
import { useApiData } from '../hooks/UseApi.tsx';
import { API_BASE_URL } from '../globals.ts'
import type { Service } from '../types.ts';

const ServiceDetails = () => {
    const { id } = useParams();
    let { data: service, loading, error } = useApiData(`${API_BASE_URL}/services/${id}`) as
        {
            data: Service[];
            loading: boolean;
            error: string | null;
        };

    if (!service) {
        return <div>Услуга не найдена</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>{service.name}</h1>
            <img src={service.image} alt={service.name} />
            <p>{service.description}</p>
            <h2>Цена: {service.price} руб.</h2>
            <Link to="/services" className="btn">Назад в каталог</Link>
        </div>
    );
};

export default ServiceDetails;
