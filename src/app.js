const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// init middlewares
app.use(morgan('dev')); // morgan('combined') full thong tin
app.use(helmet()); // bao ve thong tin rieng tu, ngan chan web thu 3 truy cap doc thong tin, cookie
app.use(compression()); // giam dung luong van chuyen du lieu web
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
// require('./v1/configs/init.multi.mongodb');
require('./v1/configs/init.mongodb');
// require('./v1/helpers/check.connect').checkOverLoad();

require('./v1/middlewares/passport');

// init routes
require('./v1/routes/index.route')(app);

// handling error
app.use((req, res, next) => {
   const error = new Error('Not Found');
   error.statusCode = 404;
   next(error);
});
app.use((error, req, res, next) => {
   const status = error.statusCode || 500;
   return res.status(status).json({
      status: 'error',
      code: status,
      message: error.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : '',
   });
});

module.exports = app;
