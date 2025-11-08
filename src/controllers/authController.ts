import AuthService from "../services/authService.js";
import { type Request, type Response } from "express";
import type { AuthenticatedRequest } from "../types/types.js";
import { userInfo } from "os";

class AuthController {
    static register = async (req: Request, res: Response) => {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" });
            const existingUser = await AuthService.findUserByEmail(email);
            if (existingUser) return res.status(400).json({ message: "User has already registered" })
            const user = await AuthService.registerUser(username, email, password);
            return res.status(201).json({ message: "User Registered Successfully", ...user });
        } catch (error) {
            res.status(400).json({ message: "Register Failed", error });
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const token = await AuthService.loginUser(email, password);
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(400).json({ message: "Login Failed", error });
        }

    }

    static getProfile = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const requester = req.user;
            if (!requester?.id) return res.status(401).json({ message: 'Not authenticated' });

            const foundUser = await AuthService.findUserById(Number(requester.id));

            if (!foundUser) return res.status(400).json({ message: 'User not found' });

            const safeUser = {
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email
            };

            return res.status(200).json(safeUser);

        } catch (error) {
            console.log('getProfile error', (error as Error).message);
            res.status(500).json({ message: "Server error" });
        }
    }

    static getUserById = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const user = req.user;
            const userId = req.params.id;
            const foundUser = await AuthService.findUserById(Number(userId));
            if (!foundUser) return res.status(400).json({ message: "User not found with given id" });
            return res.status(200).json({ foundUser: foundUser, user: user });
        } catch (error) {
            return res.status(400).json({ message: "Get User Failed", error });
        }
    }


}

export default AuthController;