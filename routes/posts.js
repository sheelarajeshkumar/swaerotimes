const express = require('express'),
    router = express.Router(),
    template = require('./template'),

    passwordHash = require('password-hash'),
    dataModel = require('../models/mcp'),
    mongoose = require('mongoose');


// Date Filter condition
router.post('/posts/en/search/:id?', function(req, res, next) {
    var data = {};
    //TODO
    if (req.params.id) {
        if (req.session.user.role_id.role == 'administrator') {
            data = {
                language: 'en',
                post_status: {
                    $in: ['publish_approval', 'publish', 'save']
                }
            };
        } else if (req.session.user.role_id.role == 'district_editor') {
            data = {
                language: 'en',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'publish']
                }
            };
        } else {
            data = {
                language: 'en',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'save', 'publish']
                },
                addedBy: mongoose.Types.ObjectId(req.session.user._id)
            };
        }
    } else {
        if (req.session.user.role_id.role == 'administrator') {
            data = {
                language: 'en',
                post_status: {
                    $in: ['publish_approval', 'publish', 'save']
                }
            };
        } else if (req.session.user.role_id.role == 'district_editor') {
            data = {
                language: 'en',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'publish']
                }
            };
        } else {
            data = {
                language: 'en',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'save', 'publish']
                },
                addedBy: mongoose.Types.ObjectId(req.session.user._id)
            };
        }
    }

    if (req.body.date) {
        data.post_date = req.body.date;
    }
    if (req.body.username) {
        dataModel.users.find({
            email: new RegExp(req.params.username, "i")
        }).limit(1).exec(function(err, user) {
            console.log(user);
            data.addedBy = user[0]._id;
            console.log(data);
            dataModel.posts.find(data).populate({
                path: 'addedBy'
            }).exec(function(err, posts) {
                //console.log(categories);
                var total = [];
                if (req.session.user.role_id.role == 'district_editor') {
                    posts.forEach(function(dd) {
                        if (req.session.user.state == dd.addedBy.state && req.session.user.district == dd.addedBy.district) {
                            total.push(dd);
                        }
                    });

                    res.render(template.mcp + '/posts', {
                        title: 'mcp | POSTS',
                        lang: 'en',
                        posts: total
                    });
                } else {
                    res.render(template.mcp + '/posts', {
                        title: 'mcp | POSTS',
                        lang: 'en',
                        posts: posts
                    });
                }
            });
        });
    } else {
        dataModel.posts.find(data).populate({
            path: 'addedBy'
        }).exec(function(err, posts) {
            //console.log(categories);
            var total = [];
            if (req.session.user.role_id.role == 'district_editor') {
                posts.forEach(function(dd) {
                    if (req.session.user.state == dd.addedBy.state && req.session.user.district == dd.addedBy.district) {
                        total.push(dd);
                    }
                });

                res.render(template.mcp + '/posts', {
                    title: 'mcp | POSTS',
                    lang: 'en',
                    posts: total
                });
            } else {
                res.render(template.mcp + '/posts', {
                    title: 'mcp | POSTS',
                    lang: 'en',
                    posts: posts
                });
            }
        });
    }
});
router.post('/posts/te/search/:id?', function (req, res, next) {
    var data = {};
    //TODO
    if (req.params.id) {
        if (req.session.user.role_id.role == 'administrator') {
            data = {
                language: 'te',
                post_status: {
                    $in: ['publish_approval', 'publish', 'save']
                }
            };
        } else if (req.session.user.role_id.role == 'district_editor') {
            data = {
                language: 'te',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'publish']
                }
            };
        } else {
            data = {
                language: 'te',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'save', 'publish']
                },
                addedBy: mongoose.Types.ObjectId(req.session.user._id)
            };
        }
    } else {
        if (req.session.user.role_id.role == 'administrator') {
            data = {
                language: 'te',
                post_status: {
                    $in: ['publish_approval', 'publish', 'save']
                }
            };
        } else if (req.session.user.role_id.role == 'district_editor') {
            data = {
                language: 'te',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'publish']
                }
            };
        } else {
            data = {
                language: 'te',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'save', 'publish']
                },
                addedBy: mongoose.Types.ObjectId(req.session.user._id)
            };
        }
    }

    if (req.body.date) {
        data.post_date = req.body.date;
    }
    if (req.body.username) {
        dataModel.users.find({
            email: new RegExp(req.params.username, "i")
        }).limit(1).exec(function (err, user) {
            console.log(user);
            data.addedBy = user[0]._id;
            console.log(data);
            dataModel.posts.find(data).populate({
                path: 'addedBy'
            }).exec(function (err, posts) {
                //console.log(categories);
                var total = [];
                if (req.session.user.role_id.role == 'district_editor') {
                    posts.forEach(function (dd) {
                        if (req.session.user.state == dd.addedBy.state && req.session.user.district == dd.addedBy.district) {
                            total.push(dd);
                        }
                    });

                    res.render(template.mcp + '/posts', {
                        title: 'mcp | POSTS',
                        lang: 'te',
                        posts: total
                    });
                } else {
                    res.render(template.mcp + '/posts', {
                        title: 'mcp | POSTS',
                        lang: 'te',
                        posts: posts
                    });
                }
            });
        });
    } else {
        dataModel.posts.find(data).populate({
            path: 'addedBy'
        }).exec(function (err, posts) {
            //console.log(categories);
            var total = [];
            if (req.session.user.role_id.role == 'district_editor') {
                posts.forEach(function (dd) {
                    if (req.session.user.state == dd.addedBy.state && req.session.user.district == dd.addedBy.district) {
                        total.push(dd);
                    }
                });

                res.render(template.mcp + '/posts', {
                    title: 'mcp | POSTS',
                    lang: 'te',
                    posts: total
                });
            } else {
                res.render(template.mcp + '/posts', {
                    title: 'mcp | POSTS',
                    lang: 'te',
                    posts: posts
                });
            }
        });
    }



});

