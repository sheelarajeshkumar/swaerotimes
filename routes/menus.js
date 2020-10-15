const express = require('express'),
 	  router = express.Router(),
      template = require('./template'),
	  _ = require('lodash'),
      passwordHash = require('password-hash'),
      dataModel = require('../models/mcp'),
      mongoose = require('mongoose');


/* get en */
router.get('/menus/en/:id?',function(req,res,next){
			dataModel.categories.find({language:'en',isActive:'true'},function(err,categories){
			dataModel.menus.find( {language:'en'} ).populate({path:'catpag_id', select: 'category slug'}).sort('priority').exec(function(err,menus){
				if (err) return res.status(500).send(err);

				if (req.params.id) {
					// res.status(200).send('ok');
		          dataModel.menus.find({_id:mongoose.Types.ObjectId(req.params.id)}).populate({path:'catpag_id', select: 'category slug'}).exec(function(err,doc){
		          res.render(template.mcp+'/menus', { title: 'mcp | MENUS',lang: 'en',menus:menus,categories:categories,doc:doc });
		          });

		        	} else {
		          	res.render(template.mcp+'/menus', { title: 'mcp | MENUS',lang: 'en',menus:menus,categories:categories });
		       } 
			});
			});
});

/* post en */
router.post('/menus/en/:id?',function(req,res,next){


	dataModel.menus.find({language: 'en'}).select('priority -_id').exec(function(err, docs){
		var prior = [];
		docs.forEach(function(u){
			prior.push(u.priority);
		});
		
		//console.log(_.includes(prior,sanitizePriority(req)));
	
	  
			
		if(_.includes(prior,sanitizePriority(req)) != true && !req.params.id){
			        var menus =new dataModel.menus({
			                       catpag_id: mongoose.Types.ObjectId( req.body.catPag_id ) ,
			                       priority:req.body.priority.trim()  ,
			                       language: 'en'
			        });

			        menus.save(function (err,menu) {
			          if (err) return res.stauts(500).send(err);
			        });
					res.redirect('/mcp/menus/en');
			        } else if(req.params.id){

			              dataModel.menus.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)}, {
			                            
			                            catpag_id:mongoose.Types.ObjectId( req.body.catPag_id.trim() ),
			                            priority:req.body.priority.trim() ,
			                            language: 'en'
			                           // password: req.body.password ? passwordHash.generate(req.body.password): '',

			            }, function(err, doc){
			          if (err) return res.stauts(500).send(err);
						});
						res.redirect('/mcp/menus/en');
	    } else {

	  res.redirect('/mcp/menus/en?msg=priority already set. Try another!');
		}
});
});

/* get te */
router.get('/menus/te/:id?',function(req,res,next){
			dataModel.categories.find({language:'te',isActive:'true'},function(err,categories){
			dataModel.menus.find( {language:'te'} ).populate({path:'catpag_id', select: 'category slug'}).sort('priority').exec(function(err,menus){
				if (err) return res.status(500).send(err);

				if (req.params.id) {
					// res.status(200).send('ok');
		          dataModel.menus.find({_id:mongoose.Types.ObjectId(req.params.id)}).populate({path:'catpag_id', select: 'category slug'}).exec(function(err,doc){
		          res.render(template.mcp+'/menus', { title: 'mcp | MENUS',lang: 'te',menus:menus,categories:categories,doc:doc });
		          });

		        	} else {
		          	res.render(template.mcp+'/menus', { title: 'mcp | MENUS',lang: 'te',menus:menus,categories:categories });
		       } 
			});
			});
});

/* post te */
router.post('/menus/te/:id?',function(req,res,next){
	dataModel.menus.find({language: 'te'}).select('priority -_id').exec(function(err, docs){
		var prior = [];
		docs.forEach(function(u){
			prior.push(u.priority);
		});
		
		//console.log(_.includes(prior,sanitizePriority(req)));
			
		if(_.includes(prior,sanitizePriority(req)) != true && !req.params.id){
			        var menus =new dataModel.menus({
			                       catpag_id: mongoose.Types.ObjectId( req.body.catPag_id ) ,
			                       priority:req.body.priority.trim()  ,
			                       language: 'te'
			        });

			        menus.save(function (err,menu) {
			          if (err) return res.stauts(500).send(err);
			        });
					res.redirect('/mcp/menus/te');
			        } else if(req.params.id){

			              dataModel.menus.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)}, {
			                            
			                            catpag_id:mongoose.Types.ObjectId( req.body.catPag_id.trim() ),
			                            priority:req.body.priority.trim() ,
			                            language: 'te'
			                           // password: req.body.password ? passwordHash.generate(req.body.password): '',

			            }, function(err, doc){
			          if (err) return res.stauts(500).send(err);
						});
						res.redirect('/mcp/menus/te');
	    } else {

	  res.redirect('/mcp/menus/te?msg=priority already set. Try another!');
		}
});
});

//menus delete /en and /te
router.get('/menus/en/delete/:id',function(req,res,next){

     dataModel.menus.findOneAndRemove({_id: mongoose.Types.ObjectId(req.params.id) },function(err, id) {
           if (err) return handleError(err);
          res.redirect('/mcp/menus/en');
      });
      //res.render(template.mcp+'/categories', { title: 'mcp | CATEGORIES',lang: 'en' });
});

//te
router.get('/menus/te/delete/:id',function(req,res,next){

     dataModel.menus.findOneAndRemove({_id: mongoose.Types.ObjectId(req.params.id) },function(err, id) {
           if (err) return handleError(err);
          res.redirect('/mcp/menus/te');
      });

      //res.render(template.mcp+'/categories', { title: 'mcp | CATEGORIES',lang: 'en' });
});



function sanitizePriority(request, language)
{
  var priority = request.body.priority.trim();
  if (priority) {
    priority = parseInt(priority);
  } else {
    priority = null;
  }

  return isNaN(priority) ? '' : priority;
}

      module.exports = router;