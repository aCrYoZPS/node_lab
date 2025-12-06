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
    id: number;
    title: string;
    salary: string;
}