/* languages */
router.get('/posts/en/:id?', function(req, res, next) {
    var data = {};
    //TODO
    if (req.params.id) {
        if (req.session.user.role_id.role == 'administrator') {
            data = {
                post_date: req.params.id,
                language: 'en',
                post_status: {
                    $in: ['publish_approval', 'publish', 'save']
                }
            };
        } else if (req.session.user.role_id.role == 'district_editor') {
            data = {
                post_date: req.params.id,
                language: 'en',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'publish']
                }
            };
        } else {
            data = {
                post_date: req.params.id,
                language: 'en',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'save', 'publish']
                },
                addedBy: mongoose.Types.ObjectId(req.session.user._id)
            };
        }
    } else {
        if (req.session.user.role_id.role == 'administrator') {
            data = {
                language: 'en',
                post_status: {
                    $in: ['publish_approval', 'publish', 'save']
                }
            };
        } else if (req.session.user.role_id.role == 'district_editor') {
            data = {
                language: 'en',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'publish']
                }
            };
        } else {
            data = {
                language: 'en',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'save', 'publish']
                },
                addedBy: mongoose.Types.ObjectId(req.session.user._id)
            };
        }
    }

    dataModel.posts.find(data).sort({
            'updatedOn': 'desc'
        }).populate({
        path: 'addedBy'
    }).exec(function (err, posts) {
        //console.log(categories);
        var total = [];
        if (req.session.user.role_id.role == 'district_editor') {
            posts.forEach(function(dd) {
                if (req.session.user.state == dd.addedBy.state && req.session.user.district == dd.addedBy.district) {
                    total.push(dd);
                }
            });

            res.render(template.mcp + '/posts', {
                title: 'mcp | POSTS',
                lang: 'en',
                posts: total
            });
        } else {
            res.render(template.mcp + '/posts', {
                title: 'mcp | POSTS',
                lang: 'en',
                posts: posts
            });
        }
    });
});

