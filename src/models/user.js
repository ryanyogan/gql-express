const user = (seq, DataTypes) => {
  const User = seq.define('user', {
    username: {
      type: DataTypes.STRING,
    },
  });

  User.associate = models => User.hasMany(models.Message);

  return User;
};

export default user;
