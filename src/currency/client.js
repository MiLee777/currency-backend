const axios = require('axios');
const { CurrencyClient } = require('./service');

const client = new CurrencyClient(async (url) => {
  const res = await axios.get(url);
  return res.data;
});

module.exports = client;
