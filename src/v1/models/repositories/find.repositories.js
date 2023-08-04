const postModel = require('../post.model');
const commentModel = require('../comment.model');

const findByIdPost = (pid) => {
   return postModel.findById(pid);
};

const findByIdComment = (cid) => {
   return commentModel.findById(cid);
};

module.exports = {
   findByIdPost,
   findByIdComment,
};
