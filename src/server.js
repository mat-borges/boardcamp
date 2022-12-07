import express, { json } from 'express';

import categoriesRouter from './routes/categoriesRouter.js';
import cors from 'cors';
import customersRouter from './routes/customersRouter.js';
import dotenv from 'dotenv';
import gamesRouter from './routes/gamesRouter.js';
import rentalsRouter from './routes/rentalsRouter.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use(categoriesRouter);
app.use(customersRouter);
app.use(gamesRouter);
app.use(rentalsRouter);

app.listen(process.env.PORT, () => console.log(`Running server on http://localhost:${process.env.PORT}`));
