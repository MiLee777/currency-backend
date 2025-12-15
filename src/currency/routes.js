const express = require('express');
const router = express.Router();

const {
  getCurrency,
  getHistory,
} = require('./controller');

router.get('/currency', getCurrency);
router.get('/history', getHistory);

module.exports = router;
