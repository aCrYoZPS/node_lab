import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import type { JWTClaims } from "../../types.js";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const err = {
            status: 401,
            message: "Missing token",
        }
        next(err)
    }
    else {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as JWTClaims;
            req.claims = decoded;
            next();
        } catch (err: any) {
            err.status = 401;
            err.message = "Invalid token";
            next(err)
        }
    }

};
