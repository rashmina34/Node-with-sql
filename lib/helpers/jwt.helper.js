const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    let token = jwt.sign({ user }, process.env.privateKey, {
        expiresIn: '72 h',
        issuer: user.toString()
    });
    return token;

}


