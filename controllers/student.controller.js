// const { Student } = require('../models');
// const { Student, Department } = require('../models');
const { Student, Department, Course } = require('../models');
const { Op } = require('sequelize');

const create = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
    };

    if (req.file) {
      studentData.photoUrl = req.file.path;
    }

    const student = await Student.create(studentData);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const offset = (page - 1) * limit;
    const where = {};

    if (req.query.departmentId) {
      where.departmentId = req.query.departmentId;
    }

    if (req.query.search) {
      where[Op.or] = [
        {
          firstName: {
            [Op.like]: `%${req.query.search}%`,
          },
        },
        {
          lastName: {
            [Op.like]: `%${req.query.search}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${req.query.search}%`,
          },
        },
      ];
    }

    const allowedSortFields = [
      'id',
      'firstName',
      'lastName',
      'email',
      'createdAt',
    ];

    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'createdAt';

    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';
    const { count, rows } = await Student.findAndCountAll({
      where,

      limit,
      offset,

      order: [[sortBy, order]],

      include: [
        Department,
        {
          model: Course,
          through: {
            attributes: [],
          },
        },
      ],
    });
    res.json({
      currentPage: page,
      totalStudents: count,
      totalPages: Math.ceil(count / limit),
      students: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        Department,
        {
          model: Course,
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updatedStudent = await student.update(req.body);

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();

    res.json({
      message: 'Student deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  create,
  getAll,
  getById,
  update,
  remove,
};
