import express from 'express';
import db from '../../models/index.cjs';

const postsRouter = express.Router();
const { Posts } = db;

/**
 * 게시글 조회 API
 */
postsRouter.get('/posts', async (req, res) => {
    console.log(Posts);
});

export default postsRouter;
