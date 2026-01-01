import { Request, Response } from 'express';
import User from '../Models/User';
import jwt from "jsonwebtoken"
import { z } from "zod"
import bcrypt from "bcrypt"
enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  Error = 500,
  AlreadyExists = 403
}
const signupschema = z.object({
  username: z.string().min(3, 'Username must be at least of 3 chars').max(10, 'Username cannot be more than 10 characters'),
  password: z.string().min(8, 'Password must be of at least 8 characters').max(10, 'Password must be less than 10 characters').regex(/[a-z]/, 'Must include at least one lowercase letter')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[0-9]/, 'Must include at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must include at least one special character')
})
export const SignupController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = signupschema.parse(req.body);

    // TODO: Implement signup logic (e.g., validation, hashing, saving to DB)
    const user = await User.findOne({ username: username })
    if (user) {
      res.status(ResponseStatus.AlreadyExists).json({ message: "Username Already Exists" });
      return;
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    await User.create({
      username: username,
      password: hashedpassword
    })
    res.status(ResponseStatus.Success).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message, errors: error.errors });
      return;
    }
    console.error(error);
    res.status(ResponseStatus.Error).json({ error: 'Internal Server Error' });
  }
};

export const LoginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    const existingUser = await User.findOne({
      username: username,
    })

    if (existingUser) {
      const passwordmatch = await bcrypt.compare(password, existingUser.password)
      if (passwordmatch) {
        const token = jwt.sign({
          id: existingUser._id
        }, process.env.JWT_SECRET as string, { expiresIn: "24h" })
        res.json({ token })
      } else {
        res.status(ResponseStatus.Error).json({
          message: "Incorrect Password"
        })
      }

    } else {
      res.status(ResponseStatus.NotFound).json({
        message: "Incorrect Credentials"
      })
    }
  } catch (error) {
    console.error(error);
    res.status(ResponseStatus.Error).json({ error: 'Internal Server Error' });
  }
}
