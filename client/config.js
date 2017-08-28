
if (process.env.NODE_ENV == 'development')
    module.exports = require('./env.json')['development'];
else
    module.exports = require('./env.json')['production'];