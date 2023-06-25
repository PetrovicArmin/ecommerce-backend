import express, { Express } from "express";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';

import productRouter from './routes/productRoutes.js';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

dotenv.config({path: path.join(__dirname, '..', 'main.env')});

const app: Express = express();

const port: number = 8080; 

app.use('/products', productRouter);


app.listen(port, () => {
  console.log(`[server]: Server is running at port: ${port}`);
});