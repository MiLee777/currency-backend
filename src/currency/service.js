const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser();

const CBR_URL = 'https://www.cbr.ru/scripts/XML_daily.asp?date_req=';

/**
 * @typedef {Object} Rates
 * @property {number} USD
 * @property {number} EUR
 * @property {number} CNY
 */

/**
 * @typedef {Object} RatesWithDate
 * @property {string} date
 * @property {Rates} rates
 */

/**
 * @typedef {Object} RatesResponse
 * @property {RatesWithDate} today
 * @property {RatesWithDate} previous
 */

class CurrencyClient {
  constructor(fetcher) {
    this.fetcher = fetcher;
  }

  formatDate(date) {
    return date.toLocaleDateString('ru-RU');
  }

  parseRates(xml) {
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
  }

  async getPreviousWorkDay(date) {
    let prevDate = new Date(date);

    for (let i = 0; i < 7; i++) {
      prevDate.setDate(prevDate.getDate() - 1);
      try {
        const xml = await this.fetcher(CBR_URL + this.formatDate(prevDate));
        if (xml) return prevDate;
      } catch {
        continue;
      }
    }

    throw new Error('Previous work day not found');
  }

  /**
   * @param {Date} [date]
   * @returns {Promise<RatesResponse>}
   */


  async getRatesWithPrevious(date) {
    if (!date) {
      throw new Error('Date is required');
    }

    const todayXml = await this.fetcher(CBR_URL + this.formatDate(date));
    const todayRates = this.parseRates(todayXml);

    const prevDate = await this.getPreviousWorkDay(date);
    const prevXml = await this.fetcher(CBR_URL + this.formatDate(prevDate));
    const prevRates = this.parseRates(prevXml);

    return {
      today: {
        date: this.formatDate(date),
        rates: todayRates,
      },
      previous: {
        date: this.formatDate(prevDate),
        rates: prevRates,
      },
    };
  }
}

module.exports = { CurrencyClient };
