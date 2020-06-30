const tileResolver = require('./tiles');
const topicResolver = require('./topic');
const postResolver = require('./post');
const userResolver = require('./users');

const rootResolver = {
  ...tileResolver,
  ...topicResolver,
  ...postResolver,
  ...userResolver
};

module.exports = rootResolver;