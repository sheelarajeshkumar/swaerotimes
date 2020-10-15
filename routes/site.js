const express = require('express'),
	router = express.Router(),
	template = require('./template'),
	dataModel = require('../models/mcp'),
    mongoose = require('mongoose');
    _ = require('lodash');
//Email sender
var nodemailer = require('nodemailer');
//https://myaccount.google.com/lesssecureapps
var transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	port: 25,
	auth: {
		user: 'kamalrao.m@gmail.com',
		pass: 'kamalbannu'
	},
	tls: {
		rejectUnauthorized: false
	}
});
/* GET login page. */
router.get('/mcp', function(req, res, next) {
  res.redirect('/mcp/login');
});

router.get('/', function(req, res ) {
	res.redirect('/te');
});
// Contact us page
router.get('/en/contactus',function(req,res) {
	dataModel.menus.find({ language: 'en' }).populate({ path: 'catpag_id', select: 'category slug language' }).sort({'priority':'asc'}).exec(function (err, menus) {
		res.render(template.site + '/contactus', { language: 'en', menus: menus});
	});
});
router.get('/te/contactus', function (req, res) {
	dataModel.menus.find({ language: 'te' }).populate({ path: 'catpag_id', select: 'category slug language' }).sort({'priority':'asc'}).exec(function (err, menus) {
		res.render(template.site + '/contactus', { language: 'te', menus: menus });
	});
});


