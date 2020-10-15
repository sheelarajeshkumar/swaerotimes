const express = require('express'),
 	  router = express.Router(),
      template = require('./template'),

      passwordHash = require('password-hash'),
      dataModel = require('../models/mcp'),
      mongoose = require('mongoose'),
	  fs = require('fs');


/* media */
router.get('/media/:id?', function (req, res, next) {
	let data = {};

console.log(req.session.user._id);
console.log(req.params.id);

	if (req.session.user.role_id.role != 'administrator') {
			data.addedBy = req.session.user._id;
			data.lang = req.params.id;
	}
	 dataModel.media.find(data).sort({
	 		'updatedOn': 'desc'
	 	}).populate({
	 		path: 'addedBy'
	 	}).exec(function (err, files) {
			 let images = [];
			files.forEach(function (file) {
				images.push(file.image_name);
			});
				/*fs.readdir('public/uploads', (err, files) => {
					console.log(files_db);
					 var images = [];
					files.forEach(file => {
						console.log(file);
						images.push(file);
					});
					res.send(images); 
				});*/
				res.send(images);
	});
});


// save media
router.post('/media/save/',function(req,res,next){
		if (!req.files)
    	return res.status(400).send('No files were uploaded.');

			//console.log(req.body);
			//console.log(req.body.lan);
		let data ={
			image_name: req.files.file.name,
			lang:req.body.lan,
			addedBy: req.session.user._id
		};
		console.log(data);

			let tempF = req.files.file;
			tempF.mv('public/uploads/' + req.files.file.name, function (err) {
				//if (err) return res.status(500).send(err);
			//	res.send('FileUploaded');
			});
		var media = new dataModel.media(data);

		media.save(function (err, single) {
			//if (err) return handleError(err);
		//	res.redirect('/mcp/posts/en/');
		});
});

// delete media
router.get('/media/delete/:id?',function(req,res,next){
		if (!req.params.id)
    	res.status(400).send('No files were uploaded.');

		filePath = 'public/uploads/'+req.params.id; 
		fs.unlinkSync(filePath);
		res.set('Content-Type', 'text/html');
		dataModel.media.findOneAndRemove({
					image_name: req.params.id
				}, function (err, id) {
				//res.status(200).send('File deleted successfully');
		});
});

module.exports = router;