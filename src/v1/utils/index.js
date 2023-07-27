'use strict';
const _ = require('lodash');
const { Types, Schema } = require('mongoose');

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
};
