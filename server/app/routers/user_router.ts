import express from "express";
import type { Request, Response } from "express";
import { db } from "../models/index.js"
import bcrypt from "bcrypt"
import { HASHING_SALT_ROUNDS } from '../globals.js';
import { validateEmail } from '../utils.js';

export const userRouter = express.Router();


const User = db.User;

async function getUser(req: Request, res: Response) {
    const user = await User.findById(req.claims?.user_id);
    if (user === null) {
        return res.status(404).json({ message: `User with id ${req.claims?.user_id} not found` });
    }

    return res.json(user);
}

async function getUserById(req: Request, res: Response) {
    const user = await User.findById(req.params.id);
    if (user === null) {
        return res.status(404).json({ message: `User with id ${req.params.id} not found` });
    }

    return res.json(user);
}

async function updateUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const user_id = req.params.id;
    const claims_id = req.claims?.user_id

    if (claims_id === undefined || user_id != claims_id) {
        return res.status(403).json({ message: "Cannot update other users" })
    }

    const user = await User.findById(req.params.id);
    if (user === null) {
        return res.status(404).json({ message: `User with id ${req.params.id} not found` });
    }

    if (name !== undefined) {
        user.name = name;
    }

    if (email !== undefined) {
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid or missing email" })
        }

        user.email = email;
    }

    if (password !== undefined) {
        user.password_hash = await bcrypt.hash(password, HASHING_SALT_ROUNDS);
    }

    await user.save();
    return res.json(user);
}

async function deleteUser(req: Request, res: Response) {
    const user_id = req.params.id;
    const claims_id = req.claims?.user_id;
    if (claims_id === undefined || user_id != claims_id) {
        return res.status(403).json({ message: "Cannot delete other users" })
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (user === null) {
        res.status(404).json({ message: `User with id ${req.params.id} not found` });
        return;
    }

    res.json({ message: 'User deleted' });
}

userRouter.get("/me", getUser);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
