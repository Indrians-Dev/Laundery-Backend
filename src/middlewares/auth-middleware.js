const prisma = require("../config/db");
const jwt = require('jsonwebtoken');


const authMiddleware = async(req,res,next)=>{
    const autHeaders = req.get('authorization');
    const token = autHeaders && autHeaders.split(' ')[1];
    if(!token){
         return res.status(err.status).json({
            success: false,
            errors: err.message
        });
    }
}

module.exports = authMiddleware;
