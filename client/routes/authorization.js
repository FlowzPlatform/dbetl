var express = require('express');
var router = express.Router();
var axios = require('axios');
var session = require('express-session');
var Api = require('../config.js');

router.get('/login', function (req, res) {
  res.render('authorization/login', { title: 'Login' });
});


router.get('/signin', function (req, res) {
  var token = req.query.token
  if (token) {
    req.session.login_token = token;
    req.session.userdetails = { role: 'admin', fullname: 'Administrator' };
    res.redirect('/')
  }
  var id = req.query.ob_id
  if (id) {
    res.render('authorization/socialAuth', { title: 'Login', id: id })
  }
});

router.post('/signin', function (req, res) {
  let object = { "email": req.body.email, "id": req.body.id }
  axios.post('http://ec2-54-88-11-110.compute-1.amazonaws.com/api/googleauthprocess', object)
    .then(function (result) {
      req.session.login_token = result.logintoken;
      req.session.userdetails = { role: 'admin', fullname: 'Administrator' };
      res.redirect('/');
    })
    .catch(function (error) {
      console.log('error', error)
    })
});

router.post('/login', function (req, res) {
    if (req.body.email == "admin@admin.com" && req.body.password == "admin") {
      req.session.login_token = "abcdefg";
      // req.session.login_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OTZkOTBlYTk3YWM0NzAwMWQyMzNlYjciLCJpYXQiOjE1MDM1ODEyNzAsImV4cCI6MTUwMzU4NDkwMCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIn0.a0cqC_QFbpDgc3SRI88KZRVWj51wHbBchOb1V2S4YsU";
      req.session.userdetails = { fullname: "Administrator", email: req.body.email, password: req.body.password, role: "admin" };
      res.redirect('/');
    } else {
      req.flash('errors', [{ msg: 'Username and password is not valid.' }]);
      res.redirect('/');
    }
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) { res.redirect('/') });
});

module.exports = router;
