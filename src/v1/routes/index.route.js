'use strict';
const authRouter = require('./auth.router');
const postRouter = require('./post.router');
const userRouter = require('./user.router');
const commentRouter = require('./comment.router');

const routes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/post', postRouter);
    app.use('/api/user', userRouter);
    app.use('/api/comment', commentRouter);
};

module.exports = routes;
