import express from "express";
import type { Request, Response } from "express";
import { db } from "../models/index.js"
import { authMiddleware } from "../middlewares/auth.js";

export const serviceTypeRouter = express.Router();


const ServiceType = db.ServiceType;
const User = db.User;

async function getAllServiceTypes(req: Request, res: Response) {
    const serviceTypes = await ServiceType.find();
    return res.json(serviceTypes);
}

async function getServiceTypeById(req: Request, res: Response) {
    const serviceType = await ServiceType.findById(req.params.id);
    if (serviceType === null) {
        return res.status(404).json({ message: `Service Type with id ${req.params.id} not found` });
    }

    return res.json(serviceType);
}

async function createServiceType(req: Request, res: Response) {
    const { name } = req.body;

    const user = await User.findById(req.claims?.user_id);
    if (user === null || !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    let new_service_type = new ServiceType({ name });
    new_service_type = await new_service_type.save();

    return res.status(201).json(new_service_type);
}

async function updateServiceType(req: Request, res: Response) {
    const { name } = req.body;

    const user = await User.findById(req.claims?.user_id);
    if (user === null || !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    const service_type = await ServiceType.findById(req.params.id);
    if (service_type === null) {
        return res.status(404).json({ message: `Service Type with id ${req.params.id} not found` });
    }

    if (name !== undefined) {
        service_type.name = name;
    }

    await service_type.save();

    return res.json(service_type);
}

async function deleteServiceType(req: Request, res: Response) {
    const user = await User.findById(req.claims?.user_id);
    if (user === null || !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    const serviceType = await ServiceType.findByIdAndDelete(req.params.id);
    if (serviceType === null) {
        res.status(404).json({ message: 'ServiceType not found' });
        return;
    }

    res.json({ message: 'ServiceType deleted' });
}

serviceTypeRouter.get("/", getAllServiceTypes);
serviceTypeRouter.get('/:id', getServiceTypeById);
serviceTypeRouter.post('/', authMiddleware, createServiceType);
serviceTypeRouter.put('/:id', authMiddleware, updateServiceType);
serviceTypeRouter.delete('/:id', authMiddleware, deleteServiceType);
