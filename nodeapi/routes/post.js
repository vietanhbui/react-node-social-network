const {
    getPosts,
    createPost,
    postsByUser,
    postById,
    isPoster,
    deletePost,
    updatePost,
    photo,
    singlePost,
    like,
    unlike,
    comment,
    uncomment
} = require('../controllers/post');
const express = require('express');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const router = express.Router();
const { createPostValidator } = require('../validator');

router.get('/posts', getPosts);

// like unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

// comment uncomment
router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);

router.post(
    '/post/new/:userId',
    requireSignin,
    createPost,
    createPostValidator
);
router.get('/post/:postId', singlePost);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

// photo
router.get('/post/photo/:postId', photo);

// any route containing: userId, our app will first execute userById()
router.param('userId', userById);

// any route containing: postId, our app will first execute postById()
router.param('postId', postById);
module.exports = router;
