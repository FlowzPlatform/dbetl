let express = require('express');
let router = express.Router();
let axios = require('axios');
let auth = require('../auth');
let config = require('../config.js')
let async = require('asyncawait/async');
let await = require('asyncawait/await');
// let _ = require('lodash');
// let Handlebars = require('handlebars');

router.get('/:id', auth(), async(function(req, res) {
    let result = await (axios.get(config.featherApiUrl+'instance'));
    let schema = await (axios.get(config.featherApiUrl+'schema'));
    var data = result.data;
    var instancelist = [];
    data.forEach(function(element, index){
        if(element.Schemaid == req.params.id){
            instancelist.push(element);
        }
        // var flowInstance_title = await (axios.get(config.localhost + 'api/schema/'+(element.Schemaid)));
    })
    // console.log("data from flowsInstance.js",data);
    // console.log('instancelist  from flowsInstance.js',instancelist);
    res.render('flow-instance/list', { title: 'FlowInstance - list', data: schema.data ,data1:instancelist })
}));

router.get('/edit/:id', auth(), async(function(req, res) {
    let schema = await (axios.get(config.featherApiUrl+'schema'));
    let instance = await (axios.get(config.featherApiUrl+'instance/'+req.params.id));
    // console.log('instance',instance);
    res.render('flow-instance/new', { title: 'FlowInstance - Edit', data: schema.data, id1: req.params.id , currentdata:instance.data});
}));

module.exports = router;

// router.get('/:id', auth(), async(function(req, res) {
//     let result = await (axios.get(config.localhost + 'api/flowsInstance/'));
//     let schema = await (axios.get(config.localhost + 'api/schema/'));
//     var data = result.data;
//     var instancelist = [];
//     data.forEach(function(element, index){
//         if(element.Schemaid == req.params.id){
//             instancelist.push(element);
//         }
//         var flowInstance_title = await (axios.get(config.localhost + 'api/schema/'+(element.Schemaid)));
//     })
//     // console.log("data from flowsInstance.js",data);
//     // console.log('instancelist  from flowsInstance.js',instancelist);
//     res.render('flow-instance/list', { title: 'FlowInstance - list', data: schema.data ,data1:instancelist })
// }));

// router.get('/edit/:id', auth(), async(function(req, res) {
//     let schema = await (axios.get(config.localhost + 'api/schema/'));
//     let instance = await (axios.get(config.localhost + 'api/flowsInstance/' + req.params.id));
//     // console.log('instance',instance);
//     res.render('flow-instance/new', { title: 'FlowInstance - Edit', data: schema.data, id1: req.params.id , currentdata:instance.data[0]});
// }));