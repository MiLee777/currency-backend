const mongoose = require('mongoose');

const currencyHistorySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    required: true,
  },
  rates: {
    USD: Number,
    EUR: Number,
    CNY: Number,
  },
});

module.exports = mongoose.model('CurrencyHistory', currencyHistorySchema);