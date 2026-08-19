const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {}

  Submission.init(
    {
      assignmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      fileUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      grade: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Submission',
    },
  );

  return Submission;
};
