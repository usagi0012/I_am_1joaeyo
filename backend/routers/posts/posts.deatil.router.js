import express from 'express';
import db from '../../models/index.cjs';
import Response from '../../util/response/response.js';
import moment from 'moment-timezone';

const postsRouter = express.Router();
const { Posts, Users, sequelize } = db;

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

export default postsRouter;