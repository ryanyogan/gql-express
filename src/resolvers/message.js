import uuidv4 from 'uuid/v4';

export default {
  Query: {
    messages: (_, __, { models }) => Object.values(models.messages),

    message: (_, { id }, { models }) => models.messages[id],
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      const id = uuidv4();

      const message = {
        id,
        text,
        userId: me.id,
      };

      models.messages[id] = message; // eslint-disable-line
      models.users[me.id].messageIds.push(id);

      return message;
    },

    deleteMessage: (parent, { id }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages;

      if (!message) {
        return false;
      }

      models.messages = otherMessages; // eslint-disable-line

      return true;
    },

    updateMessage: (parent, { id, text }, { models }) => {
      const { [id]: message } = models.messages;

      if (!message) {
        return false;
      }

      models.messages[id].text = text; // eslint-disable-line

      return true;
    },
  },

  User: {
    messages: (user, _, { models }) =>
      Object.values(models.messages).filter(
        message => message.userId === user.id,
      ),
  },

  Message: {
    user: (message, _, { models }) => models.users[message.userId],
  },
};
