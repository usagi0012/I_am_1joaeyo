import { Router } from 'express';
import db from '../../../models/index.cjs';
import Response from '../../../util/response/response.js';
import { needSignin } from '../../../middleware/auth.middleware.js';

const commentsRouter = Router();
const { Comments, Posts, Users } = db;

/**
 * 덧글 작성 API
 */
commentsRouter.post('/:postId/comments', needSignin, async (req, res) => {
    const { postId } = req.params;
    const userId = res.locals.user;
    const { content } = req.body;

    const postResult = await Posts.findOne({
        where: {
            id: postId,
        },
    });

    if (!postResult) {
        return res.status(400).json(Response.failResult('존재하지 않는 게시글 입니다.'));
    }
    if (!content) {
        return res.status(400).json(Response.failResult('덧글이 입력되지 않았습니다.'));
    }

    const resultComment = await Comments.create({
        postId,
        userId,
        content,
    });

    res.status(201).json(Response.successResult('덧글을 등록하였습니다.', resultComment));
});

/**
 * 덧글 조회 API
 */
commentsRouter.get('/:postId/comments', async (req, res) => {
    const { postId } = req.params;

    const postResult = await Posts.findOne({
        where: {
            id: postId,
        },
    });
    if (!postResult) {
        return res.status(400).json(Response.failResult('게시글이 존재하지 않습니다.'));
    }

    const resultComment = await Comments.findAll({
        attributes: ['content', 'createdAt', 'userId', 'id'],
        where: {
            postId,
        },
        include: [
            {
                model: Users,
                as: 'users',
                attributes: ['nickname'],
            },
        ],
    });

    const successComments = resultComment.map(ele => {
        return ele.toJSON();
    });

    res.status(200).json(Response.successResult('덧글 조회 성공', successComments));
});

/**
 * 덧글 수정 API
 */
commentsRouter.patch('/:postId/:commentId', needSignin, async (req, res) => {
    const id = res.locals.user;
    const { postId, commentId } = req.params;
    const { content } = req.body;

    const postResult = await Posts.findOne({
        where: {
            id: postId,
        },
    });

    if (!postResult) {
        return res.status(400).json(Response.failResult('게시글이 존재하지 않습니다.'));
    }

    const commentResult = await Comments.findOne({
        attributes: ['content', 'createdAt', 'userId', 'id'],
        where: {
            id: commentId,
        },
    });

    if (commentResult.userId !== id) {
        return res.status(400).json({
            success: false,
            message: '본인이 작성한 댓글만 수정/삭제가 가능합니다.',
        });
    }

    const updateResult = await Comments.update(
        {
            content,
        },
        {
            where: {
                id: commentId,
                postId,
            },
        },
    );
    console.log(updateResult);
    return res.status(200).json(Response.successResult('덧글이 수정 완료되었습니다.', updateResult));
});

/**
 * 덧글 삭제 API
 */
commentsRouter.delete('/:postId/:commentId', needSignin, async (req, res) => {
    const id = res.locals.user;
    const { postId, commentId } = req.params;

    const commentResult = await Comments.findOne({
        attributes: ['content', 'createdAt', 'userId', 'id'],
        where: {
            id: commentId,
        },
    });

    if (commentResult.userId !== id) {
        return res.status(400).json({
            success: false,
            message: '본인이 작성한 댓글만 수정/삭제가 가능합니다.',
        });
    }

    const deleteResult = await Comments.destroy({
        where: {
            postId,
            id: commentId,
        },
    });

    return res.status(200).json({
        success: true,
        message: '댓글을 삭제하였습니다.',
    });
});

export default commentsRouter;
