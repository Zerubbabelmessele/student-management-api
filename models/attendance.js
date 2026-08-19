const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {}

  Attendance.init(
    {
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('present', 'absent', 'late'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Attendance',
      indexes: [
        {
          unique: true,
          fields: ['studentId', 'courseId', 'date'],
        },
      ],
    },
  );

  return Attendance;
};
