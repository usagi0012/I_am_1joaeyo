import express from 'express';
import db from '../../models/index.cjs';
import Response from '../../util/response/response.js';
import moment from 'moment-timezone';

const postsRouter = express.Router();
const { Posts, Users, Likes } = db;

/**
 * 게시글 조회 API
 */
postsRouter.get('/', async (req, res) => {
    const posts = await Posts.findAll({
        attributes: ['id', 'title', 'userId', 'createdAt', 'image'],
        include: [
            {
                model: Users,
                as: 'user',
                attributes: ['nickname'],
            },
            {
                model: Likes,
                as: 'likes',
                attributes: ['userId'],
            },
        ],
        order: [['createdAt', 'DESC']],
    });

    const bestPosts = await Posts.findAll({
        attributes: ['id', 'title', 'userId', 'createdAt', 'image'],
        include: [
            {
                model: Users,
                as: 'user',
                attributes: ['nickname'],
            },
            {
                model: Likes,
                as: 'likes',
                attributes: ['userId'],
            },
        ],
    });

    const resultPosts = posts.map(ele => {
        return ele.toJSON();
    });

    const resultBestPosts = bestPosts.map(ele => {
        return ele.toJSON();
    });

    resultPosts.forEach(ele => {
        ele.createdAt = moment(ele.createdAt).format('YYYY-MM-DD hh:mm:ss');
    });

    resultPosts.sort((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1));

    resultBestPosts.sort((a, b) => (a.likes.length < b.likes.length ? 1 : -1));

    return res.status(200).json({
        success: true,
        messege: '게시글 조회 성공',
        data: resultPosts,
        bestdata: resultBestPosts,
    });
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
            {
                model: Likes,
                as: 'likes',
                attributes: ['userId'],
            },
        ],
    });

    if (!resultPost) {
        return res.status(400).json(Response.failResult('해당 게시글이 존재하지 않습니다.'));
    }

    const successPost = resultPost.toJSON();
    successPost.createdAt = moment(resultPost.createdAt).format('YYYY-MM-DD hh:mm:ss');

    return res.status(200).json(Response.successResult('게시글 상세 조회 성공', successPost));
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

export default postsRouter;
