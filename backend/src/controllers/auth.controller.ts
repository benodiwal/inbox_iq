import { Request, Response } from "express";
import { IGoogleAuthPayloadSchema } from "routes/auth.router"

export const authController = (req: Request, res: Response) => {
    const { code } = req.body as unknown as IGoogleAuthPayloadSchema;
    console.log(code);
    res.sendStatus(200);
}
