import express from "express";
import type { Request, Response } from "express";
import { db } from "../models/index.js"
import bcrypt from "bcrypt"
import { HASHING_SALT_ROUNDS } from '../globals.js';
import { validateEmail } from '../utils.js';
import jwt from "jsonwebtoken"

export const authRouter = express.Router();


const User = db.User;

async function register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (name === undefined || email === undefined || !validateEmail(email) || password === undefined) {
        return res.status(400).json({ message: "Invalid user data" })
    }

    const password_hash = await bcrypt.hash(password, HASHING_SALT_ROUNDS);
    let new_user = new User(email, password_hash, name);
    new_user = await new_user.save();

    const token = jwt.sign({ user_id: new_user._id }, process.env.JWT_SECRET!);

    return res.json({ user: new_user, token: token });
}

async function authenticate(req: Request, res: Response) {
    const { email, password } = req.body;
}
