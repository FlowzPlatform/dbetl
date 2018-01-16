const axios = require('axios');
console.log('process.env.domainkey', process.env.domainkey)
console.log('process.env.domainkey', 'http://auth.' + process.env.domainkey + '/api/userdetails')
var checkAuth = (authToken) => {
  return axios({
    method: 'get',
    url: 'http://auth.' + process.env.domainkey + '/api/userdetails', // 'http://ec2-54-88-11-110.compute-1.amazonaws.com/api/userdetails',
    headers: {
      'authorization': authToken
    }
  }).then(response => {
    if (response) {
      return response.data.data;
    } else {
      return
      // reject(false)
    }
  }).catch(error => {
    return
  });
};

module.exports = async(req, res, next) => {
  // req.feathers.headers = req.headers;
  var user = await checkAuth(req.headers.authorization)
  if (user) {
    // req.feathers.headers = req.headers
    req.feathers.user = user
    next();
  } else {
    res.send(401, 'invalid token...');
    return false;
  }
};
