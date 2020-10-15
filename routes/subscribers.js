const express = require('express'),
 	  router = express.Router(),
      template = require('./template'),

      passwordHash = require('password-hash'),
      dataModel = require('../models/mcp'),
      mongoose = require('mongoose'),
      csv=require('fast-csv'),
      fs = require('fs');

     const downloadCsv = require('download-csv');

     var csvWriter = require('csv-write-stream');

     var zip = require('adm-zip');
     //var json2csv = require('json2csv');
     
/* GET subscribers page */
router.get('/subscribers', function(req, res, next) {
    
var data = {addedBy: mongoose.Types.ObjectId(req.session.user._id)};

if (req.session.user.role_id.role == 'administrator') {
    dataModel.subscribers.find().populate({ path: 'addedBy' }).exec(function(err, subscribers) {

        console.log(subscribers);
            res.render(template.mcp + '/subscribers', {
            title: 'mcp | SUBSCREBERS',
            subscribers: subscribers
        });

    });
} else {

    dataModel.subscribers.find({addedBy: mongoose.Types.ObjectId(req.session.user._id)}).populate({ path: 'addedBy' }).exec(function(err, subscribers) {

        console.log(subscribers);
            res.render(template.mcp + '/subscribers', {
            title: 'mcp | SUBSCREBERS',
            subscribers: subscribers
        });

    });
}
   
});

/* POST subscribers page */
router.post('/subscribers', function(req, res, next) {
    
    var data = {
        name: req.body.name ? req.body.name : null,
        number: req.body.number ? req.body.number : null,
        email: req.body.email ? req.body.email : null,
        address: req.body.address ? req.body.address  : null,
        from: req.body.from ? req.body.from:null,
        to: req.body.to ? req.body.to : null,
        INR: req.body.INR ? req.body.INR : null,
    };
console.log(data);
    if (data.name != '' && data.number != '' && data.email != '' && data.email != '' && data.from != '' && data.to != '' && data.INR != '') {

        data.addedBy = mongoose.Types.ObjectId(req.session.user._id);

        var subscribers = new dataModel.subscribers(data);

        subscribers.save(function(err, single) {
          
            if (err) return handleError(err);
            res.redirect('/mcp/subscribers/');

        });

     } else {
     res.redirect('/mcp/subscribers/');
     }
   
});

/* POST subscribers page */
router.get('/subscribers/delete/:id?', function(req, res, next) {

    dataModel.subscribers.findOneAndRemove({
        _id: mongoose.Types.ObjectId(req.params.id)
    }, function(err, id) {
        if (err) return handleError(err);
        res.redirect('/mcp/subscribers');
    });

});

/* POST subscribers page */
router.get('/subscribers/download', function(req, res, next) {

var dat = {};
if(req.session.user.role_id.role != 'administrator'){
    dat.addedBy= mongoose.Types.ObjectId(req.session.user._id);    
}

    dataModel.subscribers.find(dat).populate({ path: 'addedBy' }).exec(function(err, subscribers) {
    
        var newSubscribers = [];
         subscribers.forEach(function (dd) {
            // console.log(dd);
             var data = {};
             data.Name= dd.name;
             data.Number = dd.number;
             data.Email = dd.email;
             data.Address = dd.address;
             data.AddedByuser= dd.addedBy.fullname;
             data.AddedByEmail = dd.addedBy.email;
             newSubscribers.push(data);

         });
        const Json2csvParser = require('json2csv').Parser;
        const fields = ['Name', 'Number', 'Email', 'Address', 'AddedByuser', 'AddedByEmail'];

        
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(newSubscribers);


       //var data = json2csv({data : subscribers});
        res.attachment('subscribers.csv');
        res.status(200).send(csv);


    });

});

module.exports = router;