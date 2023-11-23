import { Router } from 'express';
import postsRouter from './posts/posts.router.js';
import commentsRouter from './posts/comments/comments.router.js';
import authRouter from './auth/auth.router.js';
import userRouter from './users/users.router.js';
import likeRouter from './posts/likes/likes.router.js';

const apiRouter = Router();

apiRouter.use('/posts', [postsRouter, likeRouter]);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/authRouter', authRouter);
apiRouter.use('/user', userRouter);

export default apiRouter;
