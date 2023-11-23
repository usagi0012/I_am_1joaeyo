import express from 'express';
import db from '../../models/index.cjs';
import Response from '../../util/response/response.js';
import moment from 'moment-timezone';
import { needSignin } from '../../middleware/auth.middleware.js';

const postsRouter = express.Router();
const { Posts, Users, Likes } = db;

/**
 * 게시글 조회 API
 */
postsRouter.get('/', async (req, res) => {
    const posts = await Posts.findAll({
        attributes: ['id', 'title', 'content', 'userId', 'createdAt'],
        include: [
            {
                model: Users,
                as: 'user',
                attributes: ['nickname'],
            },
        ],
    });

    const resultPosts = posts.map(ele => {
        return ele.toJSON();
    });

    resultPosts.forEach(ele => {
        ele.createdAt = moment(ele.createdAt).format('YYYY-MM-DD hh:mm:ss');
    });

    res.status(200).json(Response.successResult('게시글 조회 성공', resultPosts));
});

/**
 * 게시글 상세 조회 API
 */
postsRouter.get('/:postId', async (req, res) => {
    const { postId } = req.params;

    const resultPost = await Posts.findOne({
        where: {
            id: postId,
        },
        include: [
            {
                model: Users,
                as: 'user',
                attributes: ['nickname'],
            },
        ],
    });

    if (!resultPost) {
        return res.status(400).json(Response.failResult('해당 게시글이 존재하지 않습니다.'));
    }

    const successPost = resultPost.toJSON();
    successPost.createdAt = moment(resultPost.createdAt).format('YYYY-MM-DD hh:mm:ss');

    res.status(200).json(Response.successResult('게시글 상세 조회 성공', successPost));
});

/**
 * 테스트용 데이터 생성 API
 */
postsRouter.post('/testCreate', async (req, res) => {
    const result = await Posts.create({
        title: '테스트 포스트',
        content: '테스트 컨텐츠',
        userId: 1,
    });

    res.status(200).json(result);
});

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

        await post.update(
            {
                ...(title && { title }),
                ...(content && { content }),
                ...(image && { image }),
            },
            { where: { id: postId } }
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
