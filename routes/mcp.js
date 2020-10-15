const express = require('express'),
 	  router = express.Router(),
      template = require('./template'),

      passwordHash = require('password-hash'),
      dataModel = require('../models/mcp'),
      mongoose = require('mongoose');


/* GET dashboard page */
router.get(['/','/district','/district/*','/subscribers','/subscribers/*','/users','/posts','/pages','/menus','/ePaper','/ePaper/*','categories','/posts/*','/pages/*','/menus/*','/users/*','/categories/*','/postEdit','/pageEdit','/postEdit/*','/pageEdit/*','/userEdit','/userEdit/*'], function(req, res, next) {
    //console.log(req.session.user);
    //req.session.destroy();
    if (!req.session.user)
    res.redirect('/mcp/login');
    else
    next();
   
});

module.exports = router;