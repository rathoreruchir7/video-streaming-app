const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var Post = new Schema({
    User: {
      type: mongoose.Types.ObjectId,
        default: null
    },

    userName: {
        type: String,
        defulat: ''
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
