'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Attendances', {
      fields: ['studentId', 'courseId', 'date'],
      type: 'unique',
      name: 'unique_student_course_date_attendance',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'Attendances',
      'unique_student_course_date_attendance',
    );
  },
};
