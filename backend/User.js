var bcrypt   = require('bcrypt-nodejs');

class User {
    constructor(email, password) {
        this.email = email;
        this._passwordHash = _generateHash(password);
    }

    _generateHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    isPasswordValid(password) {
        return bcrypt.compareSync(password, this._passwordHash);
    }

}

module.exports = User;