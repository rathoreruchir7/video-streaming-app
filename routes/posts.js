var express = require('express');
var postRouter = express.Router();
const bodyParser = require('body-parser');
var Post = require('../models/post');
var passport = require('passport');
var authenticate = require('../authenticate');

postRouter.use(bodyParser.json());
/* GET users listing. */
postRouter.get('/',authenticate.verifyUser, function(req, res, next) {
    Post.find({}).sort({ date: -1})
    .populate('user')
    .then((posts) => {
      res.statusCode=200;
      res.setHeader("Content-Type", "application/json");
      console.log(posts)
      res.json(posts);
    }, (err) => 
      next(err))
    .catch((err) => next(err));
});

postRouter.post('/', authenticate.verifyUser, (req, res, next) => {
    Post.create(req.body)
    .then((post) => {
        console.log('Post Created ', post);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})

// postRouter.get('/:country', authenticate.verifyUser, (req, res, next) => {
//     Post.find({ location: req.params.country })
//     .populate('user')
//     .then((posts) => {
//       res.statusCode=200;
//       res.setHeader("Content-Type", "application/json");
//       res.json(posts);
//     }, (err) => 
//       next(err))
//     .catch((err) => next(err));
// })

/***************************Post Id****************** */
postRouter.route('/:postId')
.get(authenticate.verifyUser, (req, res, next) => {
    console.log("POST_D=> ",req.params.postId)
  Post.find({ _id: req.params.postId })
  .populate('user')
  .populate('comments.author')
  .then((post) => {
    res.statusCode = 200;
    console.log("POST->", post)
    res.setHeader('Content-Type', 'application/json');
    res.json(post);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  res.statusCode = 403;
  res.end('POST operation not suppoerted on /posts/'
          + req.params.postId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  Post.findByIdAndUpdate(req.params.postId, {
      $set: req.body
  }, { new: true })
  .then((post) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(post);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  Post.findByIdAndRemove(req.params.postId)
  .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

/*****************************Post Comments*************************** */
postRouter.route('/:postId/comments')
.get((req,res,next) => {
  Post.findById(req.params.postId)
  .populate('comments.author')
  .then((post) => {
      if (post != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(post.comments);
      }
      else {
          err = new Error('Post ' + req.params.postId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
  Post.findById(req.params.postId)
  .then((post) => {
      if (post != null) {
          req.body.author = req.user._id;
          post.comments.push(req.body);
          post.save()
          .then((post) => {
              Post.findById(post._id)
              .populate('comments.author')
              .then((post) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(post);
              })            
          }, (err) => next(err));
      }
      else {
          err = new Error('Post ' + req.params.postId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /posts/'
      + req.params.postId + '/comments');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Post.findById(req.params.postId)
  .then((post) => {
      if (post != null) {
          for (var i = (post.comments.length -1); i >= 0; i--) {
              post.comments.id(post.comments[i]._id).remove();
          }
          post.save()
          .then((post) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(post);                
          }, (err) => next(err));
      }
      else {
          err = new Error('Post ' + req.params.postId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));    
});


/*****************************Post Comment Id **********************/
postRouter.route('/:postId/comments/:commentId')
.get((req,res,next) => {
    Post.findById(req.params.postId)
    .populate('comments.author')    
    .then((post) => {
        if (post != null && post.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.comments.id(req.params.commentId));
        }
        else if (post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /posts/'+ req.params.postId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Post.findById(req.params.postId)
    .then((post) => {
        if (post != null && post.comments.id(req.params.commentId) != null) {
            console.log("User: " + req.user);
            if(req.user._id.equals(post.comments.id(req.params.commentId).author))
           { 
            // if (req.body.rating) {
            //     post.comments.id(req.params.commentId).rating = req.body.rating;
            // }
            if (req.body.comment) {
                post.comments.id(req.params.commentId).comment = req.body.comment;                
            }

            post.save()
            .then((post) => {
                Post.findById(post._id)
                .populate('comments.author')
                .then((post) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post);  
                })              
            }, (err) => next(err));
          }
          else
          {
             var err = new Error("You are not authorised to update comment");
             err.status = 401;
             next(err);
          }
        }
        else if (post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Post.findById(req.params.postId)
    .then((post) => {
        if (post != null && post.comments.id(req.params.commentId) != null) {
            if(req.user._id.equals(post.comments.id(req.params.commentId).author)){
            
            post.comments.id(req.params.commentId).remove();
            post.save()
            .then((post) => {
                Post.findById(post._id)
                .populate('comments.author')
                .then((post) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post);  
                })               
            }, (err) => next(err));
        }
        else
        {   console.log("yyyyy");
            var err = new Error("You are not allowed to Delete the comment");
            err.status = 401;
            next(err);
        }
    }
        else if (post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});



/******************Post Likes************************ */
postRouter.route('/:postId/likes')
.get((req,res,next) => {
  Post.findById(req.params.postId)
  .populate('likes.author')
  .then((post) => {
      if (post != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(post.likes);
      }
      else {
          err = new Error('Post ' + req.params.postId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
  Post.findById(req.params.postId)
  .then((post) => {
      if (post != null) {
          req.body.author = req.user._id;
          post.likes.push(req.body);
          post.save()
          .then((post) => {
              Post.findById(post._id)
              .populate('likes.author')
              .then((post) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(post);
              })            
          }, (err) => next(err));
      }
      else {
          err = new Error('Post ' + req.params.postId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /posts/'
      + req.params.postId + '/likes');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Post.findById(req.params.postId)
  .then((post) => {
      if (post != null) {
          for (var i = (post.comments.length -1); i >= 0; i--) {
              post.likes.id(post.likes[i]._id).remove();
          }
          post.save()
          .then((post) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(post);                
          }, (err) => next(err));
      }
      else {
          err = new Error('Post ' + req.params.postId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));    
});



module.exports = postRouter