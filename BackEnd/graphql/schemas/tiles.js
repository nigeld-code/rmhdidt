module.exports.types = `
  type Tile {
    _id: ID!
    order: Int
    title: String!
    tileImage: String
    leftWallColor: String
    rightWallColor: String
    xPos: String
    yPos: String
    scale: String
    topics: [Topic!]
  }
`;

module.exports.inputs = `

`;

module.exports.query = `
  tiles: [Tile!]!
  tile(id: ID!): Tile! 
`;

module.exports.mutation = `

`;
