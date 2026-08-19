const { Exam, Course } = require('../models');
const { Op } = require('sequelize');

const create = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
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

    if (req.query.courseId) {
      where.courseId = req.query.courseId;
    }

    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const allowedSortFields = [
      'id',
      'title',
      'startTime',
      'endTime',
      'createdAt',
    ];
    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'createdAt';
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Exam.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      include: [Course],
    });

    res.json({
      currentPage: page,
      totalExams: count,
      totalPages: Math.ceil(count / limit),
      exams: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id, { include: [Course] });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    const updatedExam = await exam.update(req.body);
    res.json(updatedExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    await exam.destroy();
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
