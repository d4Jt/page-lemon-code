const jwt = require('jsonwebtoken');
const {TokenExpiredError} = require('jsonwebtoken');
const {notAuth} = require('./handle_error');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if(!authHeader) return notAuth('Access token is required', res);
    if (!authHeader.startsWith("Bearer")) return notAuth('Access token invalid', res);
    const accessToken = authHeader.split(' ')[1];

    jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN, (err, user) => {
        if(err){
            const isChecked = err instanceof TokenExpiredError
            if(!isChecked) return notAuth('Access token invalid', res, isChecked);
            if(isChecked) return notAuth('Access token expired', res, isChecked);
        }

        req.user = user
        console.log(user);
        next();
    })

};

module.exports = verifyToken
