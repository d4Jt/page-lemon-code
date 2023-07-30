const postService = require( '../services/post.service');

const createPost =async (req, res) =>{
    const post = await postService.createPost(req.body,req.user.id);
    res.json(post);
}

const updatePost = async (req, res) =>{
    const post = await postService.updatePost(req.body);
    res.status(200).json(post);
};

const softDeletePost = async (req, res) =>{
    const post = await postService.softDeletePost(req.body.pid);
    res.status(200).json(post);
}

const getPosts = async (req, res) =>{
    const post = await postService.getPosts(req.query);
    res.status(200).json(post);
}

module.exports = {
    createPost,
    updatePost,
    softDeletePost,
    getPosts,
}
