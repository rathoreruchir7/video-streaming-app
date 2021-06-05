const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var commentSchema = new Schema({
  
  comment:  {
      type: String,
      required: true
  },
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }
}, {
  timestamps: true
});

var likeSchema = new Schema({
  
  like:  {
      type: Boolean,
      required: false
  },
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }
}, {
  timestamps: true
});



var Post = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    userName: {
        type: String,
        default: ''
    },

    video: {
      type: String,
        default: ''
    },
    text:   {
        type: String,
        default: ''
    },
    location: {
      type: String,
      default: ""
  },
  date: {
    type: Date,
    default: ""
  },

  comments:[commentSchema],
  likes: [likeSchema]

});


module.exports = mongoose.model('Post', Post);
