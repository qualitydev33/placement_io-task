const express = require('express');
const router = express.Router();

/* Get home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = router;
