const express = require('express'),
    router = express.Router(),
    template = require('./template'),

    passwordHash = require('password-hash'),
    dataModel = require('../models/mcp'),
    mongoose = require('mongoose');

//Email sender
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');


// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
    auth: {
      api_key: '6dbe67fe248f1f0e20da0ba825d7efac-b6183ad4-a25b1180',
      domain: 'swaerotimes.com'
    }
  }
  
  var nodemailerMailgun = nodemailer.createTransport(mg(auth));

  
//https://myaccount.google.com/lesssecureapps
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     secure: false,
//     port: 25,
//     auth: {
//         user: '1989.vigneshraja@gmail.com',
//         pass: 'Sakthi@2921'
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

/* GET users page. */
router.get('/users', function(req, res, next) {
    var data = {};
    //console.log('----------tsst 1-----------------');
    if (req.session.user.role_id.role == 'district_editor') {
        data.addedBy = mongoose.Types.ObjectId(req.session.user._id);
    }
    //console.log('----------tsst 2----------------');
    
    dataModel.users.find(data).populate({
        path: 'role_id',
        select: 'role -_id'
    }).exec(function(err, users) {
    //console.log('----------tsst 3-----------------');
        
        res.render(template.mcp + '/users', {
            title: 'mcp | USERS',
            users: users
        });
    });
});

/* GET delete user page. */
router.get('/deactivate/:id', function(req, res, next) {
    dataModel.users.findOneAndUpdate({
        _id: req.params.id
    }, {
        status: 'de-active'
    }, function(err, doc) {
        if (err) console.log(err);
        if (req.session.user.role_id.role == 'administrator') {
            res.redirect('/mcp/users');
        } else {
            res.redirect('/mcp/userEdit/' + doc._id);
        }
    });
});

router.get('/activate/:id', function(req, res, next) {
    dataModel.users.findOneAndUpdate({
        _id: req.params.id
    }, {
        status: 'active'
    }, function(err, doc) {
        if (err) console.log(err);
        if (req.session.user.role_id.role == 'administrator') {
            res.redirect('/mcp/users');
        } else {
            res.redirect('/mcp/userEdit/' + doc._id);
        }
    });
});

/* add & edit user */
router.get('/userEdit/:id?', function(req, res, next) {
    var data = {};
    if (req.params.id) {
        if (req.session.user.role_id.role != 'administrator') {
            data.district = req.session.user.district;
        }
        console.log(data+" 1");
        dataModel.district.find({}, function(err, district) {
            dataModel.users.find({
                _id: mongoose.Types.ObjectId(req.params.id)
            }, function(err, user) {
                dataModel.mandal.find(data, function (err, mandal) {
                    //console.log(user);
                    dataModel.role.find(function(err, role) {
                        var customRoles = {};
                        role.forEach(element => {
                            customRoles[element.role] = element._id;
                        });

                        var getOptions = '<option disabled selected>Options..</option>';
                        role.forEach(function(rol) {
                            var ro;
                            if (rol.role == 'administrator') {
                                ro = 'Administrator';
                            }

                            if (rol.role == 'district_editor') {
                                ro = 'District Editor';
                            }

                            if (rol.role == 'village_reporter') {
                                ro = 'Mandal Reporter';
                            }

                            if (user[0].role_id.toString() == rol._id.toString()) {
                                getOptions += '<option value="' + rol._id + '"' + 'selected' + '>' + ro + '</option>';
                            } else {
                                getOptions += '<option value="' + rol._id + '">' + ro + '</option>';
                            }
                        });


                        console.log(user);
                        res.render(template.mcp + '/userEdit', {
                            title: 'mcp | USER',
                            user: user,
                            role: getOptions,
                            district: district,
                            mandal: mandal,
                            newUser: false,
                            roles: customRoles
                        });
                    });
                });
            });
        });

    } else {
        
        if (req.session.user.role_id.role != 'administrator'){
            data.district= req.session.user.district;
        }
        console.log(data + " 2");
        console.log(req.session.user.role_id);
        dataModel.district.find({}, function(err, district) {
            dataModel.mandal.find(data, function (err, mandal) {
                dataModel.role.find(function(err, roles) {
                    console.log(roles);
                    var customRoles = {};
                    roles.forEach(element => {
                        customRoles[element.role] = element._id;
                    });
                    console.log(customRoles);
                    var getOptions = '<option disabled>Options..</option>';
                    roles.forEach(function(role) {
                        getOptions += '<option value="' + role._id + '">' + role.role + '</option>';
                    });
                    res.render(template.mcp + '/userEdit', {
                        title: 'mcp | USER EDIT',
                        role: getOptions,
                        district: district,
                        mandal: mandal,
                        newUser:true,
                        roles: customRoles
                    });
                });
            });
        });
    }
});

router.get('/passwordset/:id?/:date?', function(req, res, next) {
    // redirect to page and take user input
    try {
        dataModel.users.find({
            _id: mongoose.Types.ObjectId(req.params.id)
        }, function(err, user) {

            if (user.length == 0) {
                res.render(template.mcp + '/404');
            } else if(req.params.date){
                var d = new Date();

                if( ( parseInt(d.getHours()) - (parseInt(req.params.date)) ) >= 1 ){
                    res.render(template.mcp + '/expired');
                } else {
                    console.log(req.params.date);
                    console.log(d.getHours());
                    res.render(template.mcp + '/passwordSet', {
                        title: 'mcp | USER PASSWORD RESET',
                        user: user
                    });
                }
            }else{
                res.render(template.mcp + '/passwordSet', {
                    title: 'mcp | USER PASSWORD RESET',
                    user: user
                });
            }
        });
    } catch (error) {
        // console.log(template.mcp );
        res.render(template.mcp + '/404');
    }


    // after submission feed the data in DB
});

