const { Submission, Assignment, Student } = require('../models');
const { Op } = require('sequelize');

const create = async (req, res) => {
  try {
    const submissionData = {
      ...req.body,
      submittedAt: new Date(),
    };

    if (req.file) {
      submissionData.fileUrl = req.file.path;
    }

    const submission = await Submission.create(submissionData);
    res.status(201).json(submission);
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

    if (req.query.assignmentId) {
      where.assignmentId = req.query.assignmentId;
    }

    if (req.query.studentId) {
      where.studentId = req.query.studentId;
    }

    const allowedSortFields = ['id', 'submittedAt', 'grade', 'createdAt'];
    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'createdAt';
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Submission.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      include: [Assignment, Student],
    });

    res.json({
      currentPage: page,
      totalSubmissions: count,
      totalPages: Math.ceil(count / limit),
      submissions: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id, {
      include: [Assignment, Student],
    });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Used by an instructor to grade a submission (grade + feedback)
const update = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    const updatedSubmission = await submission.update(req.body);
    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    await submission.destroy();
    res.json({ message: 'Submission deleted successfully' });
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
