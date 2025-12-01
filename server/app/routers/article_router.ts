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
    if (user === null) {
        return res.status(404).json({ message: `Author with id ${req.params.author_id} not found` });
    }

    const articles = await Article.findByAuthorId(req.params.author_id!);

    if (articles === null) {
        return res.status(200).json([]);
    }

    return res.status(200).json(articles);
}

async function createArticle(req: Request, res: Response) {
    const { title, abstract, content } = req.body;

    const user = await User.findById(req.claims?.user_id);
    if (user === null) {
        return res.status(403).json({ message: "Unauthorized" })
    }

    let new_article = new Article({ title, abstract, content, author: req.claims?.user_id });
    new_article = await new_article.save();

    return res.status(201).json(new_article);
}

async function updateArticle(req: Request, res: Response) {
    const { title, abstract, content } = req.body;

    const user = await User.findById(req.claims?.user_id);
    if (user === null) {
        return res.status(403).json({ message: "Unauthorized" })
    }

    let article = await Article.findById(req.params.id);
    if (article === null) {
        return res.status(404).json({ message: `Article with id ${req.params.id} not found` });
    }

    if (user._id !== article.author && !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    if (title !== undefined) {
        article.title = title;
    }

    if (abstract !== undefined) {
        article.abstract = abstract;
    }

    if (content !== undefined) {
        article.content = content;
    }

    article = await article.save();

    return res.json(article);
}

async function deleteArticle(req: Request, res: Response) {
    const user = await User.findById(req.claims?.user_id);
    if (user === null) {
        return res.status(403).json({ message: "Unauthorized" })
    }


    const article = await Article.findById(req.params.id);
    if (article === null) {
        return res.status(404).json({ message: `Article with id ${req.params.id} not found` });
    }

    if (user._id !== article.author && !user.is_admin) {
        return res.status(403).json({ message: "Insufficient privilege level" })
    }

    await Article.findByIdAndDelete(req.params.id);

    res.json({ message: 'Article deleted' });
}

articleRouter.get("/", getAllArticles);
articleRouter.get('/:id', getArticleById);
articleRouter.get('author/:author_id', getArticlesByAuthor);
articleRouter.post("/", authMiddleware, createArticle);
articleRouter.put('/:id', authMiddleware, updateArticle);
articleRouter.delete('/:id', authMiddleware, deleteArticle);
