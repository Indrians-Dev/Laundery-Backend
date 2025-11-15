// const express = require('express');
// const router = express.Router();
// const AuthService = require('../services/auth-service');
// const { validateLogin } = require('../middlewares/validation');

// // POST /auth/login
// router.post('/login', async (req, res) => {
//     try {
//         const { error } = validateLogin(req.body);
//         if (error) return res.status(400).json({ error: error.details[0].message });
//         const result = await AuthService.login(req.body);
//         res.json(result);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });




// module.exports = router;

const { register, login, verifyOtp, resendOtp, forgotPassword, resetPassword, getServices } = require('../services/auth-service');

const regist = async (req, res, next) => {
    try {    
        const result = await register(req.body);
        res.status(201).json({ 
            success: true,
            message: 'Registration successful. Please check your email for OTP verification.',
            data: result
        });
    } catch (e) {
        console.log('error:', e);
        next(e);
    }
};

const verifikasiOtpController = async (req, res, next) => {
    try {
        const result = await verifyOtp(req.body);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

const resendOtpController = async (req, res, next) => {
    try {
        const result = await resendOtp(req.body);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const result = await login(req.body);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const forgotPasswordController = async (req, res, next) => {
    try {
        const result = await forgotPassword(req.body);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

const resetPasswordController = async (req, res, next) => {
    try {
        const result = await resetPassword(req.body);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
};

const getController = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            data: {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            }
        });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    regist,
    loginUser,
    verifikasiOtpController,
    resendOtpController,
    forgotPasswordController,
    resetPasswordController,
    getController,
};