router.get('/posts/te', function(req, res, next) {
    var data = {};
    if (req.params.id) {
        if (req.session.user.role_id.role == 'administrator') {
            data = {
                post_date: req.params.id,
                language: 'te',
                post_status: {
                    $in: ['publish_approval', 'publish', 'save']
                }
            };
        } else if (req.session.user.role_id.role == 'district_editor') {
            data = {
                post_date: req.params.id,
                language: 'te',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'publish']
                }
            };
        } else {
            data = {
                post_date: req.params.id,
                language: 'te',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'save', 'publish']
                },
                addedBy: mongoose.Types.ObjectId(req.session.user._id)
            };
        }
    } else {
        if (req.session.user.role_id.role == 'administrator') {
            data = {
                language: 'te',
                post_status: {
                    $in: ['publish_approval', 'publish', 'save']
                }
            };
        } else if (req.session.user.role_id.role == 'district_editor') {
            data = {
                language: 'te',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'publish']
                }
            };
        } else {
            data = {
                language: 'te',
                post_status: {
                    $in: ['pending_approval', 'publish_approval', 'save', 'publish']
                },
                addedBy: mongoose.Types.ObjectId(req.session.user._id)
            };
        }
    }
    dataModel.posts.find(data).sort({'updatedOn': 'desc'}).populate({
        path: 'addedBy'
    }).exec(function (err, posts) {
        //console.log(categories);
        var total = [];
        if (req.session.user.role_id.role == 'district_editor') {
            posts.forEach(function(dd) {
                if (req.session.user.state == dd.addedBy.state && req.session.user.district == dd.addedBy.district) {
                    total.push(dd);
                }
            });

            res.render(template.mcp + '/posts', {
                title: 'mcp | POSTS',
                lang: 'te',
                posts: total
            });
        } else {
            res.render(template.mcp + '/posts', {
                title: 'mcp | POSTS',
                lang: 'te',
                posts: posts
            });
        }
    });
});

// get Edit & Add posts
router.get('/postEdit/en/:id?', function(req, res, next) {
    if (req.params.id) {
        dataModel.posts.find({
            _id: mongoose.Types.ObjectId(req.params.id)
        }).populate('category_id').exec(function(err, post) {
            dataModel.categories.find({
                language: 'en',
                isActive: 'true'
            }, function(err, categories) {
				var getOptions = '<option disabled selected>Options..</option>';
                categories.forEach(function(cat) {
                    if (post[0].category_id && post[0].category_id._id.toString() == cat._id.toString()) {
                        getOptions += '<option value="' + cat._id + '"' + 'selected' + '>' + cat.category + '</option>';
                    } else {
                        getOptions += '<option value="' + cat._id + '">' + cat.category + '</option>';
                    }
				});

				if (post[0].category_id && post[0].category_id.isActive !== 'true') {
					getOptions += '<option disabled selected value="' + post[0].category_id + '"' + 'selected' + '>' + post[0].category_id.category + '</option>';
				}

                let feature_post = post[0].feature_post ? true : false;

                res.render(template.mcp + '/postEdit', {
                    title: 'mcp | POST EDIT',
                    post: post,
                    lang: 'en',
                    categories: getOptions,
                    feature_post: feature_post,
                    idstatus:'edit'
                });
            });

        });
    } else {
        dataModel.categories.find({
            language: 'en',
            isActive: 'true'
        }, function(err, categories) {

            var getOptions = '<option disabled selected>Options..</option>';
            categories.forEach(function(cat) {
                getOptions += '<option value="' + cat._id + '">' + cat.category + '</option>';
            });

            res.render(template.mcp + '/postEdit', {
                title: 'mcp | POST EDIT',
                categories: getOptions,
                feature_post: false,
                lang: 'en',
                idstatus: 'new'
            });
        });
    }
});

