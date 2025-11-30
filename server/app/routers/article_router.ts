import express from "express";
import type { Request, Response } from "express";
import { db } from "../models/index.js"
import { authMiddleware } from "../middlewares/auth.js";

export const articleRouter = express.Router();


const User = db.User;
const Article = db.Article;

async function getAllArticles(req: Request, res: Response) {
    const articles = await Article.find();
    return res.json(articles);
}

async function getArticleById(req: Request, res: Response) {
    const article = await Article.findById(req.params.id);
    if (article === null) {
        return res.status(404).json({ message: `Article with id ${req.params.id} not found` });
    }

    return res.json(article);
}

async function getArticlesByAuthor(req: Request, res: Response) {
    const user = await User.findById(req.params.author_id);

    const articles = await Article.findByAuthorId(req.params.author_id!);

    if (articles === null) {

    }
}

async function createService(req: Request, res: Response) {
    const { name, price, service_type_id } = req.body;

    const user = await User.findById(req.claims?.user_id);
    if (user === null || !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    const service_type = await ServiceType.findById(service_type_id);
    if (service_type === null) {
        return res.status(400).json({ message: `Invalid service type id ${service_type_id}` });
    }

    let new_service = new Service({ name, price, service_type: service_type._id });
    new_service = await new_service.save();

    return res.status(201).json(new_service);
}

async function updateService(req: Request, res: Response) {
    const { name, price, service_type_id } = req.body;

    const user = await User.findById(req.claims?.user_id);
    if (user === null || !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    const service = await Service.findById(req.params.id);
    if (service === null) {
        return res.status(404).json({ message: `Service with id ${req.params.id} not found` });
    }

    if (name !== undefined) {
        service.name = name;
    }

    if (price !== undefined) {
        service.price = price;
    }

    if (service_type_id !== undefined) {
        const service_type = await ServiceType.findById(service_type_id);
        if (service_type === null) {
            return res.status(400).json({ message: `Invalid service type id ${service_type_id}` });
        }

        service.service_type = service_type._id;
    }

    await service.save();

    return res.json(service);
}

async function deleteService(req: Request, res: Response) {
    const user = await User.findById(req.claims?.user_id);
    if (user === null || !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    const service = await Service.findByIdAndDelete(req.params.id);
    if (service === null) {
        res.status(404).json({ message: 'Service not found' });
        return;
    }

    res.json({ message: 'Service deleted' });
}

serviceRouter.get("/", getAllServices);
serviceRouter.get('/:id', getServiceById);
serviceRouter.post('/', authMiddleware, createService);
serviceRouter.put('/:id', authMiddleware, updateService);
serviceRouter.delete('/:id', authMiddleware, deleteService);
