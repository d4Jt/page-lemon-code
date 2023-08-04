const { notAuth } = require('./handle_error');
const userModel = require('../models/user.model');

const isAdmin = async (req, res, next) => {
   const { id } = req.user;
   const data = await userModel.findById(id).select('role');

   if (data.role !== 'admin') return notAuth('Require role Admin', res);

   next();
};

module.exports = {
   isAdmin,
};
