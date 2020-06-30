const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