router.post('/en/contactus', function (req, res) {
	dataModel.menus.find({ language: 'en' }).populate({ path: 'catpag_id', select: 'category slug language' }).sort({'priority':'asc'}).exec(function (err, menus) {
		var mailOptions = {
			from: 'Kamal Rao <kamalrao.m@gmail.com>',
			to: req.body.email,
			subject: 'Contact us',
			html:'Hi Team,<br><br><br>'+req.body.name+' with email address as '+req.body.email+' and phone '+req.body.phone+' contacted you with following comment ' +req.body.comment+'<br><br>',
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
		res.render(template.site + '/contactus', { language: 'en', menus: menus, message:"Email hasbeen sent we will contact you soon. Thanks for showing interest" });
	});
});

router.post('/te/contactus', function (req, res) {
	dataModel.menus.find({ language: 'te' }).populate({ path: 'catpag_id', select: 'category slug language' }).sort({'priority':'asc'}).exec(function (err, menus) {
		var mailOptions = {
			from: 'Contact Us page <kamalrao.m@gmail.com>',
			to: "kamalrao.m@gmail.com",
			subject: 'Contact us',
			html:'Hi Team,<br><br><br>'+req.body.name+' with email address as '+req.body.email+' and phone '+req.body.phone+' contacted you with following comment ' +req.body.comment+'<br><br>',
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
		res.render(template.site + '/contactus', { language: 'te', menus: menus, message: "Email hasbeen sent we will contact you soon. Thanks for showing interest" });
	});
});




/* GET home page. te */
router.get('/te', function(req, res ) {
     dataModel.menus.find({
     		language: 'te'
     	}).populate({
     		path: 'catpag_id',
     		select: 'category slug language'
     	}).sort({'priority':'asc'}).exec(function (err, menus) {
		 var dataSet = {}
		 if (req.params.keyword) {
			 console.log(req.params.keyword+ " $$$$")
			 dataSet = { title: new RegExp(req.params.keyword, "i"), language: 'te', post_status: 'publish', feature_post: true }
		 } else {
			 dataSet = { language: 'te', post_status: 'publish', feature_post: true }
		 }

						dataModel.posts.find(dataSet).limit(11).populate({ path: 'category_id', select: 'category slug priority' }).sort({
							'updatedOn': 'desc'
						}).exec(function(err,posts){				
			if (err) { res.status(500).send(); }	

				dataModel.categories.find({ language: 'te'}).limit(20).sort({'priority':'asc'}).exec(function(err,categories){
				if (err) { res.status(500).send(); }
					var totals = [];

					var total = [];
				posts.filter(function(item){ return item.category_id !== null }).forEach( function(item) {
					total.push(item);
				});

					categories.forEach(function(cats){
						var group_posts = [];
							total.forEach(function(post){
								
								console.log(post.category_id);
									if (post.category_id.priority === 1) {
										cats.slug.trim() == post.category_id.slug.trim() ? group_posts.push(post):group_posts.push();
									}
							});

							total.forEach(function (post) {

								console.log(post.category_id);
								if (post.category_id.priority != 1) {
									cats.slug.trim() == post.category_id.slug.trim() ? group_posts.push(post) : group_posts.push();
								}
							});
						totals.push({category:cats.category,slug:cats.slug,language:'te',post:group_posts});
					});

					//res.json(totals);
					//console.log(menus);
					res.render(template.site, { title: 'Swaero Times', language: 'te', posts: totals,menus:menus});

				});
			});
	});
});
router.get('/te/search/:keyword?', function (req, res) {
	dataModel.menus.find({ language: 'te' }).populate({ path: 'catpag_id', select: 'category slug language' }).sort({'priority':'asc'}).exec(function (err, menus) {
		var dataSet = {}
		if (req.params.keyword) {
			//console.log(req.params.keyword+ " $$$$")
			dataSet = { title: new RegExp(req.params.keyword, "i"), language: 'te', post_status: 'publish', feature_post: true }
		} else {
			dataSet = { language: 'te', post_status: 'publish', feature_post: true }
		}

		dataModel.posts.find(dataSet).limit(11).populate({ path: 'category_id', select: 'category slug priority' }).sort({
			'updatedOn': 'desc'
		}).exec(function (err, posts) {
			if (err) { res.status(500).send(); }

			dataModel.categories.find({ language: 'te' }).limit(20).sort({'priority':'asc'}).exec(function (err, categories) {
				if (err) { res.status(500).send(); }
				var totals = [];

				var total = [];
				posts.filter(function (item) { return item.category_id !== null }).forEach(function (item) {
					total.push(item);
				});

				categories.forEach(function (cats) {
					var group_posts = [];
					total.forEach(function (post) {

						//console.log(cats.category+'--'+post.category_id.category);
						cats.slug.trim() == post.category_id.slug.trim() ? group_posts.push(post) : group_posts.push();
					});
					totals.push({ category: cats.category, slug: cats.slug, language: 'te', post: group_posts });
				});

				//res.json(totals);
				res.render(template.site, { title: 'Swaero Times', language: 'te', posts: totals, menus: menus });

			});
		});
	});
});
router.get('/en/search/:keyword?', function (req, res) {
	dataModel.menus.find({ language: 'en' }).populate({ path: 'catpag_id', select: 'category slug language' }).sort({'priority':'asc'}).exec(function (err, menus) {

		var dataSet = {}
		if (req.params.keyword) {
			//console.log(req.params.keyword+ " $$$$")
			dataSet = { title: new RegExp(req.params.keyword, "i"), language: 'en', post_status: 'publish', feature_post: true }
		} else {
			dataSet = { language: 'en', post_status: 'publish', feature_post: true }
		}

		dataModel.posts.find(dataSet).limit(11).populate({ path: 'category_id', select: 'category slug priority' }).sort({
			'updatedOn': 'desc'
		}).exec(function (err, posts) {
			if (err) { res.status(500).send(); }

			dataModel.categories.find({ language: 'en' }).limit(20).sort({'priority':'asc'}).exec(function (err, categories) {
				if (err) { res.status(500).send(); }
				var totals = [];

				var total = [];
				posts.filter(function (item) { return item.category_id !== null }).forEach(function (item) {
					total.push(item);
				});

				categories.forEach(function (cats) {
					var group_posts = [];
					total.forEach(function (post) {

						//console.log(cats.category+'--'+post.category_id.category);
						cats.slug.trim() == post.category_id.slug.trim() ? group_posts.push(post) : group_posts.push();
					});
					totals.push({ category: cats.category, slug: cats.slug, language: 'en', post: group_posts });
				});

				//res.json(totals);
				//console.log(totals);
				res.render(template.site, { title: 'Swaero Times', language: 'en', posts: totals, menus: menus });

			});
		});
	});
});
/* GET home page. en */
router.get('/en', function(req, res ) {
     dataModel.menus.find({
     		language: 'en'
     	}).populate({
     		path: 'catpag_id',
     		select: 'category slug language'
     	}).sort({'priority':'asc'}).exec(function (err, menus) {

		var dataSet = {}
		 if (req.params.keyword) {
			 //console.log(req.params.keyword+ " $$$$")
			 dataSet = { title: new RegExp(req.params.keyword, "i"),language: 'en', post_status: 'publish', feature_post: true }
		 }else{
			 dataSet = { language: 'en', post_status: 'publish', feature_post: true }
		 }
		 
					dataModel.posts.find(dataSet).limit(11).populate({ path: 'category_id', select: 'category slug priority' }).sort({
						'updatedOn': 'desc'
					}).exec(function(err,posts){				
			if (err) { res.status(500).send(); }	

				dataModel.categories.find({ language: 'en'}).limit(20).sort({'priority':'asc'}).exec(function(err,categories){
				if (err) { res.status(500).send(); }
					var totals = [];

					var total = [];
				posts.filter(function(item){ return item.category_id !== null }).forEach( function(item) {
					total.push(item);
				});

					categories.forEach(function(cats){
						var group_posts = [];
							total.forEach(function(post){
								
								console.log(post);
								if (post.category_id.priority === 1){
									cats.slug.trim() == post.category_id.slug.trim() ? group_posts.push(post) : group_posts.push();
								}		
							});
							total.forEach(function (post) {

								console.log(post);
								if (post.category_id.priority != 1) {
									cats.slug.trim() == post.category_id.slug.trim() ? group_posts.push(post) : group_posts.push();
								}
							});
						totals.push({category:cats.category,slug:cats.slug,language:'en',post:group_posts});
					});

					//res.json(totals);
					res.render(template.site, { title: 'Swaero Times', language:'en', posts: totals,menus:menus});

				});
			});
	});
});

/* en get single page and cats */
router.get('/en/:catPag/:year?/:month?/:date?/:title?', function(req, res ) {
    dataModel.menus.find( {language:'en'} ).populate({path:'catpag_id', select: 'category slug language'}).sort({'priority':'asc'}).exec(function(err,menus){


	/* only category wise */
	if (req.params.catPag && !req.params.year && !req.params.month && !req.params.date && !req.params.title) {
			console.log("cm");
			var catPag = req.params.catPag;
			var newCat = '';

						catPag.toString().split('-').forEach( function(ele) {
							newCat += ' '+ele;
						});	

						console.log(newCat);
		dataModel.posts.find({ language: 'en', post_status: 'publish' }).sort({
			'updatedOn': 'desc'
		}).populate({path:'category_id',match: {  slug:newCat.trim()  }
			}).exec().then(function(posts){

				var total = [];
				posts.filter(function(item){ return item.category_id !== null }).forEach( function(item) {
					total.push(item);
				});
						
						//res.send(total);
					//console.log(total);
						var newCat = '';

						catPag.toString().split('-').forEach( function(ele) {
							newCat += ' '+ele;
						});	
				dataModel.posts.find({ language: 'en' }).sort({
					'updatedOn': 'desc'
				}).limit(6).exec(function(err, latest) {
							//console.log(latest);
							console.log(total);
							if(total.length>0){
	res.render(template.site + '/categories', { title: 'Swaero Times', language: 'en', posts: total,catSlug:catPag, category:total[0].category_id.category,menus:menus,latest:latest});
							}else{
	res.render(template.site + '/categories', { title: 'Swaero Times', language: 'en', posts: total,catSlug:catPag, category:'',menus:menus,latest:latest});
							}
						
						});
					});
	}


	/* only category and title wise */
	if (req.params.catPag && req.params.year && req.params.month && req.params.date && req.params.title) {
			console.log("OM");
			var catPag = req.params.catPag;
			var title = req.params.title;
			var newTile = '';

			title.toString().split('-').forEach( function(ele) {
				newTile += ' '+ele;
			});;

			//console.log(newTile.trim());

			dataModel.posts.find({language:'en',post_status:'publish',slug:newTile.trim()}).populate({path:'category_id',
				match: {  slug:catPag.toString().replace('/-/g',' ')  }
			}).sort({
				'updatedOn': 'desc'
			}).exec().then(function(posts){
						
						//res.send(posts[0]);
				dataModel.posts.find({ language: 'en' }).sort({ 'createdAt': -1 }).limit(6).sort({
					'updatedOn': 'desc'
				}).exec(function(err, latest) {
							//console.log(posts+" posts");
							res.render(template.site + '/single', { title: 'Swaero Times',language: 'en', post: posts[0],menus:menus,latest:latest});
						});
					});
	}
	});
});

/* te get single page and cats */
router.get('/te/:catPag/:year?/:month?/:date?/:title?', function(req, res ) {
    dataModel.menus.find( {language:'te'} ).populate({path:'catpag_id', select: 'category slug language'}).sort({'priority':'asc'}).exec(function(err,menus){


	/* only category wise */
	if (req.params.catPag && !req.params.year && !req.params.month && !req.params.date && !req.params.title) {
			
			var catPag = req.params.catPag;

			var newCat = '';

						catPag.toString().split('-').forEach( function(ele) {
							newCat += ' '+ele;
						});	

			dataModel.posts.find({language:'te',post_status:'publish'}).populate({path:'category_id',
				match: {  slug:newCat.trim()  }
			}).sort({
				'updatedOn': 'desc'
			}).exec().then(function(posts){
						
						var total = [];
						posts.filter(function(item){ return item.category_id !== null }).forEach( function(item) {
							total.push(item);
						});
						
						//res.send(total);
						var newCat = '';

						catPag.toString().split('-').forEach( function(ele) {
							newCat += ' '+ele;
						});	
						dataModel.posts.find({language:'te'}).sort({ 'createdAt' : 'desc' }).limit(6).exec(function(err, latest) {

								if(total.length>0){
										res.render(template.site + '/categories', { title: 'Swaero Times', language: 'te', posts: total,catSlug:catPag, category:total[0].category_id.category,menus:menus,latest:latest});
								}else{
									res.render(template.site + '/categories', { title: 'Swaero Times', language: 'te', posts: total,catSlug:catPag, category:'',menus:menus,latest:latest});
								}
						});
					});
	}


	/* only category and title wise */
	if (req.params.catPag && req.params.year && req.params.month && req.params.date && req.params.title) {
			
			var catPag = req.params.catPag;
			var title = req.params.title;
			var newTile = '';

			title.toString().split('-').forEach( function(ele) {
				newTile += ' '+ele;
			});;

			//console.log(newTile.trim());

			dataModel.posts.find({language:'te',post_status:'publish',slug:newTile.trim()}).populate({path:'category_id',
				match: {  slug:catPag.toString().replace('/-/g',' ')  }
			}).sort({ 'createdAt': 'desc' }).exec().then(function(posts){
						
						//res.send(posts[0]);
				dataModel.posts.find({ language: 'te' }).sort({ 'createdAt': 'desc' }).limit(6).exec(function(err, latest) {
							res.render(template.site + '/single', { title: 'Swaero Times', language: 'te', post: posts[0],menus:menus,latest:latest});
						});
					});
	}
	});
});

/* epaper */
router.get('/epaper',function(req, res){
    dataModel.menus.find({language:'te'}).populate({path:'catpag_id', select: 'category slug language'}).sort({'priority':'asc'}).exec(function(err,menus){
		dataModel.epaper.find({},function(err,epaper){
			epaper_u = _.uniqBy(epaper, '_id');
			console.log(epaper_u);
			res.render(template.site + '/epaper', { title: 'Swaero Times', language: 'en',epaper:epaper_u,menus:menus});
		});
	});
});

/* epaper */
router.post('/epaper',function(req, res){
    dataModel.menus.find().populate({path:'catpag_id', select: 'category slug language'}).sort({'priority':'asc'}).exec(function(err,menus){
		dataModel.epaper.find({epaper_date:req.body.date},function(err,epaper){
			epaper_u = _.uniqBy(epaper, '_id');
			res.render(template.site + '/epaper', { title: 'Swaero Times', language: 'en',epaper:epaper_u,menus:menus});
		});
	});
});

/* epaper */
router.get('/preview/:id?/:lang?',function(req, res){

	 if (!req.session.user)
    	res.redirect('/');

    dataModel.menus.find( {language:req.params.lang} ).populate({path:'catpag_id', select: 'category slug language'}).sort({'priority':'asc'}).exec(function(err,menus){
		
		dataModel.posts.find({_id:mongoose.Types.ObjectId(req.params.id)},function(err,posts){//console.log(posts);

			dataModel.posts.find({ language: req.params.lang }).sort({ 'createdAt': 'desc' }).limit(6).exec(function(err, latest) {
				res.render(template.site + '/single', { title: 'Swaero Times', language: 'en',post:posts[0],menus:menus,latest:latest});
						});
			
		});
	});
});

module.exports = router;
