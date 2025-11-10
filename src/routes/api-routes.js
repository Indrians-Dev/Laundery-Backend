const express = require('express');
const apiRouter = express.Router();
const { getController } = require('../controllers/auth-controller'); 
const authMiddleware = require('../middlewares/auth-middleware');

apiRouter.use(authMiddleware);
apiRouter.get('/dashboard', getController);

module.exports = apiRouter;