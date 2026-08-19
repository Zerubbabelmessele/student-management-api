const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {}

  Assignment.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      totalMarks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Assignment',
    },
  );

  return Assignment;
};
