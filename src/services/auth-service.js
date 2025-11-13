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

const { registerSchema, validate, loginSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema, getSchema } = require('../validation/validation');
const prisma = require('../config/db');
const { ResponseError } = require('../errors/response-error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT Token
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT Token
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

const register = async (request) => {
    const userData = validate(registerSchema, request);
    console.log('validasi:', userData);

    
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: userData.username },
                { email: userData.email }
            ]
        },
        select:{
            username : true,
            email : true
        }
    });

    if (existingUser) {
        throw new ResponseError(400, "Username or email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    // const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

    //Setup email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userData.email,
        subject: 'Verification OTP - Laundry App',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Verification Code</h2>
                <p>Your OTP code for verification:</p>
                <h1 style="background: #f4f4f4; padding: 20px; text-align: center; letter-spacing: 5px; font-size: 24px;">
                    ${otpCode}
                </h1>
                <p>This code will expire in 1 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        // Kirim email
        await transporter.sendMail(mailOptions);

        // Simpan ke database
        const newUser = await prisma.user.create({
            data: {
                username: userData.username,
                password: hashedPassword,
                email: userData.email,
                nohp: userData.nohp,
                otp: otpCode,
                otp_expiry: otpExpiry,
                is_verified: false
            },
            select: {
                user_id: true,
                username: true,
                email: true,
            }
        });

        return newUser;

    } catch (emailError) {
        throw new ResponseError(500, "Failed to send OTP");
    }
};

const verifyOtp = async (request) => {
    const otpData = validate(verifyOtpSchema, request);

    const user = await prisma.user.findUnique({
        where: {
            email: otpData.email
        }
    });

    if (!user) {
        throw new ResponseError(404, 'User not found');
    }

    if (user.is_verified) {
        throw new ResponseError(400, 'User already verified');
    }

    if (user.otp !== otpData.otp) {
        throw new ResponseError(401, 'Invalid OTP code');
    }

    const now = new Date();
    if (now > user.otp_expiry) {
        throw new ResponseError(401, 'OTP has expired');
    }

    const verifiedUser = await prisma.user.update({
        where: {
            user_id: user.user_id
        },
        data: {
            is_verified: true,
            otp: null,
            otp_expiry: null
        },
        select: {
            user_id: true,
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
    const { email } = validate(verifyOtpSchema, request);

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
    const loginData = validate(loginSchema, request);

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: loginData.username },
                { email: loginData.username }
            ]
        }
    });

    if (!user) {
        throw new ResponseError(400, "Username or password is wrong");
    }

    if (!user.is_verified) {
        throw new ResponseError(400, "Please verify your email first");
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(400, "Username or password is wrong");
    }

    // Generate JWT Token
    const token = generateToken({
        user_id: user.user_id,
        username: user.username,
        email: user.email
    });

    // Update token user
    await prisma.user.update({
        where: {
            user_id: user.user_id
        },
        data: {
            token: token
        }
    });

    return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        token: token
    };
};

const forgotPassword = async (request) => {
    const { email } = validate(forgotPasswordSchema, request);

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new ResponseError(404, 'User not found');
    }

    // Generate reset token
    const resetToken = jwt.sign(
        { user_id: user.user_id, type: 'password_reset' },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); 

    await prisma.user.update({
        where: { user_id: user.user_id },
        data: {
            reset_token: resetToken,
            reset_token_expiry: resetTokenExpiry
        }
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request - Laundry App',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset</h2>
                <p>You requested to reset your password. Click the link below to reset your password:</p>
                <a href="${resetLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Reset Password
                </a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            success: true,
            message: 'Password reset link sent to your email'
        };
    } catch (emailError) {
        console.error('Email error:', emailError);
        throw new ResponseError(500, "Failed to send reset email");
    }
};

const resetPassword = async (request) => {
    const { token, new_password } = validate(resetPasswordSchema, request);

    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (error) {
        throw new ResponseError(401, 'Invalid or expired reset token');
    }

    if (decoded.type !== 'password_reset') {
        throw new ResponseError(401, 'Invalid token type');
    }

    const user = await prisma.user.findFirst({
        where: {
            reset_token: token,
            reset_token_expiry: {
                gt: new Date()
            }
        }
    });

    if (!user) {
        throw new ResponseError(401, 'Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await prisma.user.update({
        where: { user_id: user.user_id },
        data: {
            password: hashedPassword,
            reset_token: null,
            reset_token_expiry: null,
            token: null // Invalidate all existing sessions
        }
    });

    return {
        success: true,
        message: 'Password reset successfully'
    };
};

const getServices = async (username) => {
    const getUser = validate(getSchema, username);

    const user = await prisma.user.findFirst({
        where: {
            username: getUser
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return user;
};

module.exports = {
    register,
    login,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    getServices,
    verifyToken
};