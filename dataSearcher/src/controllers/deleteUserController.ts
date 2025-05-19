import { Users } from "@/infra/db";
import { Request, Response } from "express";

export default async(req: Request, res: Response) => {
    const { email } = req.body;

    const user = await Users.deleteOne({email});
    req.session.destroy();
    return res.status(200).json({message: "Account deleted sucessful"});
}