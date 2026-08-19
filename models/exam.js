const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {}

  Exam.init(
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

      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endTime: {
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
      modelName: 'Exam',
    },
  );

  return Exam;
};
