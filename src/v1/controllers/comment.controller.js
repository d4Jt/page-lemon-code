const commentService = require('../services/comment.service');

const createComment =async (req, res) =>{
    const fileData = req.file;
    const comment = await commentService.createComment(req.body,req.user.id,fileData);
    res.json(comment);
}

const updateComment = async (req, res) =>{
    const comment = await commentService.updateComment(req.body);
    res.status(200).json(comment);
};

const softDeleteComment = async (req, res) =>{
    const comment = await commentService.softDeleteComment(req.body.cid);
    res.status(200).json(comment);
}

const getComment = async (req, res) =>{
    const comment = await commentService.getComment(req.query);
    res.status(200).json(comment);
}

const getAllComment = async (req, res) =>{
    const comment = await commentService.getAllComment();
    res.status(200).json(comment);
}

const deleteComment = async (req, res) =>{
    const comment = await commentService.deleteComment(req.body.cid);
    res.status(200).json(comment);
};

module.exports = {
    createComment,
    updateComment,
    softDeleteComment,
    getComment,
    getAllComment,
    deleteComment
}