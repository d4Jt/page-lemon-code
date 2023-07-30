const postModel = require('../../models/post.model');

const findByIdPost = (pid) => {
    return postModel.findById(pid);
}  

module.exports = {
    findByIdPost,
}