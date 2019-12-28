import express from 'express';
import { PORT } from './config';

const app = express();

app.get('/', (req, res) => res.send('hi'));

app.listen(PORT, (): void => console.log(`Listening on port ${PORT}`));