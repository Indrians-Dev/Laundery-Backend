const express = require('express');
const userRouter = express.Router();
const { regist,loginUser, verifikasiOtpController, resendOtpController } = require('../controllers/auth-controller'); 

userRouter.post('/register', regist);
userRouter.post('/verify-otp', verifikasiOtpController);
userRouter.post('/resend-otp', resendOtpController);
userRouter.post('/login',loginUser)

module.exports = userRouter; 



