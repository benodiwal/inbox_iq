import { Request, Response } from "express";

export const logout = (req: Request, res: Response) => {
    req.session.currentUserId = undefined;
    res.sendStatus(200);
}
