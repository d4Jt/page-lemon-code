const createError = require('http-errors');

const babRequest = (err,res) =>{
    const error = createError.BadRequest(err);
    return res.status(error.status).json({
        err: 1,
        mes: error.message
    });
}

const internalServerError = (res) =>{
    const error = createError.InternalServerError();
    return res.status(error.status).json({
        err: 1,
        mes: error.message
    });
}
 const notFound = (req, res) =>{
    const error = createError.NotFound('this is route is not defined');
    return res.status(error.status).json({
        err: 1,
        mes: error.message
    });
}

 const notAuth = (err, res, isExpired) =>{
    const error = createError.Unauthorized(err);
    return res.status(error.status).json({
        err: isExpired ? 0 : 1,
        mes: error.message
    });
}

module.exports = {
    babRequest,
    internalServerError,
    notFound,
    notAuth,
}