const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var Post = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    userName: {
        type: String,
        default: ''
    },

    image: {
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
  }
});


module.exports = mongoose.model('Post', Post);
