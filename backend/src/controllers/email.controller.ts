import prisma from "apps/database";
import { InternalServerError } from "errors/internal-server-errors";
import { NextFunction, Request, Response } from "express";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accountId } = req.params as unknown as { accountId: string };
        console.log("AccountId: ", accountId);
        const emails = await prisma.email.findMany({
            where: { accountId }
        });

        console.log("Emails: ", emails);

        return res.status(200).json({
            result: emails,
        });
    } catch (err: unknown) {
        console.error(err);
        next(new InternalServerError());
    }
}
