const { Invoice, Student } = require('../models');
const { Op } = require('sequelize');

const create = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
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

    if (req.query.status) {
      where.status = req.query.status;
    }

    const allowedSortFields = [
      'id',
      'amount',
      'dueDate',
      'status',
      'createdAt',
    ];
    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'createdAt';
    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Invoice.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      include: [Student],
    });

    res.json({
      currentPage: page,
      totalInvoices: count,
      totalPages: Math.ceil(count / limit),
      invoices: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [Student],
    });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    const updatedInvoice = await invoice.update(req.body);
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    await invoice.destroy();
    res.json({ message: 'Invoice deleted successfully' });
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
