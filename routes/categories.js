const express = require('express'),
  router = express.Router(),
  template = require('./template'),
  _ = require('lodash'),

  passwordHash = require('password-hash'),
  dataModel = require('../models/mcp'),
  mongoose = require('mongoose');

router.get('/categories/en/:id?', function (req, res, next) {
  dataModel.categories.find({ language: 'en' }, function (err, categories) {
    if (req.params.id) {
      dataModel.categories.find({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err, doc) {
        res.render(template.mcp + '/categories', { title: 'mcp | CATEGORIES', lang: 'en', categories: categories, doc: doc });
      });
    } else {
      //console.log(categories);
      res.render(template.mcp + '/categories', { title: 'mcp | CATEGORIES', lang: 'en', categories: categories });
    }
  });
});


// post
router.post('/categories/en/:id?', function (req, res, next) {

  dataModel.categories.find({language: 'en'}).select('priority -_id').exec(function(err, docs){
    var prior = [];
    docs.forEach(function(u){
        prior.push(u.priority);
    });
    
    //console.log(_.includes(prior,sanitizePriority(req)));

  

  if (_.includes(prior,sanitizePriority(req)) != true && !req.params.id) {
    var category = new dataModel.categories({
      category: req.body.category.trim(),
      slug: req.body.slug.trim(),
      priority: sanitizePriority(req),
      language: 'en',
      isActive: 'true'
    });

    category.save(function (err, cate) {
      console.log(err);
      if (err) return handleError(err);
    });
    res.redirect('/mcp/categories/en');
  } else if(req.params.id) {
    dataModel.categories.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, {
      category: req.body.category.trim(),
      slug: req.body.slug.trim(),
      priority: sanitizePriority(req),
      language: 'en',
      isActive: 'true'
    }, function (err, doc) {
      if (err) return handleError(err);
    });
    res.redirect('/mcp/categories/en');
  } else {
    res.redirect('/mcp/categories/en?msg=priority already set. Try another!');
  }

  });
  
});

//active
router.get('/categories/en/active/:id', function (req, res, next) {
  dataModel.categories.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, {
    isActive: 'false'
  }, function (err, doc) {
    if (err) return handleError(err);
  });

  res.redirect('/mcp/categories/en');

});
router.get('/categories/te/active/:id', function (req, res, next) {
  dataModel.categories.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, {
    isActive: 'false'
  }, function (err, doc) {
    if (err) return handleError(err);
  });

  res.redirect('/mcp/categories/te');

});
//inactive
router.get('/categories/en/inactive/:id', function (req, res, next) {
  dataModel.categories.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, {
    isActive: 'true'
  }, function (err, doc) {
    if (err) return handleError(err);
  });

  res.redirect('/mcp/categories/en');
});

router.get('/categories/te/inactive/:id', function (req, res, next) {
  dataModel.categories.findOneAndUpdate({
    _id: mongoose.Types.ObjectId(req.params.id)
  }, {
      isActive: 'true'
    }, function (err, doc) {
      if (err) return handleError(err);
    });

  res.redirect('/mcp/categories/te');
});


//categories delete /en and /te
router.get('/categories/en/delete/:id', function (req, res, next) {

  dataModel.categories.remove({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err1, cat_id) {
    dataModel.menus.remove({
      catpag_id: mongoose.Types.ObjectId(req.params.id)
    }, function (err2, menu_id) {
      dataModel.posts.remove({
        category_id: mongoose.Types.ObjectId(req.params.id)
      }, function (err3, post_id) {
        // if (err3) return handleError(err3);
        res.redirect('/mcp/categories/en');
      });
    });
  });
});

//te
router.get('/categories/te/delete/:id', function (req, res, next) {
  dataModel.categories.remove({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err1, cat_id) {
    dataModel.menus.remove({
      catpag_id: mongoose.Types.ObjectId(req.params.id)
    }, function (err2, menu_id) {
      dataModel.posts.remove({
        category_id: mongoose.Types.ObjectId(req.params.id)
      }, function (err3, post_id) {
        // if (err3) return handleError(err3);
        res.redirect('/mcp/categories/te');
      });
    });
  });
});


router.get('/categories/te/:id?', function (req, res) {
  dataModel.categories.find({ language: 'te' }, function (err, categories) {
    if (req.params.id) {
      dataModel.categories.find({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err, doc) {
        res.render(template.mcp + '/categories', { title: 'mcp | CATEGORIES', lang: 'te', categories: categories, doc: doc });
      });
    } else {
      res.render(template.mcp + '/categories', { title: 'mcp | CATEGORIES', lang: 'te', categories: categories });
    }
  });
});

router.post('/categories/te/:id?', function (req, res) {

  dataModel.categories.find({language: 'te'}).select('priority -_id').exec(function(err, docs){
    var prior = [];
    docs.forEach(function(u){
        prior.push(u.priority);
    });
    
    //console.log(_.includes(prior,sanitizePriority(req)));

    

  if (_.includes(prior,sanitizePriority(req)) != true && !req.params.id) {
    var category = new dataModel.categories({
      category: req.body.category.trim(),
      slug: req.body.slug.trim(),
      priority: sanitizePriority(req),
      language: 'te',
      isActive: 'true'
    });

    category.save(function (err, cate) {
      if (err) return handleError(err);
    });
    res.redirect('/mcp/categories/te');
  } else if (req.params.id) {
    dataModel.categories.findOneAndUpdate({ _id: req.params.id }, {
      category: req.body.category.trim(),
      slug: req.body.slug.trim(),
      priority: sanitizePriority(req),
      language: 'te',
      isActive: 'true'
    }, function (err, doc) {
      if (err) return handleError(err);
    });
    res.redirect('/mcp/categories/te');
  } else {
    res.redirect('/mcp/categories/te?msg=priority already set. Try another!');
  }

  });
  
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
