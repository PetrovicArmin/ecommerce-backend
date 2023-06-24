import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

dotenv.config({path: path.join(__dirname, '..', 'main.env')});

const app = express();
const port: number = 8080; 

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server - BIGGEST CHANGE!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});