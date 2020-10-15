const express = require('express'),
 	  router = express.Router(),
      template = require('./template'),

      passwordHash = require('password-hash'),
      dataModel = require('../models/mcp'),
      mongoose = require('mongoose');


/* get en */
router.get('/district/:id?',function(req,res,next){
			
			dataModel.district.find({},function(err,district){
				if (err) return res.status(500).send(err);

				if (req.params.id) {
					// res.status(200).send('ok');
		          dataModel.district.find({_id:mongoose.Types.ObjectId(req.params.id)},function(err,doc){
		          res.render(template.mcp+'/district', { title: 'mcp | DISTRICT',state:req.params.id,district:district,doc:doc });
		          });

		        	} else {
		          	res.render(template.mcp+'/district', { title: 'mcp | DISTRICT',district:district });
		       } 
			});
		
});

/* post en */
router.post('/district/:id?',function(req,res,next){

			
		if(!req.params.id){
			        var district =new dataModel.district({
			                       state:req.body.state.trim(),
			                       district:req.body.district.trim().toUpperCase(),
			        });

			        district.save(function (err,menu) {
								//if (err) return res.stauts(500).send(err);
							//	if (err) res.redirect('/mcp/district');
			        });

		} else {
console.log(req.params.id);
			              dataModel.district.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)}, {
			                            
			                           state:req.body.state.trim(),
			                       district:req.body.district.trim().toUpperCase(),
			                            
			                           // password: req.body.password ? passwordHash.generate(req.body.password): '',

			            }, function(err, doc){
			          if (err) return res.stauts(500).send(err);
			            });
	    }

      res.redirect('/mcp/district');
});

//menus delete /en and /te
router.get('/district/delete/:id',function(req,res,next){

     dataModel.district.findOneAndRemove({_id: mongoose.Types.ObjectId(req.params.id) },function(err, id) {
           if (err) return handleError(err);
          res.redirect('/mcp/district');
      });
      //res.render(template.mcp+'/categories', { title: 'mcp | CATEGORIES',lang: 'en' });
});



      module.exports = router;