const { Student, Course, Department, Enrollment } = require('../models');

const getStats = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const totalCourses = await Course.count();
    const totalDepartments = await Department.count();
    const totalEnrollments = await Enrollment.count();

    res.json({
      totalStudents,
      totalCourses,
      totalDepartments,
      totalEnrollments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getStudentsPerDepartment = async (req, res) => {
  try {
    const stats = await Department.findAll({
      attributes: [
        'id',
        'name',
        [
          require('sequelize').fn(
            'COUNT',
            require('sequelize').col('Students.id'),
          ),
          'studentCount',
        ],
      ],
      include: [
        {
          model: Student,
          attributes: [],
        },
      ],
      group: ['Department.id'],
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getCoursesPerDepartment = async (req, res) => {
  try {
    const stats = await Department.findAll({
      attributes: [
        'id',
        'name',
        [
          require('sequelize').fn(
            'COUNT',
            require('sequelize').col('Courses.id'),
          ),
          'courseCount',
        ],
      ],

      include: [
        {
          model: Course,
          attributes: [],
        },
      ],

      group: ['Department.id'],
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getStats,
  getStudentsPerDepartment,
  getCoursesPerDepartment,
};
