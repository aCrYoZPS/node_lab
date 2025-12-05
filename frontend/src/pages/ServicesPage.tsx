import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { services as initialServices } from '../mockData';
import type { Service } from '../types';

// Требование: Функциональный компонент с декларативной функцией (function)
function ServicesPage() {
    const navigate = useNavigate();

    // Требование: Использование хуков useState
    const [services, setServices] = useState<Service[]>([]);
    const [filterPrice, setFilterPrice] = useState<number>(10000);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Требование: Использование хука useEffect (имитация загрузки)
    useEffect(() => {
        // Имитация задержки API
        setTimeout(() => {
            setServices(initialServices);
        }, 500);
    }, []);

    // Handler 1: Фильтрация по слайдеру
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterPrice(Number(e.target.value));
    };

    // Handler 2: Поиск
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Handler 3: Переход к деталям (передается в дочерний компонент)
    const handleViewDetails = (id: number) => {
        navigate(`/services/${id}`);
    };

    // Фильтрация данных
    const filteredServices = services.filter(
        s => s.price <= filterPrice && s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <h2>Каталог услуг</h2>

            <div className="filters" style={{ padding: '20px', background: 'white', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Поиск услуги..."
                    onChange={handleSearch}
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <label>
                    Макс. цена: {filterPrice}
                    <input
                        type="range"
                        min="1000"
                        max="15000"
                        value={filterPrice}
                        onChange={handlePriceChange}
                    />
                </label>
            </div>

            <div className="grid-catalog">
                {filteredServices.map(service => (
                    // Требование: Использование компонентов внутри компонентов
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </div>
        </div>
    );
}

export default ServicesPage;
