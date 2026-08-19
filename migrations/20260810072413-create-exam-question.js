'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ExamQuestions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      examId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Exams',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      optionA: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      optionB: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      optionC: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      optionD: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      correctAnswer: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      marks: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ExamQuestions');
  },
};
