// const Joi = require('joi');

// const loginSchema = Joi.object({
//     // user_id : joi.string().min(3).max(200).required().message({
        
//     // }),
//     email: Joi.string().min(3).required().messages({
//         'string.empty': 'Email wajib diisi',
//         'string.min': 'Email minimal 3 karakter',
//     }),
//     password: Joi.string().min(4).required().messages({
//         'string.empty': 'Password wajib diisi',
//         'string.min': 'Password minimal 4 karakter',
//     }),
//     // handphone: Joi.number().max(12).required().message(),

// });

// function validateLogin(data) {
//     const { error } = loginSchema.validate(data, { abortEarly: false });
//     if (!error) return null;
//     return error.details.map(e => e.message);
// }

// module.exports = { validateLogin };

const { ResponseError } = require('../errors/response-error');

const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err);

    if (err instanceof ResponseError) {
        return res.status(err.status).json({
            success: false,
            errors: err.message
        });
    } else if (err.isJoi) {
        return res.status(400).json({
            success: false,
            errors: err.details.map(detail => detail.message).join(', ')
        });
    } else if (err.code === 'P2002') {
        return res.status(400).json({
            success: false,
            errors: 'Unique constraint violation'
        });
    } else {
        return res.status(500).json({
            success: false,
            errors: 'Internal server error'
        });
    }
};

module.exports = {
    errorMiddleware
};

