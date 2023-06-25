import express, { Express } from "express";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import PostgresDatabase from "./database/postgresHandler.js";

import productRouter from './routes/productRoutes.js';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

dotenv.config({path: path.join(__dirname, '..', '..', 'main.env')});

PostgresDatabase.createDatabase('development');

const app: Express = express();


//middleware && routes
app.use('/products', productRouter);


const port: number = 8080; 
app.listen(port, () => {
  console.log(`[server]: Server is running at port: ${port}`);
});