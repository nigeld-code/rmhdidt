module.exports.types = `
  type Post {
    _id: ID!
    author: User!
    topic: Topic!
    order: Int!
    title: String!
    content: String
    createdAt: String
    updatedAt: String
  }
`;

module.exports.inputs = `
  input PostInput {
    topic: String!
    title: String!
  }

  input IncrementOrderInput {
    postId: String!
    increment: Boolean!
  }

  input UpdateTitleInput {
    id: String
    editedTitle: String
  }

  input SavePostEditInput {
    postId: String
    htmlString: String
  }
`;

module.exports.query = `
  loadPost(id: ID!): Post
`;

module.exports.mutation = `
  createPost(postInput: PostInput): Post
  deletePost(id: ID!): Post
  incrementOrder(incrementOrderInput: IncrementOrderInput): Post
  updateChapterTitle(updateTitleInput: UpdateTitleInput): Post
  savePostEdit(savePostEditInput: SavePostEditInput): Post
`;
