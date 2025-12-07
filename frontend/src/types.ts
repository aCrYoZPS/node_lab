export interface Service {
    id: string;
    name: string;
    price: number;
    serviceType: ServiceType;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    image: string;
}

export interface ServiceType {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Vacancy {
    id: string;
    title: string;
    comment: string;
    salary: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    timezone: string;
    token?: string;
}

export interface Article {
    id: string;
    title: string;
    content: string;
    author: User;
    abstract: string;
    createdAt: Date;
    updatedAt: Date;
}
