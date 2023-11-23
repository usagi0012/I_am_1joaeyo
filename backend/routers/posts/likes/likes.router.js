import { Router } from 'express';
import db from '../../../models/index.cjs';
import { needSignin } from '../../../middleware/auth.middleware.js';
const likeRouter = Router();
const { Likes } = db;

//좋아요 생성 API
likeRouter.patch('/:postId/like', needSignin, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = res.locals.user;

        const likedPost = await Likes.findOne({
            where: { postId, userId },
        });

        //좋아요를 눌렀던 기록이 없는 경우 좋아요 생성
        if (!likedPost) {
            await Likes.create({
                userId,
                postId,
            });
            return res.status(200).json({
                success: true,
                message: '좋아요 생성 완료',
            });
        }

        //좋아요를 눌렀던 기록이 있는 경우 좋아요 삭제
        if (likedPost) {
            await Likes.destroy({
                where: {
                    userId,
                    postId,
                },
            });
            return res.status(200).json({
                success: true,
                message: '좋아요 삭제 완료',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
        });
    }
});

export default likeRouter;
