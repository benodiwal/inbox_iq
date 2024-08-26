import prisma from "apps/database";
import { UnauthorizedError } from "errors/unauthorized-error";
import { NextFunction, Request, Response } from "express"

export const isAuthenticated = () => {
    return async (req: Request, _: Response, next: NextFunction) => {
        if (!req.session.currentUserId) {
            return next(new UnauthorizedError());
        }
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.currentUserId
            }
        });
        if (!user) {
            return next(new UnauthorizedError());   
        }
        req.session.currentUserId = user.id;
        next();
    }
}
