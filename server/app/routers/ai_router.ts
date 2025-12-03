import express from "express";
import { GoogleGenAI } from "@google/genai";
import type { Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { db } from "../models/index.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
export const aiRouter = express.Router();

const User = db.User;

async function getAIResponse(req: Request, res: Response) {
    const { prompt } = req.body;

    const user = await User.findById(req.claims?.user_id);
    if (user === null) {
        return res.status(403).json({ message: "Unauthorized" })
    }

    if (prompt === undefined) {
        return res.status(400).json({ message: "Cannot send empty message to AI" });
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return res.json({ response: response });
}

aiRouter.post("/", authMiddleware, getAIResponse);
