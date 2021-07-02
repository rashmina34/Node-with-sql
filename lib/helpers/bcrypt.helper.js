const bcrypt = require('bcrypt');

exports.generateSalt = (salt) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(salt, (err, salted_val) => {
            if (err) reject(err);
            resolve(salted_val);
        });
    });

};

exports.hashPwd = (value, saltStr) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(value, saltStr, (err, hashValue) => {
            if (err) {
                reject(err);
            }
            resolve(hashValue);
        });
    });
}

//Comparing password
exports.comparePwd = (reqPwd, hashPwd) => {//Promise object
    return new Promise((resolve, reject) => {

        bcrypt.compare(reqPwd, hashPwd, (err, match) => {
            if (err) reject(err);

            resolve(match);

        });
    });
}

