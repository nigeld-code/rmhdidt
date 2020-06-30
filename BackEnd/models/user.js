const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    topics: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
      }
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],
    history: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    ]
  }
);

module.exports = mongoose.model('User', userSchema);