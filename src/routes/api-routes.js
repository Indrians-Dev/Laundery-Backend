const express = require('express');
const apiRouter = express.Router();
const { getController } = require('../controllers/auth-controller'); 
const authMiddleware = require('../middlewares/auth-middleware');
const app = express();

app.use(authMiddleware)
apiRouter.get('/dashboard', getController);

module.exports = apiRouter;