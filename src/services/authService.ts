import 'dotenv/config';
import bcript from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/client.js';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
    static registerUser = async (username: string, email: string, password: string) => {
        const hashedPassword = await bcript.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
            select: {
                id:true,
                username: true,
                email: true,
            }
        })
        const token = jwt.sign({ id: user.id }, JWT_SECRET!, { expiresIn: '1h' });
        return { user, token };
    }

    static findUserById = async (id: number) => {
        return prisma.user.findUnique({
            where: {
                id: id
            }
        });
    }

    static findUserByEmail = async (email: string) => {
        return await prisma.user.findUnique({
            where: {
                email: email
            }
        });
    }

    static getUsers = async () => {
        return await prisma.user.findMany();
    }

    static loginUser = async (email: string, password: string) => {
        const user = await this.findUserByEmail(email);
        if (!user) throw new Error('User not found');
        const isMatch = await bcript.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');
        const token = jwt.sign({ id: user.id }, JWT_SECRET!, { expiresIn: '1h' });
        return token;
    }
}

export default AuthService;