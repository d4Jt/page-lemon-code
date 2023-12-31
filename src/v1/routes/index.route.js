'use strict';
const authRouter = require('./auth.router');
const postRouter = require('./post.router');
const userRouter = require('./user.router');
const commentRouter = require('./comment.router');
// const searchRouter = require('./search.route');
const { notFound } = require('../middlewares/handle_error');

const routes = (app) => {
   app.use('/api/auth', authRouter);
   app.use('/api/post', postRouter);
   app.use('/api/user', userRouter);
   app.use('/api/comment', commentRouter);
   // app.use('/api/search', searchRouter);
   app.use(notFound);
};

module.exports = routes;
