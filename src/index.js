import express from 'express';
import cors from 'cors';
import uuidv4 from 'uuid/v4';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();
app.use(cors());

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    userId: ID!
    user: User!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Boolean!
  }
`;

const users = {
  1: {
    id: '1',
    username: 'Ryan Yogan',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'Ryan Yogan 2',
    messageIds: [2],
  },
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'Hello World 2',
    userId: '2',
  },
};

const resolvers = {
  Query: {
    me: (_, __, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => Object.values(users),
    messages: () => Object.values(messages),
    message: (_, { id }) => messages[id],
  },
  User: {
    messages: user =>
      Object.values(messages).filter(message => message.userId === user.id),
  },
  Message: {
    user: message => users[message.userId],
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();

      const message = {
        id,
        text,
        userId: me.id,
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);

      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      messages = otherMessages;

      return true;
    },
    updateMessage: (parent, { id, text }) => {
      const { [id]: message } = messages;

      if (!message) {
        return false;
      }

      messages[id].text = text;

      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log(`Apollo Server on http://localhost:8000/graphql`); // eslint-disable-line
});
