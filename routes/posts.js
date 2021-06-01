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

postRouter.get('/:country', authenticate.verifyUser, (req, res, next) => {
    Post.find({ location: req.params.country })
    .populate('user')
    .then((posts) => {
      res.statusCode=200;
      res.setHeader("Content-Type", "application/json");
      res.json(posts);
    }, (err) => 
      next(err))
    .catch((err) => next(err));
})

module.exports = postRouter