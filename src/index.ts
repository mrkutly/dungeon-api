import express from 'express';
import { PORT } from './config/index';

const app = express();

app.get('/', (req, res) => res.send('hello'));

app.listen(PORT, (): void => console.log(`Running on port ${PORT}`));
