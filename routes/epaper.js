const express = require('express'),
 	  router = express.Router(),
      template = require('./template'),

      passwordHash = require('password-hash'),
      dataModel = require('../models/mcp'),
      mongoose = require('mongoose'),
      fs = require('fs');


	  
router.get('/ePaper/:id?',function(req,res,next){

	dataModel.epaper.find({},function(err,epaper){
		res.render(template.mcp+'/epaper', { title: 'mcp | E-PAPER', epaper:epaper}); 
	});
	
});

router.post('/ePaper',function(req,res,next){

	if (req.files.file.name) {
			let tempF = req.files.file;
		    tempF.mv('public/epapers/'+req.files.file.name,function (err) {
		      if (err) return res.status(500).send(err);
		    });

    		var epaper = new dataModel.epaper({epaper_date:req.body.date, link: req.files.file.name });

    epaper.save(function (err,save) {
	        if (err) return res.status(500).send(err);
	        res.redirect('/mcp/ePaper');
	        //res.send(single);
	      });	

	      }    
});



//epaper delete 
router.get('/ePaper/delete/:id',function(req,res,next){

	 dataModel.epaper.findOneAndRemove({_id: mongoose.Types.ObjectId(req.params.id) },function(err, idc) {
	       if (err) return handleError(err);

	       filePath = 'public/epapers/'+idc.link; 
			fs.unlinkSync(filePath);

	      res.redirect('/mcp/ePaper');
	  });
});



 module.exports = router;