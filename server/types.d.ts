export interface JWTClaims {
    user_id: string;
}

declare global {
    namespace Express {
        interface Request {
            claims?: JWTClaims;
        }
    }
}
