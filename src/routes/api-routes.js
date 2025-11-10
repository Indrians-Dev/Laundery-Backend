const express = require('express');
const apiRouter = express.Router();
var cookieParser = require('cookie-parser')
const { getController } = require('../controllers/auth-controller'); 
const authMiddleware = require('../middlewares/auth-middleware');
const app = express();

app.use(cookieParser())
app.use(authMiddleware)
apiRouter.get('/dashboard', getController);

module.exports = apiRouter;