const CurrencyHistory = require('./model');
const {
  getRatesWithPrevious,
} = require('./service');

exports.getCurrency = async (req, res) => {
  try {
    if (!req.ip) {
      return res.status(400).json({
        error: 'IP is required',
      });
    }

    const data = await getRatesWithPrevious();

    await CurrencyHistory.create({
      ip: req.ip,
      rates: data.today.rates,
    });

    res.json(data);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: 'Не удалось получить курсы валют. Повторите позже.',
    });
  }
};

exports.getHistory = async (req, res) => {
  const history = await CurrencyHistory
    .find()
    .sort({ timestamp: -1 })
    .limit(10);

  res.json(history);
};
