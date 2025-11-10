const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).max(100).required(), 
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match password'
    }),
    email: Joi.string().email().required(),
    nohp: Joi.number().optional() 
});

const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
});

const loginSchema = Joi.object({
    username: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).max(100).required()
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    new_password: Joi.string().min(6).max(100).required(),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
});

const getSchema = Joi.string().max(100).required();

const validate = (schema, request) => {
    const result = schema.validate(request, { abortEarly: false, allowUnknown: false });
    if (result.error) {
        throw result.error;
    } else {
        return result.value;
    }
};

module.exports = {
    registerSchema,
    loginSchema,
    validate,
    verifyOtpSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    getSchema
};