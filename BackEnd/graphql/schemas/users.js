module.exports.types = `
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String
    topics: [Topic!]
    posts: [Post!]
    history: [Post!]
    favorites: [Post!]
  }

  type AuthData {
    userId: ID!
    username: String!
    token: String!
    tokenExpiration: Int!
  }
`;

module.exports.inputs = `
  input UserInput {
    username: String!
    email: String!
    password: String!
    secretPin: String!
  }
`;

module.exports.query = `
  loginUser(email: String!, password: String!): AuthData
`;

module.exports.mutation = `
  createUser(userInput: UserInput): User
`;