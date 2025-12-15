const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const CurrencyHistory = require('./model');

const parser = new XMLParser();

const CBR_URL = 'https://www.cbr.ru/scripts/XML_daily.asp?date_req=';

const formatDate = (date) => {
  return date.toLocaleDateString('ru-RU');
};

const getPreviousWorkDay = async (date) => {
  let prevDate = new Date(date);

  for (let i = 0; i < 7; i++) {
    prevDate.setDate(prevDate.getDate() - 1);
    try {
      const response = await axios.get(CBR_URL + formatDate(prevDate));
      if (response.status === 200) {
        return prevDate;
      }
    } catch (e) {
      continue;
    }
  }
  throw new Error('Не удалось найти предыдущий рабочий день');
};

const parseRates = (xml) => {
  const json = parser.parse(xml);
  const valutes = json.ValCurs.Valute;

  const getValue = (code) => {
    const item = valutes.find(v => v.CharCode === code);
    return parseFloat(item.Value.replace(',', '.'));
  };

  return {
    USD: getValue('USD'),
    EUR: getValue('EUR'),
    CNY: getValue('CNY'),
  };
};

exports.getCurrency = async (req, res) => {
  try {
    const today = new Date();

    const todayResponse = await axios.get(
      CBR_URL + formatDate(today)
    );

    const todayRates = parseRates(todayResponse.data);

    const prevDate = await getPreviousWorkDay(today);

    const prevResponse = await axios.get(
      CBR_URL + formatDate(prevDate)
    );

    const prevRates = parseRates(prevResponse.data);

    await CurrencyHistory.create({
      ip: req.ip,
      rates: todayRates,
    });

    res.json({
      date: formatDate(today),
      rates: todayRates,
      previous: {
        date: formatDate(prevDate),
        rates: prevRates,
      },
    });

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
