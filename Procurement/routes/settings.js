var express = require('express');
var router = express.Router();
var auth = require('../auth')
var axios = require('axios');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var Api = require('../config.js');
var db = require('../DBConnection/db');
var apiname ;
if(db.mongo.isdefault == 'true'){
    apiname = 'm-schema';
}
else if(db.rethink.isdefault == 'true') {
    apiname = 'r-schema';
}
// var dbapi = require('../routes/DBConnection');


router.get('/', auth(), function(req, res) {
            // console.log('inside settings')

    axios.get(Api.featherApiUrl+'schema')
        .then(function(response) {
            var results = response.data.data
            // console.log(results)
            res.render('settings/settings', { title: 'Settings', data: results})
        })
        .catch(function(error) {
            console.log(error)
            res.redirect('/')
        })
});

module.exports = router;

// axios.get(Api.localhost + 'api/schema')
//         .then(function(response) {
//             var results = response.data
//             // console.log(results)
//             res.render('settings/settings', { title: 'Settings', data: results})
//         })
//         .catch(function(error) {
//             console.log(error)
//             res.redirect('/')
//         })