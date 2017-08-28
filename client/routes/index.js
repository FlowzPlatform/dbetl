var express = require('express');
var router = express.Router();
var axios = require('axios');
var session = require('express-session');
var auth = require('../auth')
let _ = require('lodash')
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var Api = require('../config.js');
var db = require('../DBConnection/db');

// var dbapi = require('../routes/DBConnection');

/* GET home page. */
router.get('/', auth(), async(function(req, res) {
  if((db.mongo.isdefault == 'false') && (db.rethink.isdefault == 'false') && (db.elastic.isdefault == 'false')){
    res.render('settings/settings', { title: 'settings'});
  }
  else{
    // console.log(Api.featherApiUrl);
    axios.get(Api.featherApiUrl+'schema')
        .then(function(response) {
            // console.log('response',response.data)
            var results = response.data
            // console.log('data from index',results)
              res.render('index', { title: 'Schema',data:results });
              // res.render('schema/list', { title: 'Schema', data: results, isPopup: req.query.isPopup == undefined ? false : req.query.isPopup })
        })
        .catch(function(error) {
            console.log(error)
            res.redirect('/')
        })
  }
}));


// router.get('/auth/login/', function(req, res) {
//   console.log('req',req);
//   console.log('get ob_id from url');
//   res.redirect('/')
// })

module.exports = router;

	 // axios.get(Api.featherApiUrl + 'schema')
  //       .then(function(response) {
  //           // console.log(response.data)
  //           var results = response.data.data
  //           // console.log('data from index',results)
  //   		res.render('index', { title: 'Schema',data:results });
  //           // res.render('schema/list', { title: 'Schema', data: results, isPopup: req.query.isPopup == undefined ? false : req.query.isPopup })
  //       })
  //       .catch(function(error) {
  //           console.log(error)
  //           res.redirect('/')
  //       })


  // axios.get(Api.localhost + 'api/schema')
  //       .then(function(response) {
  //           // console.log('response',response.data)
  //           var results = response.data
  //           // console.log('data from index',results)
  //             res.render('index', { title: 'Schema',data:results });
  //             // res.render('schema/list', { title: 'Schema', data: results, isPopup: req.query.isPopup == undefined ? false : req.query.isPopup })
  //       })
  //       .catch(function(error) {
  //           console.log(error)
  //           res.redirect('/')
  //       })