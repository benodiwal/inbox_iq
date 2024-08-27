import prisma from "apps/database";
import { InternalServerError } from "errors/internal-server-errors";
import { NextFunction, Request, Response } from "express";

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.session.currentUserId as string } });
        return res.status(200).json({
            result: user,
        });
    } catch (err: unknown) {
        console.error(err);
        next(new InternalServerError());
    }
}

export const accounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accounts = await prisma.emailAccount.findMany({ where: { userId: req.session.currentUserId as string } });
        return res.status(200).json({
            result: accounts,
        });
    } catch (err: unknown) {
        console.error(err);
        next(new InternalServerError());
    }
}

export const logout = (req: Request, res: Response) => {
    req.session.currentUserId = undefined;
    res.sendStatus(200);
}
