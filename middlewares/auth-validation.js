const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().min(3).required().messages({
        'string.empty': 'Email wajib diisi',
        'string.min': 'Email minimal 3 karakter',
    }),
    password: Joi.string().min(4).required().messages({
        'string.empty': 'Password wajib diisi',
        'string.min': 'Password minimal 4 karakter',
    }),
});

function validateLogin(data) {
    const { error } = loginSchema.validate(data, { abortEarly: false });
    if (!error) return null;
    return error.details.map(e => e.message);
}

module.exports = { validateLogin };
