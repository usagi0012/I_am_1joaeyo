import express from 'express';
import db from '../../models/index.cjs';

const usersRouter = express.Router();
const { Users } = db;

// 미들웨어 만들면 가져오기
// import authMiddleware from '../../middleware/auth.middleware';

//회원 정보 조회 API
usersRouter.get('/members', async (req, res) => {
    try {
        //미들웨어 가져오면 주석해제
        // const id = res.locals.user;
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
        return res.status(500).json({
            success: false,
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
});

//타 회원 정보 조회 API
usersRouter.get('/members/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await Users.findOne({
            attributes: ['nickname', 'description'],
            where: { id: userId },
        });
        res.status(200).json({
            success: true,
            message: '회원 상세조회 성공',
            data,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
});

//회원 정보 수정 API - 프로필 수정
usersRouter.patch('/members', async (req, res) => {
    try {
        const { nickname, description } = req.body;

        //미들웨어 가져오면 주석해제
        // const id = res.locals.user;
        const id = 1;

        //닉네임 형식이 올바르지 않은 경우
        //닉네임 유효성 검사 함수
        const validNickname = nickname => {
            const nicknameRegex = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/i;
            return nicknameRegex.test(nickname);
        };
        if (!validNickname(nickname)) {
            return res.status(400).json({
                success: false,
                message: '닉네임은 한글, 영문, 숫자만 가능하며 2-10자리 사이여야 합니다.',
            });
        }

        //수정 성공
        await Users.update(
            {
                ...(nickname && { nickname }),
                ...(description && { description }),
            },
            { where: { id } },
        );
        res.status(200).json({
            success: true,
            message: '회원 정보가 수정되었습니다.',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
});

export default usersRouter;
