const express = require('express'),
	router = express.Router(),
	template = require('./template'),

	passwordHash = require('password-hash'),
	dataModel = require('../models/mcp'),
	mongoose = require('mongoose');
//get
router.get('/', function (req, res, next) {

	var role = new dataModel.role({
		role: 'administrator',
	});

	role.save(function (err, rol) {
		if (err) return handleError(err);


		var users = new dataModel.users({
			email: 'admin@swaerotimes.com',
			role_id: mongoose.Types.ObjectId(rol._id),
			fullname: 'swaerotimes',
			phone: '123456789',
			bio: 'studying & working',
			status: true,
			password: passwordHash.generate('swaerotimes'),
		});

		users.save(function (err, user) {
			if (err) return handleError(err);

		});


	});

	var role = new dataModel.role({
		role: 'district_editor',
	});

	role.save(function (err, rol) {
		if (err) return handleError(err);
	});


	var role = new dataModel.role({
		role: 'village_reporter',
	});

	role.save(function (err, rol) {
		if (err) return handleError(err);
	});


	res.send('role & user created');

});

module.exports = router;
