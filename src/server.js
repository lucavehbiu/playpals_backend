const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Your GraphQL schema - the blueprint of your data structure
const typeDefs = gql`
  type Match {
    id: ID!
    title: String!
    date: String!
    location: String!
    currentPlayers: Int!
    maxPlayers: Int!
  }

  type Query {
    matches: [Match!]!
    match(id: ID!): Match
  }

  type Mutation {
    createMatch(title: String!, date: String!, location: String!, maxPlayers: Int!): Match!
  }
`;

// In-memory database - your temporary data sanctuary
let matches = [];

// Resolvers - the logic behind your GraphQL operations
const resolvers = {
  Query: {
    matches: () => matches,
    match: (_, { id }) => matches.find(m => m.id === id),
  },
  Mutation: {
    createMatch: (_, { title, date, location, maxPlayers }) => {
      const match = { 
        id: String(matches.length + 1), 
        title, 
        date, 
        location, 
        maxPlayers, 
        currentPlayers: 0 
      };
      matches.push(match);
      return match;
    },
  },
};

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer();
