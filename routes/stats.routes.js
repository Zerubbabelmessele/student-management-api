const express = require('express');

const router = express.Router();

const statsController = require('../controllers/stats.controller');

router.get('/', statsController.getStats);
router.get(
  '/students-per-department',
  statsController.getStudentsPerDepartment,
);
router.get('/courses-per-department', statsController.getCoursesPerDepartment);

module.exports = router;
//onlie exam, assignment submission, attendance, billing
