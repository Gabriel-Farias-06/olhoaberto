import { Users } from "@/infra/db";
import bcrypt from "bcryptjs";
import {Request, Response} from "express";

export default async (req: Request, res: Response) => {
    const email = req.session.user.email;
    const password = req.body.password;
    const newName = req.body.newName;
    const newPassword = req.body?.newPassword;

    const user = await Users.findOne({ email });
    if(user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
        }
        user.updateOne( { email }, { name: newName });
        if(newPassword) {
            user.updateOne( { email }, { password: newPassword });
        }

        return res.status(200).json({ message: "User updated sucessfully" });
    }
} 