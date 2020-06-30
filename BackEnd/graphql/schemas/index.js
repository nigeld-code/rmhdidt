const { buildSchema } = require('graphql');

const tiles = require('./tiles');
const users = require('./users');
const topics = require('./topic');
const posts = require('./post');

module.exports = buildSchema(`
${tiles.types}
${users.types}
${topics.types}
${posts.types}

${tiles.inputs}
${users.inputs}
${topics.inputs}
${posts.inputs}

type RootQuery {
  ${tiles.query}
  ${users.query}
  ${topics.query}
  ${posts.query}
}

type RootMutation {
  ${tiles.mutation}
  ${users.mutation}
  ${topics.mutation}
  ${posts.mutation}
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
