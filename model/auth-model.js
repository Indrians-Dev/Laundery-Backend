class AuthModel {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    static fromRequest(reqBody) {
        const { email, password } = reqBody;
        return new AuthModel(email, password);
    }

    toJSON() {
        return {
            email: this.email,
            password: this.password,
        };
    }
}

module.exports = AuthModel;
