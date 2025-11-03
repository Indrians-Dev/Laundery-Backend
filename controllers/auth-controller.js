const express = require('express');
const router = express.Router();
const AuthService = require('../services/auth-service');
const { validateLogin } = require('../middlewares/auth-validation');

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        const result = await AuthService.login(req.body);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
