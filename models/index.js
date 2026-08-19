'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

// Load all models
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );

    db[model.name] = model;
  });

// Run model-level associations if they exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ======================================================
// EXISTING RELATIONSHIPS
// ======================================================

// Department ↔ Course
db.Department.hasMany(db.Course, {
  foreignKey: 'departmentId',
});

db.Course.belongsTo(db.Department, {
  foreignKey: 'departmentId',
});

// Department ↔ Student
db.Department.hasMany(db.Student, {
  foreignKey: 'departmentId',
});

db.Student.belongsTo(db.Department, {
  foreignKey: 'departmentId',
});

// Student ↔ Course
// Many-to-many through Enrollment
db.Student.belongsToMany(db.Course, {
  through: db.Enrollment,
  foreignKey: 'studentId',
});

db.Course.belongsToMany(db.Student, {
  through: db.Enrollment,
  foreignKey: 'courseId',
});

// Student ↔ Enrollment
db.Student.hasMany(db.Enrollment, {
  foreignKey: 'studentId',
});

db.Enrollment.belongsTo(db.Student, {
  foreignKey: 'studentId',
});

// Course ↔ Enrollment
db.Course.hasMany(db.Enrollment, {
  foreignKey: 'courseId',
});

db.Enrollment.belongsTo(db.Course, {
  foreignKey: 'courseId',
});

// ======================================================
// NEW RELATIONSHIPS
// ======================================================

// Course ↔ Exam
db.Course.hasMany(db.Exam, {
  foreignKey: 'courseId',
});

db.Exam.belongsTo(db.Course, {
  foreignKey: 'courseId',
});

// Exam ↔ ExamQuestion
db.Exam.hasMany(db.ExamQuestion, {
  foreignKey: 'examId',
});

db.ExamQuestion.belongsTo(db.Exam, {
  foreignKey: 'examId',
});

// Course ↔ Assignment
db.Course.hasMany(db.Assignment, {
  foreignKey: 'courseId',
});

db.Assignment.belongsTo(db.Course, {
  foreignKey: 'courseId',
});

// Assignment ↔ Submission
db.Assignment.hasMany(db.Submission, {
  foreignKey: 'assignmentId',
});

db.Submission.belongsTo(db.Assignment, {
  foreignKey: 'assignmentId',
});

// Student ↔ Submission
db.Student.hasMany(db.Submission, {
  foreignKey: 'studentId',
});

db.Submission.belongsTo(db.Student, {
  foreignKey: 'studentId',
});

// Student ↔ Attendance
db.Student.hasMany(db.Attendance, {
  foreignKey: 'studentId',
});

db.Attendance.belongsTo(db.Student, {
  foreignKey: 'studentId',
});

// Course ↔ Attendance
db.Course.hasMany(db.Attendance, {
  foreignKey: 'courseId',
});

db.Attendance.belongsTo(db.Course, {
  foreignKey: 'courseId',
});

// Student ↔ Invoice
db.Student.hasMany(db.Invoice, {
  foreignKey: 'studentId',
});

db.Invoice.belongsTo(db.Student, {
  foreignKey: 'studentId',
});

// ======================================================

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
