//const { Course } = require('../models');
// const { Course, Department } = require('../models');
const { Course, Department, Student } = require('../models');
const { Op } = require('sequelize');

const create = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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
          title: {
            [Op.like]: `%${req.query.search}%`,
          },
        },
        {
          code: {
            [Op.like]: `%${req.query.search}%`,
          },
        },
      ];
    }
    const allowedSortFields = ['id', 'title', 'code', 'createdAt'];

    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'createdAt';

    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';
    const { count, rows } = await Course.findAndCountAll({
      where,

      limit,
      offset,

      order: [[sortBy, order]],

      include: [
        Department,
        {
          model: Student,
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.json({
      currentPage: page,
      totalCourses: count,
      totalPages: Math.ceil(count / limit),
      courses: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        Department,
        {
          model: Student,
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    const updatedCourse = await course.update(req.body);

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    await course.destroy();

    res.json({
      message: 'Course deleted successfully',
    });
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
