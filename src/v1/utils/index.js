'use strict';
const _ = require('lodash');
const { Types, Schema } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');

const getInfoData = ({ fields = [], object = {} }) => {
   return _.pick(object, fields);
};

// ['a', 'b'] = {a: 1, b: 1};
const selectDataObject = (select = []) => {
   return Object.fromEntries(select.map((i) => [i, 1]));
};

// ['a', 'b'] = {a: 0, b: 0};
const unSelectDataObject = (select = []) => {
   return Object.fromEntries(select.map((i) => [i, 0]));
};

const removeUndefinedObject = (obj) => {
   Object.keys(obj).forEach((i) => {
      if (obj[i] == null || obj[i] == undefined) {
         delete obj[i];
      }
   });
   return obj;
};

/**
 * Tránh việc lặp lại các key khi lấy dữ liệu từ DB
 * Tránh việc mất dữ liệu object lồng nếu không cập nhật
 * @param {Object} obj
 * const a = {
 *    b: {
 *       c: 1,
 *       d: 2,
 *    },
 *    e: 3
 * }
 *
 *  @returns a = {
 *    `b.c`: 1,
 *    `b.d`: 2,
 *    `e`: 3
 * }
 */
const updateNestedObjectParser = (obj) => {
   const final = {};
   Object.keys(obj || {}).forEach((key) => {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
         const nested = updateNestedObjectParser(obj[key]);
         Object.keys(nested).forEach((nestedKey) => {
            final[`${key}.${nestedKey}`] = nested[nestedKey];
         });
      } else {
         final[key] = obj[key];
      }
   });

   return final;
};

const convertToObjectIdMongo = (id) => new Types.ObjectId(id);

// hash passwords
const hashPassword = (password) =>
   bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const confirmPassword = (password, hashPassword) =>
   bcrypt.compareSync(password, hashPassword);

// jsonwebtoken
const createToken = ({ ...data }, options) => {
   return jwt.sign(data, process.env.JWT_SECRET_TOKEN, {
      expiresIn: options,
   });
};

const verifyToken = (token) => {
   return jwt.verify(token, process.env.JWT_SECRET_TOKEN);
};

// làm captcha (lần đầu tiên làm )
const transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
     user: process.env.EMAIL_NAME, // Thay bằng tài khoản email thật của bạn
     pass: process.env.EMAIL_APP_PASSWORD, // Thay bằng mật khẩu email thật của bạn
   },
 });

 const sendCaptchaEmail = (recipientEmail, captchaCode) => {
   const mailOptions = {
     from: process.env.EMAIL_NAME, // Thay bằng tài khoản email thật của bạn
     to: recipientEmail,
     subject: 'Mã CAPTCHA cho đăng ký tài khoản',
     text: `Mã CAPTCHA của bạn là: ${captchaCode}`,
   };

   const message = '';
 
   transporter.sendMail(mailOptions, (error, info) => {
     if (error) {
       console.log('Lỗi khi gửi email:', error); 
         message = `Lỗi khi gửi email: ${error}`
     } else {
       console.log('Email gửi thành công:', info.response);   
         message = `Email gửi thành công: ${info.response}`    
     }
   });
 };

 const isCaptchaExpired = (expirationTime) => {
   // Kiểm tra xem thời gian CAPTCHA có hết hạn hay chưa
   return new Date() > new Date(expirationTime);
 };

module.exports = {
   Headers: {
      API_KEY: 'x-api-key',
      AUTHORIZATION: 'authorization',
      CLIENT_ID: 'x-client-id',
      REFRESH_TOKEN: 'x-refresh-token',
   },
   getInfoData,
   selectDataObject,
   unSelectDataObject,
   removeUndefinedObject,
   updateNestedObjectParser,
   convertToObjectIdMongo,
   hashPassword,
   confirmPassword,
   createToken,
   verifyToken,
   sendCaptchaEmail
};
