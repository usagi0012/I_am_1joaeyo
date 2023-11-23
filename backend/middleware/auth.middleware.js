import jwt from 'jsonwebtoken';
import db from '../models/index.cjs';
import dotenv from 'dotenv';
dotenv.config();

const { Users } = db;

export const needSignin = async (req, res, next) => {
    //인증 정보가 없는경우
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            res.status(400).json({
                success: false,
                message: '인증정보가 없습니다.',
            });
        }

        //토큰 형식이 일치하지 않는경우
        const [tokenType, accessToken] = authorizationHeader?.split(' ');

        if (tokenType !== 'Bearer') {
            res.status(400).json({
                success: false,
                message: '지원하지 않는 인증 방식입니다.',
            });
        }

        if (!accessToken) {
            res.status(400).json({
                success: false,
                message: 'Access토큰이 없습니다.',
            });
        }

        const decodedPayload = jwt.verify(accessToken, process.env.JWT_KEY);
        const { userId } = decodedPayload;

        const user = await Users.findOne({ where: { id: userId } });
        //userId가 일치하지 않는경우
        if (!user) {
            res.status(400).json({
                success: false,
                message: '사용자가 존재하지 않습니다.',
            });
        }
        res.locals.user = userId;
        next();
    } catch (error) {
        console.log(error.message);

        let statusCode = 500;
        let errorMessage = '';

        switch (error.message) {
            //유효기간이 지난 경우
            case 'jwt expired':
                statusCode = 401;
                errorMessage = '인증번호 유효기간이 지났습니다.';
                break;
            //검증에 실패한경우
            case 'invalid signature':
                statusCode = 401;
                errorMessage = '유효하지 않은 인증번호입니다.';
                break;
            default:
                statusCode = 500;
                errorMessage = '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.';
                break;
        }
        return res.status(statusCode).json({
            success: false,
            message: errorMessage,
        });
    }
};
