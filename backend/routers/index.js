import { Router } from 'express';
import postsRouter from './posts/posts.deatil.router.js';
import commentsRouter from './posts/comments/comments.router.js';
import authRouter from './auth/auth.router.js';
import userRouter from './users/users.router.js';

const apiRouter = Router();

apiRouter.use('/posts', [postsRouter, commentsRouter]);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/authRouter', authRouter);
apiRouter.use('/user', userRouter);

export default apiRouter;
