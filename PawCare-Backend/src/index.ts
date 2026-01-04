import express , { Application , Request , Response } from 'express' ;
import bookRoute from './routes/book.route' ;  
import dotenv from 'dotenv';
import { connectDB } from './database/mongodb';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.route';
import { PORT } from './config';
import adminRoute from './routes/admin/admin.route';

dotenv.config();
console.log(process.env.port);

const app: Application = express();
// const PORT: number = 3000 ;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.use('/api/books', bookRoute);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoute);

async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
}

startServer();