const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const Post = require('../../models/post');
const Topic = require('../../models/topic');
const User = require('../../models/user');

module.exports = {
  loadPost: args => {
    return Post.findById(args.id)
      .then(post => {
        if (!post) {
          throw new Error('No Post Found');
        }
        return post;
      })
      .catch(err => {
        throw err;
      });
  },
  createPost: (args, req) => {
    if (!req.isAuth) {
      const error = new Error('You must be logged in to create a new post');
      error.code = 401;
      throw error;
    }
    let parentTopic, currentPost;
    return Topic.findOne({
      _id: mongoose.Types.ObjectId(args.postInput.topic)
    })
      .then(topic => {
        if (!topic) {
          const error = new Error(
            'Failed to create new Post in Topic, as the Topic could not be found'
          );
          error.code = 401;
          throw error;
        }
        parentTopic = topic;
        const newPost = new Post({
          author: mongoose.Types.ObjectId(req.userId),
          topic: mongoose.Types.ObjectId(topic._id),
          order: topic.posts.length + 1,
          title: args.postInput.title,
          content: ''
        });
        return newPost.save();
      })
      .then(post => {
        currentPost = post;
        parentTopic.posts.push(post);
        return parentTopic.save();
      })
      .then(() => {
        return User.findById(req.userId);
      })
      .then(user => {
        if (!user) {
          const error = new Error(
            'Error: User could not be found to connect chapter'
          );
          error.code = 401;
          throw error;
        }
        user.posts.push(currentPost);
        return user.save();
      })
      .then(() => {
        return {
          ...currentPost._doc,
          createdAt: currentPost.createdAt.toString(),
          updatedAt: currentPost.updatedAt.toString()
        };
      })
      .catch(err => {
        throw err;
      });
  },
  deletePost: (args, req) => {
    if (!req.isAuth) {
      const error = new Error('You must be logged in to delete a post');
      error.code = 401;
      throw error;
    }
    let topicId, postId;
    return Post.findById(args.id)
      .then(post => {
        if (!post) {
          const error = new Error('Error: Failed to find post in DB');
          error.code = 401;
          throw error;
        }
        if (post.author.toString() !== req.userId) {
          const error = new Error(
            'Incorrect User: User can only delete their own posts'
          );
          error.code = 401;
          throw error;
        }
        postId = post;
        topicId = post.topic;
        return Post.deleteOne({ _id: mongoose.Types.ObjectId(args.id) });
      })
      .then(res => {
        if (!res) {
          const error = new Error('Error: Failed to delete post');
          error.code = 401;
          throw error;
        }
        return Topic.findOne({
          _id: mongoose.Types.ObjectId(topicId)
        }).populate('posts');
      })
      .then(topic => {
        if (!topic) {
          const error = new Error('Error: Failed to find topic in DB');
          error.code = 401;
          throw error;
        }
        topic.posts.sort((a, b) => {
          if (a.order > b.order) {
            return 1;
          } else {
            return -1;
          }
        });
        topic.posts.pull({ _id: postId._id });
        const postArray = [];
        topic.posts.forEach((thisPost, index) => {
          if (thisPost.order !== index + 1) {
            postArray.push(
              Post.findByIdAndUpdate(thisPost._id, {
                $set: { order: index + 1 }
              }).then(res => {
                if (!res) {
                  const error = new Error('Failed to adjust order values');
                  error.code = 401;
                  throw error;
                }
                return res;
              })
            );
          }
        });
        Promise.all(postArray)
          .then(result => {
            if (!result) {
              const error = new Error('Failed to adjust order values');
              error.code = 401;
              throw error;
            }
          })
          .catch(err => {
            throw err;
          });
        return topic.save();
      })
      .then(result => {
        if (!result) {
          const error = new Error(
            'Failed to save topic after attempting to delete post'
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
        user.posts.pull({ _id: postId._id });
        return user.save();
      })
      .then(result => {
        if (!result) {
          const error = new Error(
            'Failed to save user after attempting to delete post'
          );
          error.code = 401;
          throw error;
        }
        return postId;
      })
      .catch(err => {
        throw err;
      });
  },
  incrementOrder: (args, req) => {
    if (!req.isAuth) {
      const error = new Error('You must be logged into to adjust order');
      error = 401;
      throw error;
    }
    let selectedPost;
    return Post.findById(
      mongoose.Types.ObjectId(args.incrementOrderInput.postId)
    )
      .then(post => {
        if (!post) {
          const error = new Error('Error: Failed to find post in DB');
          error.code = 401;
          throw error;
        }
        if (post.author.toString() !== req.userId) {
          const error = new Error(
            'Incorrect User: User can only change order of their own posts'
          );
          error.code = 401;
          throw error;
        }
        selectedPost = post;
        return Topic.findById(post.topic._id).populate('posts');
      })
      .then(topic => {
        if (!topic) {
          const error = new Error('Error: Topic for Post not found in DB');
          error.code = 401;
          throw error;
        }
        const otherPost = topic.posts.find(thisPost => {
          if (args.incrementOrderInput.increment) {
            return thisPost.order == selectedPost.order - 1;
          } else {
            return thisPost.order == selectedPost.order + 1;
          }
        });
        return Post.findByIdAndUpdate(otherPost._id, {
          $set: {
            order: args.incrementOrderInput.increment
              ? otherPost.order + 1
              : otherPost.order - 1
          }
        });
      })
      .then(() => {
        selectedPost.order = args.incrementOrderInput.increment
          ? selectedPost.order - 1
          : selectedPost.order + 1;
        return selectedPost.save();
      })
      .then(res => {
        if (!res) {
          const error = new Error('Failed to change order of selected chapter');
          error.code = 401;
          throw error;
        }
        return res;
      })
      .catch(err => {
        throw err;
      });
  },
  updateChapterTitle: (args, req) => {
    if (!req.isAuth) {
      const error = new Error('You must be logged in to edit Chapter Title');
      error.code = 401;
      throw error;
    }
    return Post.findById(mongoose.Types.ObjectId(args.updateTitleInput.id))
      .then(post => {
        if (!post) {
          const error = new Error('Failed to find post in DB');
          error.code = 401;
          throw error;
        }
        if (post.author.toString() !== req.userId) {
          const error = new Error(
            'Incorrect User: User can only edit their own posts'
          );
          error.code = 401;
          throw error;
        }
        post.title = args.updateTitleInput.editedTitle;
        return post.save();
      })
      .then(res => {
        if (!res) {
          const error = new Error('Failed to update post title');
          error.code = 401;
          throw error;
        }
        return res;
      })
      .catch(err => {
        throw err;
      });
  },
  savePostEdit: (args, req) => {
    if (!req.isAuth) {
      const error = new Error('You must be logged in to save Chapter contents');
      error.code = 401;
      throw error;
    }
    return Post.findById(mongoose.Types.ObjectId(args.savePostEditInput.postId))
      .then(post => {
        if (!post) {
          const error = new Error('Failed to find post in DB');
          error.code = 401;
          throw error;
        }
        if (post.author.toString() !== req.userId) {
          const error = new Error(
            'Incorrect User: User can only edit their own posts'
          );
          error.code == 401;
          throw error;
        }
        post.content = sanitizeHtml(args.savePostEditInput.htmlString, {
          allowedTags: [
            'p',
            'h1',
            'h2',
            'h3',
            'strong',
            'u',
            'em',
            's',
            'sub',
            'sup',
            'span',
            'pre',
            'code',
            'a',
            'hr',
            'br',
            'ul',
            'ol',
            'li',
            'table',
            'tbody',
            'tr',
            'td'
          ],
          disallowedTagsMode: 'discard',
          allowedAttributes: {
            span: ['data-text-color', 'data-text-highlight'],
            code: ['data-code-language'],
            pre: ['data-code-language'],
            a: ['href', 'rel'],
            td: ['colspan', 'rowspan'],
            ol: ['data-list-type']
          },
          exclusiveFilter: (frame) => {
            return frame.tag === 'a' && !frame.text.trim();
          } 
        });
        return post.save();
      })
      .then(res => {
        if (!res) {
          const error = new Error('Failed to update post content');
          error.code = 401;
          throw error;
        }
        return res;
      })
      .catch(err => {
        throw err;
      });
  }
};
