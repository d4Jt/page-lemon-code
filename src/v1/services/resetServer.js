const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const commentModel = require('../models/comment.model');

const resetPost = () => new Promise(async (resolve, reject) => {
    try {
        const post = await postModel.delete();
    } catch (error) {
        reject(error);
    }
});