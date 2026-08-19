const { Attendance, Student, Course } = require('../models');
const { Op } = require('sequelize');

const create = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
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

    if (req.query.studentId) {
      where.studentId = req.query.studentId;
    }

    if (req.query.courseId) {
      where.courseId = req.query.courseId;
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.date) {
      where.date = req.query.date;
    }

    const allowedSortFields = ['id', 'date', 'status', 'createdAt'];
    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'date';
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Attendance.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      include: [Student, Course],
    });

    res.json({
      currentPage: page,
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      attendance: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id, {
      include: [Student, Course],
    });
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    const updatedAttendance = await attendance.update(req.body);
    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    await attendance.destroy();
    res.json({ message: 'Attendance record deleted successfully' });
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
