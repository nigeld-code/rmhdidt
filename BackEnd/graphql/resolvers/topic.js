const mongoose = require('mongoose');

const Topic = require('../../models/topic');
const Tile = require('../../models/tile');
const User = require('../../models/user');

module.exports = {
  topic: args => {
    return Topic.findById(args.id)
      .populate('posts')
      .then(topic => {
        if (!topic) {
          throw new Error('No Topic Found');
        }
        topic.posts.sort((a, b) => {
          if (a.order > b.order) {
            return 1;
          } else {
            return -1;
          }
        });
        return topic;
      })
      .catch(err => {
        throw err;
      });
  },
  topicsForTile: args => {
    return Tile.findOne({ _id: args.tileId })
      .populate('topics')
      .then(tile => {
        if (!tile) {
          const error = new Error('Cannot find Category');
          error.code = 401;
          throw error;
        }
        return tile.topics;
      })
      .catch(err => {
        throw err;
      });
  },
  createTopic: (args, req) => {
    if (!req.isAuth) {
      const error = new Error('You must be logged in to create a new topic');
      error.code = 401;
      throw error;
    }
    let parentTile, currentTopic;
    return Tile.findOne({ _id: mongoose.Types.ObjectId(args.topicInput.tile) })
      .then(tile => {
        if (!tile) {
          throw new Error(
            'Failed to create new Topic in Tile, as the Tile could not be found'
          );
        }
        parentTile = tile;
        const newTopic = new Topic({
          author: mongoose.Types.ObjectId(req.userId),
          tile: mongoose.Types.ObjectId(tile._id),
          title: args.topicInput.title
        });
        return newTopic.save();
      })
      .then(topic => {
        currentTopic = topic;
        parentTile.topics.push(topic);
        return parentTile.save();
      })
      .then(() => {
        return User.findById(req.userId);
      })
      .then(user => {
        if (!user) {
          const error = new Error('Error: User could not be found to connect topic');
          error.code = 401;
          throw error;
        }
        user.topics.push(currentTopic);
        return user.save();
      })
      .then(() => {
        return {
          ...currentTopic._doc,
          createdAt: currentTopic.createdAt.toString(),
          updatedAt: currentTopic.updatedAt.toString()
        };
      })
      .catch(err => {
        throw err;
      });
  },
  deleteTopic: (args, req) => {
    if (!req.isAuth) {
      const error = new Error('You must be logged in to delete a topic');
      error.code = 401;
      throw error;
    }
    let tileId, topicId;
    return Topic.findOne({
      _id: mongoose.Types.ObjectId(args.id)
    })
      .then(topic => {
        if (!topic) {
          const error = new Error('Error: Failed to find topic in DB');
          error.code = 401;
          throw error;
        }
        if (topic.posts && topic.posts.length !== 0) {
          const error = new Error(
            'Error: Topic must have no chapters to be deleted'
          );
          error.code = 401;
          throw error;
        }
        if (topic.author.toString() !== req.userId) {
          const error = new Error(
            'Incorrect User: User can only delete their own topics'
          );
          error.code = 401;
          throw error;
        }
        topicId = topic;
        tileId = topic.tile;
        return Topic.deleteOne({ _id: mongoose.Types.ObjectId(args.id) });
      })
      .then(res => {
        if (!res) {
          const error = new Error('Error: Failed to delete topic');
          error.code = 401;
          throw error;
        }
        return Tile.findOne({ _id: mongoose.Types.ObjectId(tileId) });
      })
      .then(tile => {
        if (!tile) {
          const error = new Error('Error: Failed to find tile in DB');
          error.code = 401;
          throw error;
        }
        tile.topics.pull({ _id: topicId._id });
        return tile.save();
      })  
      .then(result => {
        if (!result) {
          const error = new Error(
            'Failed to save tile after attempting to delete topic'
          );
          error.code = 401;
          throw error;
        }
        return User.findById(req.userId);
      })
      .then(user => {
        if (!user) {
          const error = new Error('Error: Failed to find user in DB');
          error.code = 401;
          throw error;
        }
        user.topics.pull({ _id: topicId._id });
        return user.save();
      })
      .then(result => {
        if (!result) {
          const error = new Error(
            'Failed to save user after attempting to delete topic'
          );
          error.code = 401;
          throw error;
        }
        return topicId;
      })
      .catch(err => {
        throw err;
      });
  },
  updateTopicTitle: (args, req) => {
    if (!req.isAuth) {
      const error = new Error('You must be logged in to edit Topic Title');
      error.code = 401;
      throw error;
    }
    return Topic.findById(
      mongoose.Types.ObjectId(args.updateTitleInput.id)
    )
      .then(topic => {
        if (!topic) {
          const error = new Error('Failed to find topic in DB');
          error.code = 401;
          throw error;
        }
        if (topic.author.toString() !== req.userId) {
          const error = new Error(
            'Incorrect User: User can only edit their own topics'
          );
          error.code = 401;
          throw error;
        }
        topic.title = args.updateTitleInput.editedTitle;
        return topic.save();
      })
      .then(res => {
        if (!res) {
          const error = new Error('Failed to update topic title');
          error.code = 401;
          throw error;
        }
        return res;
      })
      .catch();
  }
};
