const { Department } = require('../models');
const { op } = require('sequelize');

const create = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
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

    if (req.query.search) {
      where[Op.or] = [
        {
          name: {
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

    const allowedSortFields = ['id', 'name', 'code', 'createdAt'];

    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : 'createdAt';

    const order = req.query.order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Department.findAndCountAll({
      where,
      limit,

      offset,

      order: [[sortBy, order]],
    });
    res.json({
      currentPage: page,
      totalDepartments: count,
      totalPages: Math.ceil(count / limit),
      departments: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const updatedDepartment = await department.update(req.body);

    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.destroy();

    res.json({
      message: 'Department deleted successfully',
    });
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