router.get('/postEdit/te/:id?', function(req, res, next) {
    if (req.params.id) {
        dataModel.posts.find({
            _id: mongoose.Types.ObjectId(req.params.id)
        }).populate('category_id').exec(function(err, post) {
            dataModel.categories.find({
                language: 'te',
                isActive: 'true'
            }, function(err, categories) {
                var getOptions = '<option disabled selected>Options..</option>';
                console.log(post);
                categories.forEach(function(cat) {
                    if (post[0].category_id._id.toString() == cat._id.toString()) {
                        getOptions += '<option value="' + cat._id + '"' + 'selected' + '>' + cat.category + '</option>';
                    } else {
                        getOptions += '<option value="' + cat._id + '">' + cat.category + '</option>';
                    }
				});
				
				if (post[0].category_id && post[0].category_id.isActive !== 'true') {
					getOptions += '<option disabled selected value="' + post[0].category_id + '"' + 'selected' + '>' + post[0].category_id.category + '</option>';
				}

                let feature_post = post[0].feature_post ? true : false;
                res.render(template.mcp + '/postEdit', {
                    title: 'mcp | POST EDIT',
                    post: post,
                    lang: 'te',
                    categories: getOptions,
                    feature_post: feature_post,
                    idstatus: 'edit'
                });
            });

        });
    } else {
        dataModel.categories.find({
            language: 'te',
            isActive: 'true'
        }, function(err, categories) {
            var getOptions = '<option disabled selected>Options..</option>';
            categories.forEach(function(cat) {
                getOptions += '<option value="' + cat._id + '">' + cat.category + '</option>';
            });

            res.render(template.mcp + '/postEdit', {
                title: 'mcp | POST EDIT',
                categories: getOptions,
                feature_post: false,
                lang: 'te',
                idstatus: 'new'
            });
        });
    }
});


// save posts
router.post('/postEdit/te/:id?', function(req, res, next) {
var vCode = '';
if (req.body.video_link) {
    var videoCode = req.body.video_link;
    videoCode = videoCode.split("=");
    vCode = videoCode[1];
}
    var data = {
        title: req.body.title ? req.body.title : '',
        content: req.body.descr ? req.body.descr : '',
        excerpt: req.body.excerpt ? req.body.excerpt : '',
        video_link: req.body.video_link ? vCode : '',
        feature_image: req.body.feature_image ? req.body.feature_image : '',
        feature_post: req.body.feature_post ? true : false,
        language: 'te',
        slug: req.body.slug ? req.body.slug.trim() : ''
    };
    if (req.body.postdate){
        data.post_date = req.body.postdate;
    }
    if (req.body.category){
        data.category_id = mongoose.Types.ObjectId(req.body.category) ;
    }

    if (req.session.user.role_id.role == 'administrator') {
        data.post_status = 'publish';
    } else if (req.body.post_status.trim() == 'Send for approval') {
        data.post_status = 'pending_approval';
    } else if (req.body.post_status.trim() == 'Send for publish approval') {
        data.post_status = 'publish_approval';
    } else if (req.body.post_status.trim() == 'Save Post') {
        //post_status =  'save';
    } else if (req.body.post_status.trim() == 'Publish') {
        data.post_status = 'publish';
    }
    console.log(data);


    if (req.body.id == 'new') {
        console.log(req.body.id, " ------------ if");

        data.addedBy = mongoose.Types.ObjectId(req.session.user._id);
        //data.post_status =  'save';
        if (req.body.post_status.trim() == 'Save Post') {
            data.post_status = 'save';
        }
        var post = new dataModel.posts(data);

        post.save(function(err, single) {
            if (err) return handleError(err);
            res.redirect('/mcp/posts/te/');
        });

    } else {
        console.log(req.body.id, req.body.postid," ------------ else");

        dataModel.posts.findOneAndUpdate({
            _id: req.body.postid
        }, data, function(err, doc) {
            if (err) return handleError(err);
            //console.log(doc);
            res.redirect('/mcp/posts/te/');
        });

    }
});


