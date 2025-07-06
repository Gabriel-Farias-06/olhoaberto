import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  return next();
  // if (req.session.user) {
  // }

  // res.status(401).json({ message: "Not authenticated" });
};
