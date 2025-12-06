import type { Service, ServiceType, Vacancy } from './types';

export const serviceTypes: ServiceType[] = [
    {
        id: "A",
        name: "Residential",
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        id: "B",
        name: "Commercial",
        createdAt: new Date(),
        updatedAt: new Date()
    }
]

export const services: Service[] = [
    {
        id: "a",
        name: 'Уборка квартир',
        price: 5000,
        serviceType: serviceTypes[0],
        description: 'Полная уборка',
        image: 'https://via.placeholder.com/150',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "b",
        name: 'Химчистка',
        description: 'Чистка мебели',
        price: 3000,
        serviceType: serviceTypes[0],
        image: 'https://via.placeholder.com/150',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "c",
        name: 'Мойка окон',
        description: 'Без разводов',
        price: 1500,
        serviceType: serviceTypes[0],
        image: 'https://via.placeholder.com/150',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "d",
        name: 'Офис',
        description: 'Клининг офисов',
        price: 10000,
        image: 'https://via.placeholder.com/150',
        serviceType: serviceTypes[1],
        createdAt: new Date(),
        updatedAt: new Date()
    },
];

export const vacancies: Vacancy[] = [
    { id: 1, title: 'Клинер', salary: '50 000 руб.' },
    { id: 2, title: 'Менеджер', salary: '70 000 руб.' },
];
