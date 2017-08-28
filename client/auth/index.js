var session = require('express-session');
const onlyAdmin = ['/schema','/approval','/Report','/emailTemplate'];

function authenticationMiddleware() {
  return function (req, res, next) {
    console.log('req.session.login_token',req.session.login_token)
    if (req.session.login_token) {
      console.log('===========================================');
      console.log('Request baseUrl:', req.baseUrl)
      console.log('Request originalUrl:', req.originalUrl)
      console.log('===========================================');

      if(req.session.userdetails.role){
        if(req.session.userdetails.role != 'admin' && onlyAdmin.indexOf(req.baseUrl) != -1){
          res.redirect('/');
        } else{
          return next();
        }
      } else{
        return next();
      }
    }
    res.redirect('/auth/login');
  }
}

module.exports = authenticationMiddleware
