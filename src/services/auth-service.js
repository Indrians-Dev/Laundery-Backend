// const AuthModel = require("../model/auth-model");



// class AuthService {
//     static async login(reqBody) {
//         const user = AuthModel.fromRequest(reqBody);
//         console.log('Login attempt:', user.toJSON());

//         // contoh hardcoded auth
//         if (user.email === 'admin' && user.password === '123') {
//             return { token: 'fake-jwt-token' };
//         } else {
//             throw new Error('Invalid email or password');
//         }
//     }
// }

// module.exports = AuthService;

const { registerSchema, validate, loginSchema, verifyOtpSchema, getSchema } = require('../validation/validation');
const { prisma } = require('../config/db');
const { ResponseError } = require('../errors/response-error');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
require('dotenv').config();
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')



const register = async (request) => {
    const user = validate(registerSchema, request);

    // Cek jika user sudah ada
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: user.username },
                { email: user.email }
            ]
        }
    });

    if (existingUser) {
        throw new ResponseError(400, "Username or email already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verification OTP - Laundry App',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Verification Code</h2>
                <p>Your OTP code for verification:</p>
                <h1 style="background: #f4f4f4; padding: 20px; text-align: center; letter-spacing: 5px; font-size: 24px;">
                    ${otpCode}
                </h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${user.email}`);

        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        return await prisma.user.create({
            data: {
                ...user,
                otp: otpCode,
                otp_expiry: otpExpiry,
                is_verified: false
            },
            select: {
                username: true,
                email: true,
            }
        });

    } catch (emailError) {
        console.error('Email error:', emailError);
        throw new ResponseError(500, "Failed to send OTP");
    }
};

const verifyOtp = async (request) => {
    const otpIn = validate (verifyOtpSchema, request);
    console.log(otpIn)

    const otpUser = await prisma.user.findUnique({
        where : {
            email : otpIn.email
        },
        select :{
            user_id  : true,
            username: true,
            email: true,
            otp:true
        }
    });
    console.log(otpUser);

      // User tidak ditemukan
    if (!otpUser) {
        throw new ResponseError(404, 'User not found');
    }

    // User sudah terverifikasi
    if (otpUser.is_verified) {
        throw new ResponseError(400, 'User already verified');
    }

    // OTP salah
    if (otpUser.otp !== otpIn.otp) {
        throw new ResponseError(401, 'Invalid OTP code');
    }

    // OTP expired
    const now = new Date();
    if (now > otpUser.otp_expiry) {
        throw new ResponseError(401, 'OTP has expired');
    }

    
    const verifiedUser = await prisma.user.update({
        where: {
            user_id: otpUser.user_id
        },
        data: {
            is_verified: true,
            otp: null,
            otp_expiry: null
        },
        select: {
            username: true,
            email: true,
            is_verified: true
        }
    });

    return {
        success: true,
        message: 'Account verified successfully',
        user: verifiedUser
    };
};

    

const resendOtp = async (request) => {
    const email = validate(verifyOtpSchema, request);

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if (!user) {
        throw new ResponseError(404, 'User not found');
    }

    if (user.is_verified) {
        throw new ResponseError(400, 'User already verified');
    }

    // Generate OTP baru
    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'New Verification OTP - Laundry App',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Verification Code</h2>
                <p>Your new OTP code for verification:</p>
                <h1 style="background: #f4f4f4; padding: 20px; text-align: center; letter-spacing: 5px; font-size: 24px;">
                    ${newOtpCode}
                </h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log(`New OTP sent to ${user.email}`);

        await prisma.user.update({
            where: {
                user_id: user.user_id
            },
            data: {
                otp: newOtpCode,
                otp_expiry: newOtpExpiry
            }
        });

        return {
            success: true,
            message: 'New OTP sent successfully',
            email: user.email
        };

    } catch (emailError) {
        console.error('Email error:', emailError);
        throw new ResponseError(500, "Failed to send new OTP");
    }
};


const login = async (request) => {
    const loginValidation = validate(loginSchema, request);

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: loginValidation.username },
                { email: loginValidation.username }
            ]
        },
        select: {
            username: true,
            email: true,
        }
    });

    if (!user) {
        throw new ResponseError(400, "Username or password is wrong");
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(loginValidation.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(400, "Username or password is wrong");
    }

    // Generate token
    const token = uuidv4();

    // Update token user
    return await prisma.user.update({
        where: {
            user_id: user.user_id
        },
        data: {
            token: token
        },
        select: {
            user_id: true,
            username: true,
            email: true,
            token: true
        }
    });

};


const getServices = async(username)=>{
    const getUser = validate(getSchema,username);

    const user = await prisma.user.findFirst({
        where : {
            username : getUser.username
        }
    })

    if(!user){
        throw new ResponseError(404, "Error Not Found");
    }

    return user;
}

module.exports = {
    register,
    login,
    verifyOtp,
    resendOtp,
    getServices
};