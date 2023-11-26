import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../../models/index.cjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const authRouter = Router();
const { Users } = db;

authRouter.use(cookieParser());

authRouter.get('/signup', (req, res) => {
    res.send(200);
});

authRouter.post('/signup', async (req, res) => {
    try {
        const { nickname, email, password, passwordConfirm } = req.body;
        console.log(nickname);
        if (!nickname || !email || !password) {
            return res.status(400).send(
                `<script type="text/javascript">alert("정보를 모두 입력해주세요.");document.location.href="http://127.0.0.1:5500/frontend/webapp/signup.html?";
            </script>`,
            );
        }

        //닉네임 유효성 검사
        const validNickname = nickname => {
            const nicknameRegex = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/i;
            return nicknameRegex.test(nickname);
        };
        if (!validNickname(nickname)) {
            return res.status(400).send(
                `<script type="text/javascript">alert("닉네임은 한글, 영문, 숫자만 가능하며 2-10자리 사이여야 합니다.");document.location.href="http://127.0.0.1:5500/frontend/webapp/signup.html?";
            </script>`,
            );
        }

        //이메일 유효성 검사
        const emailValidationRegex = new RegExp('[a-z0-9._]+@[a-z]+.[a-z]{2,3}');
        const isValidEmail = emailValidationRegex.test(email);
        if (!isValidEmail) {
            return res.status(400).send(
                `<script type="text/javascript">alert("이메일 형식이 올바르지 않습니다.");document.location.href="http://127.0.0.1:5500/frontend/webapp/signup.html?";
            </script>`,
            );
        }

        const existUser = await Users.findOne({ where: { email } });
        if (existUser) {
            return res.status(400).send(
                `<script type="text/javascript">alert("이미 가입된 이메일입니다.");document.location.href="http://127.0.0.1:5500/frontend/webapp/login.html?";
            </script>`,
            );
        }

        //비밀번호 유효성 검사 함수
        const validPassword = newPassword => {
            const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/i;
            return passwordRegex.test(newPassword);
        };
        if (!validPassword(password)) {
            return res.status(400).send(
                `<script type="text/javascript">alert("비밀번호는 8-20자 영문, 숫자 조합으로 이루어져야 합니다.");document.location.href="http://127.0.0.1:5500/frontend/webapp/signup.html?";
            </script>`,
            );
        }

        if (password !== passwordConfirm) {
            return res.status(400).send(
                `<script type="text/javascript">alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");document.location.href="http://127.0.0.1:5500/frontend/webapp/signup.html?";
            </script>`,
            );
        }

        const hashedPassword = bcrypt.hashSync(password, 13);

        const newUser = (await Users.create({ nickname, email, password: hashedPassword })).toJSON();
        delete newUser.password;

        return res.status(201).send(
            `<script type="text/javascript">alert("회원가입에 성공했습니다.");document.location.href="http://127.0.0.1:5500/frontend/webapp/login.html?";
        </script>`,
        );
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

    const emailValidationRegex = new RegExp('[a-z0-9._]+@[a-z]+.[a-z]{2,3}');
    const isValidEmail = emailValidationRegex.test(email);
    if (!isValidEmail) {
        return res.status(400)
            .send(`<script type="text/javascript">alert("이메일 형식이 올바르지 않습니다.");document.location.href="http://127.0.0.1:5500/frontend/webapp/login.html?";
        </script>`);
    }

    if (!password) {
        return res.status(400)
            .send(`<script type="text/javascript">alert("비밀번호를 입력해주세요.");document.location.href="http://127.0.0.1:5500/frontend/webapp/login.html?";
        </script>`);
    }

    const user = (await Users.findOne({ where: { email } }))?.toJSON();
    if (!user) {
        return res.status(401)
            .send(`<script type="text/javascript">alert("유저 정보가 없습니다. 회원가입 후 이용해주세요.");document.location.href="http://127.0.0.1:5500/frontend/webapp/signup.html?";
        </script>`);
    }

    const hashedPassword = user?.password;
    const ispasswordMatched = bcrypt.compareSync(password, hashedPassword);
    if (!ispasswordMatched) {
        return res.status(401)
            .send(`<script type="text/javascript">alert("비밀번호가 틀립니다.");document.location.href="http://127.0.0.1:5500/frontend/webapp/login.html?";
        </script>`);
    }

    try {
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_KEY, {
            expiresIn: '1h',
        });
        return res
            .status(200)
            .cookie('authorization', `Bearer ${accessToken}`)
            .send(
                `<script type="text/javascript">alert("로그인에 성공했습니다.");document.location.href="http://127.0.0.1:5500/frontend/webapp/index.html";
            </script>`,
            );
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
});

//로그아웃 기능
authRouter.post('/logout', async (req, res) => {
    const currentCookie = req.cookies.authorization;
    res.clearCookie('authorization', { path: '/' });

    return res.status(200).json({
        success: true,
        message: '로그아웃에 성공했습니다.',
    });
});
export default authRouter;
