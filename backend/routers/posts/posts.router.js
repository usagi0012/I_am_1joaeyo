import express from 'express';
import db from '../../models/index.cjs';
import { needSignin } from '../../middleware/auth.middleware.js';

const postsRouter = express.Router();
const { Posts } = db;

// 게시글 작성 API
postsRouter.post('/', needSignin, async (req, res) => {
    try {
        const userId = res.locals.user;
        const { title, content, image } = req.body;

        if (!title || !content || !image) {
            return res.status(400).json({
                success: false,
                message: '형식에 맞게 작성해주세요.',
            });
        }

        if (title.length > 50) {
            return res.status(400).json({
                success: false,
                message: '제목은 공백포함 50자 이하로 작성해주세요.',
            });
        }

        const post = await Posts.create({ title, content, image, userId });

        return res.status(201).json({
            success: true,
            message: '게시글을 등록하였습니다.',
            data: post,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            sucess: false,
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의해주세요.',
        });
    }
});

// 게시글 수정 API
postsRouter.put('/:postId', needSignin, async (req, res) => {
    try {
        const userId = res.locals.user;
        const { postId } = req.params;
        const { title, content, image } = req.body;

        // ?
        if (!title && !content && !image) {
            return res.status(400).json({
                sucess: false,
                message: '수정 정보가 없습니다.',
            });
        }

        const post = await Posts.findByPk(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: '게시글이 존재하지 않습니다.',
            });
        }

        if (title) {
            if (title.length > 40) {
                return res.status(400).json({
                    success: false,
                    message: '제목은 공백포함 40자 이하로 작성해주세요.',
                });
            }
        }

        await post.update(
            {
                ...(title && { title }),
                ...(content && { content }),
                ...(image && { image }),
            },
            { where: { id: postId } },
        );

        //
        const updatedPost = {
            ...post.toJSON(),
            userId,
        };

        return res.status(200).json({
            success: true,
            message: '게시글을 수정하였습니다.',
            data: updatedPost,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            sucess: false,
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의해주세요.',
        });
    }
});

// 게시글 삭제 API
postsRouter.delete('/:postId', needSignin, async (req, res) => {
    try {
        const userId = res.locals.user;
        const { postId } = req.params;

        const post = await Posts.findByPk(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: '게시글이 존재하지 않습니다.',
            });
        }

        await Posts.destroy({ where: { id: postId } });

        //
        const deletedPost = {
            ...post.toJSON(),
            userId,
        };

        return res.status(200).json({
            success: true,
            message: '게시글을 삭제하였습니다.',
            data: deletedPost,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            sucess: false,
            message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의해주세요.',
        });
    }
});

export default postsRouter;
