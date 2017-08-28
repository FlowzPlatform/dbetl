var express = require('express');
var router = express.Router();
var auth = require('../auth')
var axios = require('axios');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var Api = require('../config.js');
// var dbapi = require('../routes/DBConnection');


router.get('/', auth(), function (req, res) {
  // axios.get(Api.localhost + 'api/schema')
  axios.get(Api.featherApiUrl + 'schema')
    .then(function (response) {
      var results = response.data
        // console.log(results)
      res.render('schema/list', { title: 'Schema', data: results })
    })
    .catch(function (error) {
      console.log(error)
      res.redirect('/')
    })
});

router.get('/new', auth(), function (req, res) {
  axios.get(Api.featherApiUrl + 'schema')
    .then(function (response) {
      var results = response.data
        // console.log(results)
      res.render('schema/new', { title: 'Schema - New', data: results });
    })
    .catch(function (error) {
      console.log(error)
      res.redirect('/')
    })
});

router.get('/edit/:id', auth(), function (req, res) {
  axios.get(Api.featherApiUrl + 'schema')
    .then(function (response) {
      var results = response.data
        // console.log('results from /edit/:id',results)
      res.render('schema/new', { title: 'Schema - New', data: results, id: req.params.id });
    })
    .catch(function (error) {
      console.log(error)
      res.redirect('/')
    })
});

router.get('/:id/new', auth(), async(function (req, res) {
  let schema = await (axios.get(Api.featherApiUrl + 'schema/' + req.params.id))
  let allschema = await (axios.get(Api.featherApiUrl + 'schema'))

  schema.data.entity.forEach(function (e, i) {
    if (!(e.type == 'number' || e.type == 'boolean' || e.type == 'date' || e.type == 'text' || e.type == 'email' || e.type == 'phone' || e.type == 'array')) {
      let entity = await (axios.get(Api.featherApiUrl + 'schema/' + e.type))
      entity.data = getChildEntity(entity.data)
      schema.data.entity[i]['entity'] = entity.data
    }
  }, this);
  res.render('flow-instance/new', { title: 'Flow - New', data: allschema.data, currentdata: schema.data });
}));

getChildEntity = function (schema) {
  schema.entity.forEach(function (e, i) {
    // console.log('schema', schema)
    if (!(e.type == 'number' || e.type == 'boolean' || e.type == 'date' || e.type == 'text' || e.type == 'email' || e.type == 'phone' || e.type == 'array')) {
      let entity = await (axios.get(Api.featherApiUrl + 'schema/' + e.type))
        //console.log('entity', entity.data[0])
      schema.entity[i]['entity'] = getChildEntity(entity.data)
    }
  }, this);
  return schema;
}

module.exports = router;

// router.get('/', auth(), async(function(req, res) {
//     // axios.get(Api.featherApiUrl + 'schema')
//     //     .then(function(response) {
//     //         var results = response.data.data
//     //         console.log(results)
//     //         res.render('schema/list', { title: 'Schema', data: results, isPopup: req.query.isPopup == undefined ? false : req.query.isPopup })
//     //     })
//     //     .catch(function(error) {
//     //         console.log(error)
//     //         res.redirect('/')
//     //     })
//             var results = await (dbapi.getSchema());
//             res.render('schema/list', { title: 'Schema', data: results, isPopup: req.query.isPopup == undefined ? false : req.query.isPopup })

// }));

// router.get('/new', auth(), async(function(req, res) {
//             var results = await (dbapi.getSchema());
//             res.render('schema/new', { title: 'Schema - New', data: results,isPopup: req.query.isPopup == undefined ? false : req.query.isPopup });
// }));

// router.get('/edit/:id', auth(), async(function(req, res) {
//             var results = await (dbapi.getSchema());
//             res.render('schema/new', { title: 'Schema - New', data: results,id: req.params.id,isPopup: req.query.isPopup == undefined ? false : req.query.isPopup });
// }));

// router.get('/:id/new', auth(), async(function(req, res) {
//     var id = req.params.id;
//     var schema = await (dbapi.getThisSchema(id));
//     // console.log('schema', schema);

//     // let schema = await (axios.get(Api.featherApiUrl + 'schema/' + req.params.id))
//     var allschema = await (dbapi.getSchema());
//     // console.log('allschema', allschema);

//     res.render('flow-instance/new', { title: 'Flow - New', data: allschema, currentdata: schema[0] });
// }));