router.post('/postEdit/en/:id?', function(req, res, next) {
    //https://www.youtube.com/watch?v=NzK1AKg41ZE
    var vCode='';
   if (req.body.video_link) {
        var videoCode = req.body.video_link;
        videoCode = videoCode.split("=");
        vCode = videoCode[1];
    }
    var data = {
        title: req.body.title ? req.body.title : '',
        content: req.body.descr ? req.body.descr : '',
        excerpt: req.body.excerpt ? req.body.excerpt : '',
        video_link: req.body.video_link ? vCode : '',
        feature_image: req.body.feature_image ? req.body.feature_image : '',
        feature_post: req.body.feature_post ? true : false,
        category_id: req.body.category ? mongoose.Types.ObjectId(req.body.category) : mongoose.Types.ObjectId(),
        language: 'en',
        slug: req.body.slug ? req.body.slug.trim() : '',
        post_date: req.body.postdate
    };
     if (req.session.user.role_id.role == 'administrator' && req.body.post_status.trim() == 'Save Post') {
        data.post_status = 'save';
    } if (req.session.user.role_id.role == 'administrator' && req.body.post_status.trim() == 'Publish') {
        data.post_status = 'publish';
     } else if (req.body.post_status.trim() == 'Send for approval') {
        data.post_status = 'pending_approval';
    } else if (req.body.post_status.trim() == 'Send for publish approval') {
        data.post_status = 'publish_approval';
    } else if (req.body.post_status.trim() == 'Save Post') {
        post_status =  'save';
    } else if (req.body.post_status.trim() == 'Publish') {
        data.post_status = 'publish';
    }

console.log(data);
    if (req.body.id == 'new') {
        console.log(req.body.id, " ------------ if");

        data.addedBy = mongoose.Types.ObjectId(req.session.user._id);
        //data.post_status =  'save';
        if (req.body.post_status.trim() == 'Save Post') {
            data.post_status = 'save';
        }

        var post = new dataModel.posts(data);

        post.save(function(err, single) {
            if (err) return handleError(err);
            res.redirect('/mcp/posts/en/');
        });

    } else {

        console.log(req.body.id, req.body.postid, " ------------ else");
        dataModel.posts.findOneAndUpdate({
            _id: req.body.postid
        }, data, function(err, doc) {
            if (err) return handleError(err);
            //console.log(doc);
            res.redirect('/mcp/posts/en/');
        });

    }
});



/* Deleting things */
router.get('/posts/te/delete/:id?', function(req, res, next) {
    dataModel.posts.findOneAndRemove({
        _id: mongoose.Types.ObjectId(req.params.id)
    }, function(err, id) {
        if (err) return handleError(err);
        res.redirect('/mcp/posts/te');
    });
});

router.get('/posts/en/delete/:id?', function(req, res, next) {
    dataModel.posts.findOneAndRemove({
        _id: mongoose.Types.ObjectId(req.params.id)
    }, function(err, id) {
        if (err) return handleError(err);
        res.redirect('/mcp/posts/en');
    });
});

router.get('/global/en', function(req, res, next) {
    var data = {
        language: 'en',
        post_status: {
            $in: ['pending_approval', 'publish_approval', 'save', 'publish']
        }
    };
    dataModel.posts.find(data).populate({path: 'addedBy'}).exec(function(err, posts) {
       // dataModel.users.find({id: posts.addedBy}).exec(function (err, user) {
            //console.log(categories);
           // var total = [];
            //if (req.session.user.role_id.role != '') {
            /*    posts.forEach(function (dd) {
                   if (req.session.user.state == dd.addedBy.state && req.session.user.district == dd.addedBy.district) {
                        total.push(dd);
                    } 
                    console.log(dd.addedBy);
                }); */
             //
             
             //console.log(posts[0].addedBy.state);
                
                res.render(template.mcp + '/posts', {
                    title: 'mcp | POSTS',
                    lang: 'en',
                    posts: posts
                });
           /*  } else {
                res.render(template.mcp + '/posts', {
                    title: 'mcp | POSTS',
                    lang: 'en',
                    posts: posts,
                    user: user
                });
            } */
       // });
    });
});

router.get('/global/te', function(req, res, next) {
    var data = {
        language: 'te',
        post_status: {
            $in: ['pending_approval', 'publish_approval', 'save', 'publish']
        }
    };
    dataModel.posts.find(data).populate({
        path: 'addedBy'
    }).exec(function(err, posts) {
       // var total = [];
        //if (req.session.user.role_id.role != '') {
           /*  posts.forEach(function(dd) {
                if (req.session.user.state == dd.addedBy.state && req.session.user.district == dd.addedBy.district) {
                    total.push(dd);
                }
            }); */
            res.render(template.mcp + '/posts', {
                title: 'mcp | POSTS',
                lang: 'te',
                posts: posts
            });
       // } 
       /* else {
            res.render(template.mcp + '/posts', {
                title: 'mcp | POSTS',
                lang: 'te',
                posts: posts
            });
        } */
    });
});

module.exports = router;