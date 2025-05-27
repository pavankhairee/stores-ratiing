
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "../database/config";

export const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({
        error: "No Token Provided"
    })
    const token = authHeader;

    try {
        const decode = jwt.verify(token, JWT_TOKEN)

        req.user = {
            //@ts-ignore
            id: decode.id,
            //@ts-ignore
            role: decode.role
        }
        next();
    } catch (e) {
        return res.status(403).json({
            error: "Invalid Token"
        })
    }
} 