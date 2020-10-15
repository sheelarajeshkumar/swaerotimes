const express = require('express'),
  router = express.Router(),
  template = require('./template'),

  passwordHash = require('password-hash'),
  dataModel = require('../models/mcp'),
  mongoose = require('mongoose');
//Email sender
//var nodemailer = require('nodemailer');
//https://myaccount.google.com/lesssecureapps
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   secure: false,
//   port: 25,
//   auth: {
//     user: 'kamalrao.m@gmail.com',
//     pass: 'kamalbannu'
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });


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

  

router.get('/resetPassword', function (req, res, next) {
  if (!req.session.user)
    res.render(template.mcp + '/resetpassword', {
      title: 'mcp | LOGIN'
    });
  else
    res.redirect('/mcp/dashboard');
});

router.post('/resetPassword', function (req, res, next) {
  if (req.body.email) {
    dataModel.users.find({
      email: req.body.email
    }, function (err, user) {
      //console.log(user[0]._id);
      // var mailOptions = {
      //   from: 'Kamal Rao <kamalrao.m@gmail.com>',
      //   to: req.body.email,
      //   subject: 'Resetting password',
      //   html: 'Hi ' + user[0].fullname + ',<br><br><br>Click this link for resetting password <a href="http://swaerotimes.com/mcp/passwordset/' + user[0]._id + '">hear</a><br><br><br><br><b>Regards,<br>Team Swaero Times.',
      // };

      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });
      var d = new Date();
      
      nodemailerMailgun.sendMail({
        from: 'SwaroTimes <support@swaerotimes.com>',
        to: req.body.email,
        subject: 'Resetting password',
        html: 'Hi ' + user[0].fullname + ',<br><br><br>Click this link for resetting password <a href="http://swaerotimes.com/mcp/passwordset/' + user[0]._id +'">hear</a><br><br><br><br><b>Regards,<br>Team Swaero Times.',
         }, function (err, info) {
        if (err) {
        console.log('Error: ' + err);
        }
        else {
        console.log('Response: ' + info);
        }
    });

    });
    res.render(template.mcp + '/login', {
      title: 'mcp | LOGIN',
      message: 'Email was sent to reset password'
    });
  } else {
    res.render(template.mcp + '/resetPassword', {
      title: 'mcp | Reset Password',
      message: 'Email not define'
    });
  }
});


/* GET login page. */
router.get('/login', function (req, res, next) {
  if (!req.session.user)
    res.render(template.mcp + '/login', {
      title: 'mcp | LOGIN'
    });
  else
    res.redirect('/mcp/dashboard');
});


/* POST login page */
router.post('/login', function (req, res) {
  var email = req.body.email,
    password = req.body.password;
  //console.log(passwordHash.generate('1234'));
  dataModel.users.findOne({
    email: email
  }).populate('role_id').exec(function (err, user) {
    if (err) {
      console.error(err);
      return res.status(500).send();
    }

    if (!user) {
      res.render(template.mcp + '/login', {
        title: 'mcp | LOGIN',
        message: 'Email not registered with us'
      });
    }

    if (user) {
      if (user.status && (user.status !== 'active' && user.status !== 'true')) {
        res.render(template.mcp + '/login', {
          title: 'mcp | LOGIN',
          message: 'User is Deactivated. Contact Administrator'
        });
      } else if (passwordHash.verify(password, user.password)) {
        req.session.user = user;
        res.redirect('/mcp/dashboard');
      } else {
        res.render(template.mcp + '/login', {
          title: 'mcp | LOGIN',
          message: 'Password Incorrect'
        });
      }
    }
  });
});



/* logout */

/* GET logout page. */
router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    // cannot access session here
  });
  res.redirect('/mcp/login');
});



module.exports = router;