const {
    signup,
    signin,
    signout,
    forgotPassword,
    resetPassword,
    socialLogin
} = require('../controllers/auth');
const express = require('express');
const { userById } = require('../controllers/user');
const router = express.Router();
const { userSignupValidator, passwordResetValidator } = require('../validator');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.post("/social-login", socialLogin);

router.get('/signout', signout);

// password forgot and reset routes
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', passwordResetValidator, resetPassword);

// any route containing: userId, our app will first execute userById()
router.param('userId', userById);
module.exports = router;
