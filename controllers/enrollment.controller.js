const {
  Enrollment,
  Student,
  Course,
  Invoice,
  sequelize,
} = require('../models');

const create = async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json(enrollment);
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
    const allowedSortFields = ['id', 'studentId', 'courseId', 'createdAt'];

    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'createdAt';

    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';
    const { count, rows } = await Enrollment.findAndCountAll({
      where,
      limit,

      offset,
      order: [[sortBy, order]],

      include: [Student, Course],
    });

    res.json({
      currentPage: page,
      totalEnrollments: count,
      totalPages: Math.ceil(count / limit),
      enrollments: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [Student, Course],
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    const updatedEnrollment = await enrollment.update(req.body);
    res.json(updatedEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    await enrollment.destroy();

    res.json({
      message: 'Enrollment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Enrolls a student AND creates their invoice in a single atomic transaction.
// If either step fails, BOTH are rolled back — no partial/broken state.
const enrollWithInvoice = async (req, res) => {
  const { studentId, courseId, amount, dueDate } = req.body;

  const t = await sequelize.transaction();

  try {
    const enrollment = await Enrollment.create(
      { studentId, courseId },
      { transaction: t },
    );

    const invoice = await Invoice.create(
      {
        studentId,
        amount,
        dueDate,
        description: `Course fee for enrollment #${enrollment.id}`,
      },
      { transaction: t },
    );

    await t.commit();

    res.status(201).json({ enrollment, invoice });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  enrollWithInvoice,
};
