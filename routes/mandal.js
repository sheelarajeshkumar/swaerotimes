const express = require('express'),
 	  router = express.Router(),
      template = require('./template'),

      passwordHash = require('password-hash'),
      dataModel = require('../models/mcp'),
      mongoose = require('mongoose');


/* get en */
router.get('/mandal/:id?',function(req,res,next){
			
			dataModel.district.find({},function(err,district){
			dataModel.mandal.find({},function(err,mandal){
				if (err) return res.status(500).send(err);

				if (req.params.id) {
					// res.status(200).send('ok');
		          dataModel.mandal.find({_id:mongoose.Types.ObjectId(req.params.id)},function(err,doc){
		          res.render(template.mcp+'/mandal', { title: 'mcp | MANDAL',state:req.params.id,district:district,mandal:mandal,doc:doc });
		          });

		        	} else {
		          	res.render(template.mcp+'/mandal', { title: 'mcp | MANDAL',mandal:mandal,district:district });
		       } 
			});
			});
		
});

/* post en */
router.post('/mandal/:id?',function(req,res,next){

			
		if(!req.params.id){
			        var mandal =new dataModel.mandal({
			                       mandal:req.body.mandal.trim().toUpperCase(),
			                       district:req.body.district
			        });

			        mandal.save(function (err,menu) {
			          if (err) return res.stauts(500).send(err);
			        });

			        } else {

			              dataModel.mandal.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)}, {
			                            
			                           mandal:req.body.mandal.trim().toUpperCase(),
			                       district:req.body.district,
			                            
			                           // password: req.body.password ? passwordHash.generate(req.body.password): '',

			            }, function(err, doc){
			          if (err) return res.stauts(500).send(err);
			            });
	    }

      res.redirect('/mcp/mandal');
});

//menus delete /en and /te
router.get('/mandal/delete/:id',function(req,res,next){

     dataModel.mandal.findOneAndRemove({_id: mongoose.Types.ObjectId(req.params.id) },function(err, id) {
           if (err) return handleError(err);
          res.redirect('/mcp/mandal');
      });
      //res.render(template.mcp+'/categories', { title: 'mcp | CATEGORIES',lang: 'en' });
});



      module.exports = router;