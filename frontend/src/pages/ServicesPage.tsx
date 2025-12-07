import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { API_BASE_URL } from '../globals.ts'
import type { Service } from '../types.ts';
import { useApiData } from '../hooks/UseApi.tsx';

// Требование: Функциональный компонент с декларативной функцией (function)
function ServicesPage() {
    const navigate = useNavigate();

    // Требование: Использование хуков useState
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterPrice, setFilterPrice] = useState<number>(10000);

    const { data: services, loading, error } = useApiData<Service[]>(`${API_BASE_URL}/services`);
    if (services === null) {
        return <div>Error: got null instead of services</div>;
    }

    let maxPrice = services.reduce((max, current) => (current.price > max ? current.price : max), -Infinity)
    if (maxPrice === -Infinity) {
        maxPrice = 15000;
    }


    // Handler 1: Фильтрация по слайдеру
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterPrice(Number(e.target.value));
    };

    // Handler 2: Поиск
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Handler 3: Переход к деталям (передается в дочерний компонент)
    const handleViewDetails = (id: string) => {
        navigate(`/services/${id}`);
    };

    // Фильтрация данных
    const filteredServices = services.filter(
        s => {
            return s.price <= filterPrice &&
                (
                    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.serviceType.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
        }
    ).sort((a, b) => a.price - b.price);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h2>Каталог услуг</h2>

            <div
                className="filters"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '20px',
                    background: 'white',
                    marginBottom: '20px'
                }}
            >
                <input
                    type="text"
                    placeholder="Поиск услуги..."
                    onChange={handleSearch}
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <label className="price-slider-label">
                    Макс. цена: {filterPrice}
                    <div className="slider-container">
                        <input
                            type="range"
                            min="1000"
                            max={maxPrice.toString()}
                            value={filterPrice}
                            onChange={handlePriceChange}
                            className="price-slider"
                        />
                    </div>
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
