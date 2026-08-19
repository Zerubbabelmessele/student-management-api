const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExamQuestion extends Model {}

  ExamQuestion.init(
    {
      examId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      optionA: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      optionB: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      optionC: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      optionD: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      correctAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      marks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ExamQuestion',
    },
  );

  return ExamQuestion;
};
