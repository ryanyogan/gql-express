const message = (seq, DataTypes) => {
  const Message = seq.define('message', {
    text: {
      type: DataTypes.STRING,
    },
  });

  Message.associate = models => Message.belongsTo(models.User);

  return Message;
};

export default message;
