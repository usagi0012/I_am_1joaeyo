import express from 'express';
import db from './models/index.cjs';

const app = express();
const port = 3000;

try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.use(express.json());
app.use(express.urlencoded());

app.listen(port, () => {
    console.log(`서버가 정상적으로 실행되었습니다. port : ${port}`);
});