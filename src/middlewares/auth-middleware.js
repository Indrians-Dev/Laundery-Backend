const prisma = require("../config/db");


const authMiddleware = async(req,res,next)=>{
    console.log(req);
}

module.exports = authMiddleware;
