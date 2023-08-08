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
      from: '"Lemon Code 🍋" <process.env.EMAIL_NAME>', // Thay bằng tài khoản email thật của bạn
      to: recipientEmail,
      subject: 'Mã CAPTCHA cho đăng ký tài khoản',
      // attachments: [
      //    {
      //       filename: 'logo.png',
      //       // path: __dirname + '/logo.jpg',
      //       path: 'src/v1/public/images/logo.png',
      //       cid: 'logo', //same cid value as in the html img src
      //    },
      // ],
      html: `
         <body style='padding: 0; margin: 0;'>
            <div
               className='root'
               style="
                        background-color: #41c375;
                        min-height: 80vh;
                        min-width: 76vw;
                        /*font-family: 'Readex Pro', sans-serif;*/
                        font-family: 'Montserrat', sans-serif;
                  ">
               <div
                  className='main'
                  style='padding-left: 20px; padding-right: 20px; padding-top: 100px; padding-bottom: 100px;'>
                  <div
                     className='container'
                     style='
                           max-width: 500px;
                           max-height: 500px;
                           background-color: #fff9ea;
                           border-radius: 12px;
                           padding: 20px;
                           text-align: center;
                           margin-left: auto;
                           margin-right: auto;
                           '>
                     <div
                        className='logo'
                        style='
                                    margin: 0 auto;
                                    margin-bottom: 10px;
                              '>
<!--                        <img src='cid:logo' alt='logo' className='img__logo' />-->
                              <p style='color: #1b1b1b; font-size: 1.4rem; font-weight: 700;'>Lemon Code 🍋</p>
                     </div>
                     <h2
                        className='title'
                        style='
                                    font-size: 1.8rem;
                                    font-weight: 700;
                                    color: #1b1b1b;
                                    margin-bottom: 20px;
                              '>
                        Hoàn tất quá trình đăng ký
                     </h2>
                     <div
                        className='line'
                        style='
                                    width: 100%;
                                    height: 1px;
                                    background-color: #1b1b1b;
                                    margin-bottom: 20px;
                           '></div>
                     <div className='content' style='margin: 40px 0'>
                        <h5
                           className='welcome'
                           style='
                                       font-size: 1.2rem;
                                       font-weight: 400;
                                       color: #1b1b1b;
                                       margin-bottom: 20px;
                                    '>
                           Xin chào bạn,
                        </h5>
                        <p
                           className='description'
                           style='
                                       font-size: 1rem;
                                       font-weight: 400;
                                       color: #1b1b1b;
                                       margin-bottom: 20px;
                                    '>
                           Đây là mã OTP của bạn:
                           <span
                              className='otp'
                              style='
                                          font-size: 1.2rem;
                                          font-weight: 700;
                                          color: #1b1b1b;
                                          margin-bottom: 20px;
                                       '>
                              ${captchaCode}
                           </span>
                           . Vui lòng nhập mã này để hoàn tất quá trình đăng ký.
                        </p>
                        <div className='button' style='margin-top: 40px'>
                           <a
                              href='http://localhost:5000/api/auth/handleCaptcha/${captchaCode}'
                              className='btn'
                              style='
                                          padding: 10px 20px;
                                          background-color: #0aadff;
                                          border: none;
                                          border-radius: 5px;
                                          font-size: 1rem;
                                          font-weight: 700;
                                          text-decoration: none;
                                          color: #fff;
                                          cursor: pointer;
                                       '>
                              Chuyển đến trang xác nhận
                           </a>
                        </div>
                     </div>
                     <div
                        className='line'
                        style='
                                    width: 100%;
                                    height: 1px;
                                    background-color: #1b1b1b;
                                    margin-bottom: 20px;
                              '></div>
                     <p
                        className='footer'
                        style='
                                    font-size: 0.8rem;
                                    font-weight: 400;
                                    color: #1b1b1b;
                                    margin-top: 20px;
                              '>
                        Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email
                        này. Mã OTP sẽ hết hạn sau 15 phút.
                     </p>
                  </div>
               </div>
            </div>
         </body>`,
   };

   let message = '';

   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
         console.log('Lỗi khi gửi email:', error);
         message = `Lỗi khi gửi email: ${error}`;
      } else {
         console.log('Email gửi thành công:', info.response);
         message = `Email gửi thành công: ${info.response}`;
      }
   });
};

const isCaptchaExpired = (expirationTime) => {
   // Kiểm tra xem thời gian CAPTCHA có hết hạn hay chưa
   console.log(new Date());
   console.log(new Date(expirationTime));
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
   sendCaptchaEmail,
   isCaptchaExpired,
};
