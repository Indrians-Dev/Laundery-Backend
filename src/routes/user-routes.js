const express = require('express');
const userRouter = express.Router();
const { 
    regist, 
    loginUser, 
    verifikasiOtpController, 
    resendOtpController,
    forgotPasswordController,
    resetPasswordController
} = require('../controllers/auth-controller'); 

userRouter.post('/register', regist);
userRouter.post('/verify-otp', verifikasiOtpController);
userRouter.post('/resend-otp', resendOtpController);
userRouter.post('/forgot-password', forgotPasswordController);
userRouter.post('/reset-password', resetPasswordController);
userRouter.post('/login', loginUser);

module.exports = userRouter;

