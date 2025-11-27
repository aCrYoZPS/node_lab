import type { Request, Response, NextFunction } from "express";

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
        console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode}`);
    });
    next();
};
