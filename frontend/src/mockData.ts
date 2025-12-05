import type { Service, Vacancy } from './types';

export const services: Service[] = [
    { id: 1, title: 'Уборка квартир', description: 'Полная уборка', price: 5000, image: 'https://via.placeholder.com/150' },
    { id: 2, title: 'Химчистка', description: 'Чистка мебели', price: 3000, image: 'https://via.placeholder.com/150' },
    { id: 3, title: 'Мойка окон', description: 'Без разводов', price: 1500, image: 'https://via.placeholder.com/150' },
    { id: 4, title: 'Офис', description: 'Клининг офисов', price: 10000, image: 'https://via.placeholder.com/150' },
];

export const vacancies: Vacancy[] = [
    { id: 1, title: 'Клинер', salary: '50 000 руб.' },
    { id: 2, title: 'Менеджер', salary: '70 000 руб.' },
];
