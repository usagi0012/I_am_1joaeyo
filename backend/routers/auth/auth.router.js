import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../../models/index.cjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authRouter = Router();
const { Users } = db;

authRouter.get('/signup', (req, res) => {
    res.send(200);
});

authRouter.post('/signup', async (req, res) => {
    try {
        const { nickname, email, password, passwordConfirm } = req.body;
        console.log(password, '   ', passwordConfirm);
        if (!nickname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: '정보를 모두 입력해주세요.',
            });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({
                success: false,
                message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: '비밀번호는 최소 6자리 이상이어야 합니다.',
            });
        }

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

        //비밀번호 유효성 검사 함수
        const validPassword = newPassword => {
            const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/i;
            return passwordRegex.test(newPassword);
        };
        if (!validPassword(password)) {
            return res.status(400).json({
                success: false,
                message: '비밀번호는 8-20자 영문, 숫자 조합으로 이루어져야 합니다.',
            });
        }

        const emailValidationRegex = new RegExp('[a-z0-9._]+@[a-z]+.[a-z]{2,3}');
        const isValidEmail = emailValidationRegex.test(email);
        if (!isValidEmail) {
            return res.status(400).json({
                success: false,
                message: '이메일 형식이 올바르지 않습니다.',
            });
        }

        const existUser = await Users.findOne({ where: { email } });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: '이미 가입된 이메일입니다.',
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 13);

        const newUser = (await Users.create({ nickname, email, password: hashedPassword })).toJSON();
        delete newUser.password;

        return res.status(201).json({
            success: true,
            message: '회원가입에 성공했습니다.',
            data: newUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
});

//로그인 기능
authRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        res.status(400).json({
            success: false,
            message: '이메일을 입력해주세요',
        });
    }

    if (!password) {
        res.status(400).json({
            success: false,
            message: '비밀번호를 입력해주세요',
        });
    }
    const user = (await Users.findOne({ where: { email } }))?.toJSON();
    if (!user) {
        return res.status(401).json({
            success: false,
            message: '유저 정보가 없습니다',
        });
    }
    const hashedPassword = user?.password;
    const ispasswordMatched = bcrypt.compareSync(password, hashedPassword);
    if (!ispasswordMatched) {
        return res.status(401).json({
            success: false,
            message: '비밀번호가 틀립니다.',
        });
    }

    try {
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_KEY, {
            expiresIn: '1h',
        });
        return res.status(200).header('authorization', `Bearer ${accessToken}`).json({
            success: true,
            message: '로그인에 성공했습니다.',
            data: { accessToken },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
});
export default authRouter;
