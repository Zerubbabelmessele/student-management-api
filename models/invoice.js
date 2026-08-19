const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {}

  Invoice.init(
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM('pending', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'pending',
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tx_ref: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Invoice',
    },
  );

  return Invoice;
};
