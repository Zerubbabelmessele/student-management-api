const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  // Multer file size error
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Image size cannot exceed 5 MB.',
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Invalid file type
  if (err.message === 'Only JPG, JPEG and PNG images are allowed.') {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Other errors
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
