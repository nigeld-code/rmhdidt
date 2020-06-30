module.exports.types = `
  type Topic {
    _id: ID!
    author: User!
    tile: Tile!
    title: String!
    posts: [Post!]
    createdAt: String
    updatedAt: String
  }
`;

module.exports.inputs = `
  input TopicInput {
    tile: String!
    title: String!
  }
`;

module.exports.query = `
  topic(id: ID!): Topic!
  topicsForTile(tileId: ID!): [Topic!]
`;

module.exports.mutation = `
  createTopic(topicInput: TopicInput): Topic
  deleteTopic(id: ID!): Topic
  updateTopicTitle(updateTitleInput: UpdateTitleInput): Topic
`;
