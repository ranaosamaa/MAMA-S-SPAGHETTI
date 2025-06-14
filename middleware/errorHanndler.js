module.exports = (err, req, res, next) => {
  console.error(err.stack);

  if (req.originalUrl.startsWith('/api')) {
    return res.json({
      success: false,
      message: err.message || 'Server Error',
    });
  }

  res.render('error', {
    error: err.message || 'Something went wrong.',
  });
};