import express from 'express';
import db from './models/index.cjs';
import apiRouter from './routers/index.js';
import cors from 'cors';

const app = express();
const port = 3050;

try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use(apiRouter);

app.listen(port, () => {
    console.log(`서버가 정상적으로 실행되었습니다. port : ${port}`);
});
