import { useParams, Link } from 'react-router-dom';
import { useApiData } from '../hooks/UseApi.tsx';
import { API_BASE_URL } from '../globals.ts'
import type { Service } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';

const ServiceDetailsPage = () => {
    const { id } = useParams();
    let { data: service, loading, error } = useApiData<Service>(`${API_BASE_URL}/services/${id}`);
    const { addItemToCart } = useCart();

    if (!service) {
        return <div>Услуга не найдена</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleAddToCart = () => {
        addItemToCart(service);
        alert(`${service.name} добавлен в корзину!`);
    };
    const img = service?.image || "/defaultServiceImage.jpg";

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>{service.name}</h1>
            <img className="service_details_img" src={img} alt={service.name} />
            <p>{service.description}</p>
            <h2>Цена: {service.price} руб.</h2>
            <button onClick={handleAddToCart} className='btn' style={{ margin: "10px" }}>
                ➕ Добавить в корзину
            </button>
            <Link to="/services" className="btn">Назад в каталог</Link>
        </div>
    );
};

export default ServiceDetailsPage;
