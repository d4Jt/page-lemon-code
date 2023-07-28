'use strict';
const authRouter = require('./auth.router');

const routes = (app) => {
    app.use('/api/auth', authRouter);
};

module.exports = routes;
