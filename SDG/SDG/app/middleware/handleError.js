const createError = require('http-errors');
module.exports = app => {
    app.use((req, res, next) => next(createError(404)));
    app.use((err, req, res, next) => {
        let status = err.status || 500;
        let errCode = 'error';
        if (status === 404) {
            errCode = '404';
        }
        if (status == 500) {
            errCode = '500';
        }
        let errMessage = err.message;
        res.render('error');
    })
}