router.post('/passwordset/:id?', function(req, res, next) {
    if (req.body.password === req.body.repassword) {
        dataModel.users.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(req.body.userkey)
            }, {
                password: passwordHash.generate(req.body.password),
                status: 'true'
            },
            function(err, doc) {
                if (err) return handleError(err);
                //res.redirect('/mcp/404');
            });
        res.redirect('/mcp/');
    } else {
        dataModel.users.find({
            _id: mongoose.Types.ObjectId(req.body.userkey)
        }, function(err, user) {
            res.render(template.mcp + '/passwordSet', {
                title: 'mcp | USER PASSWORD RESET',
                user: user,
                error: true
            });
        });

    }

});

router.post('/checkEmail/:id?', function(req, res, next) {
    //console.log(req.body.email );
    let error = {};
    dataModel.users.find({
        email: req.body.email
    }, function(err, user) {
        console.log(user);
        if (user.length > 0) {
            console.log("not ok");
            error.errorCode = 1;
            //	error.errorMessage = "Sorry your already in";
            //res.render("data",{data:"not ok"});

        } else {
            error.errorCode = 0;
            //	error.errorMessage ="ok";
        }
        res.send(error);
        return;
    });
    //	res.send(false);
});

/* save user */
router.post('/userEdit/:id?', function(req, res, next) {
console.log(req.body);
    if (!req.params.id) {
        var users = new dataModel.users({
            email: req.body.email,
            role_id: mongoose.Types.ObjectId(req.body.role),
            fullname: req.body.name,
            phone: req.body.phone,
            bio: req.body.bio,
            state: req.body.state,
            user_image: req.body.user_image,
            status: req.body.status,
            password: 'EMPTY',
            addedBy: mongoose.Types.ObjectId(req.session.user._id),
        });
        if (req.body.district){
            users.district = req.body.district.toUpperCase();
        }
        if (req.body.mandal) {
            users.mandal = req.body.mandal.toUpperCase();
        }
        //passwordHash.generate(req.body.password)
        users.save(function(err, user) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }
            if (req.body.user_image) {
                req.session.user.user_image = req.body.user_image;
            }

            var d = new Date();



            nodemailerMailgun.sendMail({
                from: 'SwaroTimes <support@swaerotimes.com>',
                to: req.body.email,
                subject: 'Resetting password',
                html: 'Hi ' + req.body.name + ',<br><br><br>Congratulations.! You have been appointed as ' + req.body.role + ' to the swarotimes, please create your password here.. <a href="http://pylonnews.com/mcp/passwordset/' + mongoose.Types.ObjectId(users.id) + '">click hear</a><br><br><br><br><b>Regards,<br>Team Swaero Times.',
            }, function (err, info) {
                if (err) {
                console.log('Error: ' + err);
                }
                else {
                console.log('Response: ' + info);
                }
            });

            //sending email for resetting password
            //need to work on reseting password
            // console.log(req.body.email);
            // var mailOptions = {
            //     from: 'Kamal Rao <kamalrao.m@gmail.com>',
            //     to: req.body.email,
            //     subject: 'Resetting password',
            //     html: 'Hi ' + req.body.name + ',<br><br><br>Congratulations.! You have been appointed as ' + req.body.role + ' to the swarotimes, please create your password here.. <a href="http://139.59.53.135/mcp/passwordset/' + mongoose.Types.ObjectId(users.id) + '">click hear</a><br><br><br><br><b>Regards,<br>Team Swaero Times.',
            // };

            // transporter.sendMail(mailOptions, function(error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });

            res.redirect('/mcp/users');
        });

    } else {


        var data = {
           // email:req.body.email,
            // role_id: mongoose.Types.ObjectId(req.body.role),
           //fullname: req.body.name,
            phone: req.body.phone,
            user_image: req.body.user_image ,
            bio: req.body.bio,
           /*  state: req.body.state,
            district: req.body.district,
            mandal: req.body.mandal, */
            //status: req.body.status,
            // password: req.body.password ? passwordHash.generate(req.body.password): '',
        };

        if (req.body.role) {
            data.role_id = mongoose.Types.ObjectId(req.body.role);
        }


        if (req.body.status) {
            data.status = req.body.status;
        }

        if (req.body.district) {
            data.district = req.body.district.toUpperCase();
        }

        if (req.body.state) {
            data.state = req.body.state;
        }

        if (req.body.mandal) {
            data.mandal = req.body.mandal;
        }


      /*   if (req.body.password) {
            data.password = passwordHash.generate(req.body.password);
        } */

console.log(data);
        dataModel.users.findOneAndUpdate({
            _id: req.params.id
        }, data, function(err, doc) {
            if (err) console.log(err);
            console.log(doc);
            if (req.session.user.role_id.role == 'administrator') {
                res.redirect('/mcp/users');
            } else {
                res.redirect('/mcp/userEdit/' + doc._id);
            }
        });

    }
});



module.exports = router;