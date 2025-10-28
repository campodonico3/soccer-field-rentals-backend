import dotenv from 'dotenv';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import AuthRouter from './routes/authRoute.js';

dotenv.config();

const app = express();

app.use(cors(
    {
        origin: ['http://localhost:3000']
    }
));

app.use(express.json());
app.use('/api', AuthRouter);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;

app.get('/', (req: Request, res: Response) => {
    return res.json({ message: "Soccer Field Rentals API" });
});

app.listen(PORT, () => {
    console.log('Server is running at http://' + HOST + ':' + PORT);
})
