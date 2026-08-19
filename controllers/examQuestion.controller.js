const { ExamQuestion, Exam } = require('../models');
const { Op } = require('sequelize');

const create = async (req, res) => {
  try {
    const question = await ExamQuestion.create(req.body);
    res.status(201).json(question);
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

    if (req.query.examId) {
      where.examId = req.query.examId;
    }

    if (req.query.search) {
      where[Op.or] = [{ question: { [Op.like]: `%${req.query.search}%` } }];
    }

    const allowedSortFields = ['id', 'marks', 'createdAt'];
    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'createdAt';
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await ExamQuestion.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      include: [Exam],
    });

    res.json({
      currentPage: page,
      totalQuestions: count,
      totalPages: Math.ceil(count / limit),
      questions: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const question = await ExamQuestion.findByPk(req.params.id, {
      include: [Exam],
    });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const question = await ExamQuestion.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const updatedQuestion = await question.update(req.body);
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const question = await ExamQuestion.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    await question.destroy();
    res.json({ message: 'Question deleted successfully' });
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
