const express = require('express');
const bodyParser = require('body-parser');
const session = require('cookie-session')
const userRouter = require('./src/routes/user-routes');
const apiRouter = require('./src/routes/api-routes');
const { errorMiddleware } = require('./src/middlewares/error-middleware');
const logger = require('./src/config/logger');
const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Laundery API Server is running!',
    endpoints: {
      register: 'POST /api/auth/register',
      login : 'POST /api/auth/login',
      documentation: 'Coming soon...'
    }
  });
});

// Routes
app.use('/api/auth', userRouter);

app.use('/',apiRouter);

// Error middleware
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
    logger.info;
});