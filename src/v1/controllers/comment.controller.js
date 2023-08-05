const commentService = require('../services/comment.service');
const { internalServerError } = require('../middlewares/handle_error');

const createComment = async (req, res) => {
   try {
      const fileData = req.file;
      const comment = await commentService.createComment(
         req.body,
         req.user.id,
         fileData
      );
      return res.json(comment);
   } catch (err) {
      return internalServerError(res);
   }
};

const updateComment = async (req, res) => {
   try {
      const fileData = req.file;
      const comment = await commentService.updateComment(req.body,req.user.id, fileData);
      return res.status(200).json(comment);
   } catch (err) {
      return internalServerError(res);
   }
};

const softDeleteComment = async (req, res) => {
   try {
      const comment = await commentService.softDeleteComment(req.body.cid, req.user.id);
      return res.status(200).json(comment);
   } catch (err) {
      return internalServerError(res);
   }
};

const getComment = async (req, res) => {
   try {
      const comment = await commentService.getComment(req.query);
      res.status(200).json(comment);
   } catch (err) {
      const comment = await commentService.getComment(req.query);
      res.status(200).json(comment);
   }
};

const getAllComment = async (req, res) => {
   const comment = await commentService.getAllComment();
   res.status(200).json(comment);
};

const deleteComment = async (req, res) => {
   const comment = await commentService.deleteComment(req.body.cid);
   res.status(200).json(comment);
};

module.exports = {
   createComment,
   updateComment,
   softDeleteComment,
   getComment,
   getAllComment,
   deleteComment,
};
