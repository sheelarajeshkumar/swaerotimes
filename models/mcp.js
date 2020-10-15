   // database connect
var mongoose = require('mongoose');
    mongoose.connect('mongodb://mongo_swaerotimes:27017/swaerotimes_db');


    var ObjectId = mongoose.Schema.Types.ObjectId,

        //roles schema
        roleSchema = mongoose.Schema({
                    role:String
            },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        }),

         //language schema
        languageSchema = mongoose.Schema({
                language: String,
                addedBy: ObjectId,
        },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        }),

         //post status schema
        postStatusSchema = mongoose.Schema({
                status: String,
                addedBy: ObjectId,
        },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        }),

        //users schema
        usersSchema = mongoose.Schema({
                email: {
                    type: String,
                    required: true,
                    unique: true
                },
                role_id: { type: ObjectId, ref: 'role' },
                fullname: String,
                phone: String,
                bio: String,
                state: String,
                district: String,
                mandal: String,
                user_image: String,
                password: String,
                status: String,
                addedBy: ObjectId,
        },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        }),

         //district schema
        districtSchema = mongoose.Schema({
                state: String,
                district: {
                    type: String,
                    required: true,
                    unique: true
                },
                addedBy: ObjectId,
        },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        }),

         //mandal schema
        mandalSchema = mongoose.Schema({
                district: String,
                mandal: {
                    type: String,
                    required: true,
                    unique: true
                },
                addedBy: ObjectId,
        },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        }),



        //categories schema
        categoriesSchema = mongoose.Schema({
                category: String,
                slug: String,
                priority: Number,
                language: String,
                isActive: String,
                addedBy: ObjectId,
        },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        }),

        //pages schema
        pagesSchema = mongoose.Schema({
                title: String,
                content: String,
                feature_image: String,
                language: String,
                addedBy: ObjectId,
        },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        }),

        //posts schema
        //added post_date
        postsSchema = mongoose.Schema({
                title: String,
                content: String,
                excerpt: String,
                video_link: String,
                feature_image: String,
                feature_post: Boolean,
                category_id: { type: ObjectId, ref: 'categories' },
                post_status: String,
                status: Boolean,
                language: String,
                slug: String,
                post_date: String,
                addedBy: { type: ObjectId, ref: 'users' },
        },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        });
        
   //menu schema
        menusSchema = mongoose.Schema({
                catpag_id: { type: ObjectId, ref: 'categories' },
                priority: Number,
                language: String,
                addedBy: ObjectId,
        },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        });

    //epaper schema
        epaperSchema = mongoose.Schema({
                epaper_date: String,
                link: String,
                addedBy: ObjectId,
        },
        { 
            timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
        });

        //images schema
        mediaSchema = mongoose.Schema({
            image_name: String,
            lang:String,
            addedBy: {
                    type: ObjectId,
                    ref: 'users'
                }
            },
            {
            timestamps: {
                createdAt: 'addedOn',
                updatedAt: 'updatedOn'
            }
        });

         //epaper schema
         subscribersSchema = mongoose.Schema({
            name: String,
            number: String,
            email: String,
            address: String,
            to:String,
            from:String,
            INR:String,
            addedBy: { type: ObjectId, ref: 'users' },
    },
    { 
        timestamps: { createdAt: 'addedOn',updatedAt: 'updatedOn' } 
    });
        

module.exports = {
        role: mongoose.model('role',roleSchema,'role'),
        language: mongoose.model('language',languageSchema),
        users: mongoose.model('users',usersSchema,'users'),
        categories: mongoose.model('categories',categoriesSchema,'categories'),
        posts: mongoose.model('posts',postsSchema),
        pages: mongoose.model('pages',pagesSchema),
        postStatus: mongoose.model('postStatus',postStatusSchema),
        menus: mongoose.model('menu',menusSchema),
        epaper: mongoose.model('epaper',epaperSchema),
        subscribers: mongoose.model('subscribers',subscribersSchema),
        district: mongoose.model('district',districtSchema),
        mandal: mongoose.model('mandal',mandalSchema),
        media: mongoose.model('media', mediaSchema),
};