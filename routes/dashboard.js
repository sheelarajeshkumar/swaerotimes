const express = require('express'),
 	  router = express.Router(),
      template = require('./template'),

      passwordHash = require('password-hash'),
      dataModel = require('../models/mcp'),
      mongoose = require('mongoose');



/* GET dashboard page */
router.get('/dashboard', function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/mcp/login');
  } else {
    //console.log(req.session.user);
    dataModel.posts.find({post_status:'publish',language:'en'},function(err,publish_en){
      dataModel.posts.find({post_status:'publish_approval',language:'en'},function(err,pending_en){
        dataModel.posts.find({post_status:'publish',language:'te'},function(err,publish_te){
          dataModel.posts.find({post_status:'publish_approval',language:'en'},function(err,pending_te){
             res.render(template.mcp+'/dashboard', { title: 'mcp | DASHBOARD',publish_en: publish_en.length,pending_en:pending_en.length, publish_te:publish_te.length,pending_te:pending_te.length});
            });
          });
        });
    });
  }
});

module.exports = router;