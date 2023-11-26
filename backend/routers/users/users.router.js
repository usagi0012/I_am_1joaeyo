import express from 'express';
import db from '../../models/index.cjs';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { needSignin } from '../../middleware/auth.middleware.js';
dotenv.config();
const usersRouter = express.Router();
const { Users, Posts } = db;

//회원 정보 조회 API
usersRouter.get('/members', needSignin, async (req, res) => {
    try {
        const id = res.locals.user;
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
            include: [
                {
                    model: Posts,
                    as: 'posts',
                    attributes: ['title', 'id'],
                },
            ],
        });

        if (!data) {
            return res.status(400).json({
                success: false,
                message: '존재하지 않는 회원입니다.',
            });
        }

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
usersRouter.patch('/members', needSignin, async (req, res) => {
    try {
        const { nickname, description, currentPassword, newPassword, confirmNewPassword } = req.body;
        const id = res.locals.user;

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
        let newHashedPassword;
        //비밀번호 수정 부분(셋 중 하나라도 채워져있으면 비밀번호 변경 실행)
        if (currentPassword || newPassword || confirmNewPassword) {
            //셋 중 하나라도 없으면 오류
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                return res.status(400).json({
                    success: false,
                    message: '비밀번호 변경을 위해서는 현재 비밀번호, 새 비밀번호 및 확인란을 모두 채워주세요.',
                });
            }

            //이전 비밀번호가 맞지 않는 경우
            const { password } = await Users.findOne({ attributes: ['password'], where: { id } });
            const passwordCorrect = await bcrypt.compare(currentPassword, password);
            console.log(passwordCorrect);

            if (!passwordCorrect) {
                return res.status(400).json({
                    success: false,
                    message: '현재 비밀번호가 일치하지 않습니다.',
                });
            }

            //새로운 비밀번호의 형식이 올바르지 않은 경우
            //비밀번호 유효성 검사 함수
            const validPassword = newPassword => {
                const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/i;
                return passwordRegex.test(newPassword);
            };
            if (!validPassword(newPassword)) {
                return res.status(400).json({
                    success: false,
                    message: '비밀번호는 8-20자 영문, 숫자 조합으로 이루어져야 합니다.',
                });
            }

            //비밀번호 확인과 맞지 않는 경우
            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({
                    message: '비밀번호를 다시 확인해주세요.',
                });
            }
            newHashedPassword = bcrypt.hashSync(newPassword, 13);
        }
        //수정 성공
        await Users.update(
            {
                ...(nickname && { nickname }),
                ...(description && { description }),
                password: newHashedPassword,
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

//회원 탈퇴 API
usersRouter.delete('/members', needSignin, async (req, res) => {
    try {
        const id = res.locals.user;
        await Users.destroy({ where: { id } });
        res.status(200).json({
            success: true,
            message: '탈퇴가 처리되었습니다.',
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
