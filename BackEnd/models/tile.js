const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tileSchema = new Schema(
  {
    order: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    tileImage: {
      type: String,
      required: true
    },
    leftWallColor: {
      type: String,
      required: true
    },
    rightWallColor: {
      type: String,
      required: true
    },
    xPos: {
      type: String,
      required: true
    },
    yPos: {
      type: String,
      required: true
    },
    scale: {
      type: String,
      required: true
    },
    topics: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
      }
    ]
  }
);

module.exports = mongoose.model('Tile', tileSchema);