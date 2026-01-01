import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const usermiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers["authorization"];
  if (!header) {
    res.status(401).json({ message: "Unauthorized" });
    return; // ❗ Stop execution here
  }

  try {
    const decoded = jwt.verify(header, process.env.JWT_SECRET as string) as { id: string };

    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: "Unauthorized" });
    return; // ❗ Stop execution here too
  }
};
