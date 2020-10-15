const express = require('express'),
 	  router = express.Router(),
      template = require('./template'),

      passwordHash = require('password-hash'),
      dataModel = require('../models/mcp'),
      mongoose = require('mongoose');

/* languages */
router.get('/pages/en',function(req,res,next){
  dataModel.pages.find({language:'en'},function(err,pages){
    //console.log(categories);
  res.render(template.mcp+'/pages', { title: 'mcp | PAGES|mcp | PAGES',lang: 'en',pages:pages });    
  });
});

router.get('/pages/te',function(req,res,next){
   dataModel.pages.find({language:'te'},function(err,pages){
    //console.log(categories);
  res.render(template.mcp+'/pages', { title: 'mcp | PAGES|mcp | PAGES',lang: 'te',pages:pages });    
  });
});

// get Edit & Addmcp | PAGES
router.get('/pageEdit/en/:id?',function(req,res,next){
	if (req.params.id) {
		    dataModel.pages.find({_id : mongoose.Types.ObjectId(req.params.id) },function(err, page) {
		      	res.render(template.mcp+'/pageEdit', { title: 'mcp | PAGES| page EDIT',page:page});
		    });
		} else {
		    res.render(template.mcp+'/pageEdit', { title: 'mcp | PAGES| page EDIT' });	       
		}
});

router.get('/pageEdit/te/:id?',function(req,res,next){
	if (req.params.id) {
	    dataModel.pages.find({_id : mongoose.Types.ObjectId(req.params.id) },function(err, page) {
	    	let feature_post = page[0].feature_post ? true : false;
	      	res.render(template.mcp+'/pageEdit', { title: 'mcp | PAGES| page EDIT',page:page});	
	    });
	} else {
	    res.render(template.mcp+'/pageEdit', { title: 'mcp | PAGES| page EDIT' });
	}
});


// savemcp | PAGES
router.post('/pageEdit/te/:id?',function(req,res,next){
		var data = {
			               title: req.body.title ? req.body.title : '',
	                       content: req.body.descr? req.body.descr :'',
	                       feature_image: req.body.feature_image?req.body.feature_image:'',
	                       addedBy: req.session.user._id? mongoose.Types.ObjectId(req.session.user._id):mongoose.Types.ObjectId(),
	                       language: 'te',

			};

		if (!req.params.id) {
			  var page = new dataModel.pages(data);

			      page.save(function (err,single) {
			        if (err) return handleError(err);
			        res.redirect('/mcp/pageEdit/te/'+single._id);
			      });

			    } else {


			dataModel.pages.findOneAndUpdate({_id:req.params.id}, data, function(err, doc){
			    if (err) return handleError(err);
			    //console.log(doc);
			    res.redirect('/mcp/pageEdit/te/'+doc._id);
			});

		} 
 });


router.post('/pageEdit/en/:id?',function(req,res,next){
		var data = {
			               title: req.body.title ? req.body.title : '',
	                       content: req.body.descr? req.body.descr :'',
	                       feature_image: req.body.feature_image?req.body.feature_image:'',
	                       addedBy: req.session.user._id? mongoose.Types.ObjectId(req.session.user._id):mongoose.Types.ObjectId(),
	                       language: 'en',

			};

		if (!req.params.id) {
			  var page = new dataModel.pages(data);

			      page.save(function (err,single) {
			        if (err) return handleError(err);
			        res.redirect('/mcp/pageEdit/en/'+single._id);
			      });

			    } else {


			dataModel.pages.findOneAndUpdate({_id:req.params.id}, data, function(err, doc){
			    if (err) return handleError(err);
			    //console.log(doc);
			    res.redirect('/mcp/pageEdit/en/'+doc._id);
			});

		} 
 });



/* Deleting things */
router.get('/pages/te/delete/:id?',function(req,res,next){
 dataModel.pages.findOneAndRemove({_id: mongoose.Types.ObjectId(req.params.id) },function(err, id) {
       if (err) return handleError(err);
      res.redirect('/mcp/pages/te');
  });
});

router.get('/pages/en/delete/:id?',function(req,res,next){
 dataModel.pages.findOneAndRemove({_id: mongoose.Types.ObjectId(req.params.id) },function(err, id) {
       if (err) return handleError(err);
      res.redirect('/mcp/pages/en');
  });
});
      

module.exports = router;