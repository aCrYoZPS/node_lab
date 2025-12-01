import express from "express";
import type { Request, Response } from "express";
import { db } from "../models/index.js"
import { authMiddleware } from "../middlewares/auth.js";

export const vacancyRouter = express.Router();


const Vacancy = db.Vacancy;
const User = db.User;

async function getAllVacancies(req: Request, res: Response) {
    const vacancies = await Vacancy.find();
    return res.json(vacancies);
}


async function getVacancyById(req: Request, res: Response) {
    const vacancy = await Vacancy.findById(req.params.id);
    if (vacancy === null) {
        return res.status(404).json({ message: `Vacancy with id ${req.params.id} not found` });
    }

    return res.json(vacancy);
}

async function createVacancy(req: Request, res: Response) {
    const { title, comment, salary } = req.body;

    const user = await User.findById(req.claims?.user_id);
    if (user === null || !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    let vacancy = new Vacancy({ title, comment, salary });
    vacancy = await vacancy.save();

    return res.status(201).json(vacancy);
}


async function updateVacancy(req: Request, res: Response) {
    const { title, comment, salary } = req.body;

    const user = await User.findById(req.claims?.user_id);
    if (user === null || !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    const vacancy = await Vacancy.findById(req.params.id);
    if (vacancy === null) {
        return res.status(404).json({ message: `Vacancy with id ${req.params.id} not found` });
    }

    if (title !== undefined) {
        vacancy.title = title;
    }

    if (comment !== undefined) {
        vacancy.comment = comment;
    }

    if (salary !== undefined) {
        vacancy.salary = salary;
    }

    await vacancy.save();

    return res.json(vacancy);
}

async function deleteVacancy(req: Request, res: Response) {
    const user = await User.findById(req.claims?.user_id);
    if (user === null || !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    const vacancy = await Vacancy.findByIdAndDelete(req.params.id);
    if (vacancy === null) {
        res.status(404).json({ message: `Vacancy with id ${req.params.id} not found` });
        return;
    }

    res.json({ message: 'Vacancy deleted' });
}

vacancyRouter.get("/", getAllVacancies);
vacancyRouter.get('/:id', getVacancyById);
vacancyRouter.post("/", authMiddleware, createVacancy);
vacancyRouter.put('/:id', authMiddleware, updateVacancy);
vacancyRouter.delete('/:id', authMiddleware, deleteVacancy);
