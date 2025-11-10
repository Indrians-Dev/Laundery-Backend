const { ResponseError } = require('../errors/response-error');
const { verifyToken } = require('../services/auth-service');

const authMiddleware = async (req, res, next) => {
    console.log("request :" + req)
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ResponseError(401, 'Access token required');
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            throw new ResponseError(401, 'Access token required');
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                errors: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                errors: 'Token expired'
            });
        }

        next(error);
    }
};

module.exports = authMiddleware;