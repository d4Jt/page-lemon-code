'use strict';
const authRouter = require('./auth.router');
const postRouter = require('./post.router');

const routes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/post', postRouter);
};

module.exports = routes;
