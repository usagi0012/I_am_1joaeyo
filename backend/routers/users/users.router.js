import express from 'express';
import db from '../../models/index.cjs';

const usersRouter = express.Router();
const { Users } = db;

//회원 정보 조회 API

// 미들웨어 만들면 가져오기
// import authMiddleware from '../../middleware/auth.middleware';

usersRouter.get('/members', async (req, res) => {
    try {
        // const userId = res.locals.user;
        const id = 1;
        const data = await Users.findOne({
            attributes: ['nickname', 'description'],
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: '회원 상세조회 성공',
            data,
        });
    } catch (error) {
        console.log(error);
    }
});

export default usersRouter;
