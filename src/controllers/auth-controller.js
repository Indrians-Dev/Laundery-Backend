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

const { register,login, verifyOtp, resendOtp, getServices } = require('../services/auth-service');

const regist = async (req, res, next) => {
 
    try {
        const result = await register(req.body);
        res.status(201).json({ 
            success: true,
            message: 'Registration successful. Please check your email for OTP verification.',
            data: result
        });
    } catch (e) {
        next(e);
    }
};


const verifikasiOtpController = async (req,res,next) =>{
    try{
        const result = await verifyOtp(req.body);
        res.status(202).json(result);

    }catch(e){
        next(e);
    }
}

const resendOtpController = async (req,res,next)=>{
    try {
        const result = await resendOtp(req.body);
        res.status(201).json(result);
    } catch (e) {
    next(e); 
    }
}




const loginUser = async (req,res,next)=>{
    try {
        const result = await login (req.body);
        console.log(result);
        res.status(200).json({
            success:true,
            data:result
        });
    } catch (e) {
        next(e)
    }
}

const getController = async (req,res,next)=>{
    console.log(req)
}


module.exports = {
    regist,
    loginUser,
    verifikasiOtpController,
    resendOtpController,
    getController,
};



