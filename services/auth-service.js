const AuthModel = require("../model/auth-model");

class AuthService {
    static async login(reqBody) {
        const user = AuthModel.fromRequest(reqBody);
        console.log('Login attempt:', user.toJSON());

        // contoh hardcoded auth
        if (user.email === 'admin' && user.password === '123') {
            return { token: 'fake-jwt-token' };
        } else {
            throw new Error('Invalid email or password');
        }
    }
}

module.exports = AuthService;