const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser();
const CBR_URL = 'https://www.cbr.ru/scripts/XML_daily.asp?date_req=';

const formatDate = (date) =>
  date.toLocaleDateString('ru-RU');

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

const getPreviousWorkDay = async (date) => {
  let prevDate = new Date(date);

  for (let i = 0; i < 7; i++) {
    prevDate.setDate(prevDate.getDate() - 1);
    try {
      const res = await axios.get(
        CBR_URL + formatDate(prevDate)
      );
      if (res.status === 200) return prevDate;
    } catch {
      continue;
    }
  }

  throw new Error('Previous work day not found');
};

const getRatesWithPrevious = async () => {
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

  return {
    today: {
      date: formatDate(today),
      rates: todayRates,
    },
    previous: {
      date: formatDate(prevDate),
      rates: prevRates,
    },
  };
};

module.exports = {
  getRatesWithPrevious,
};
