const axios = require('axios');
const logger = require('../config/logger');

class CurrencyService {
  constructor() {
    this.rates = {
      USD: 1,
      JPY: 150,
      LKR: 320,
      EUR: 0.85
    };
    this.lastUpdated = null;
    this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Get exchange rates (in a real app, this would fetch from an API)
  async getExchangeRates() {
    try {
      const now = new Date();
      
      // Check if rates are still fresh
      if (this.lastUpdated && (now - this.lastUpdated) < this.updateInterval) {
        return this.rates;
      }

      // In a real application, you would fetch from an API like:
      // const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      // this.rates = response.data.rates;
      
      // For demo purposes, using static rates
      this.lastUpdated = now;
      logger.info('Exchange rates updated');
      
      return this.rates;
    } catch (error) {
      logger.error('Failed to fetch exchange rates:', error);
      return this.rates; // Return cached rates if API fails
    }
  }

  // Convert amount from one currency to another
  async convert(amount, fromCurrency, toCurrency) {
    try {
      const rates = await this.getExchangeRates();
      
      if (fromCurrency === toCurrency) {
        return amount;
      }

      // Convert to USD first, then to target currency
      const usdAmount = fromCurrency === 'USD' ? amount : amount / rates[fromCurrency];
      const convertedAmount = toCurrency === 'USD' ? usdAmount : usdAmount * rates[toCurrency];

      return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      logger.error('Currency conversion error:', error);
      throw new Error('Currency conversion failed');
    }
  }

  // Get rate between two currencies
  async getRate(fromCurrency, toCurrency) {
    try {
      const rates = await this.getExchangeRates();
      
      if (fromCurrency === toCurrency) {
        return 1;
      }

      return rates[toCurrency] / rates[fromCurrency];
    } catch (error) {
      logger.error('Get rate error:', error);
      throw new Error('Failed to get exchange rate');
    }
  }

  // Format currency amount
  formatCurrency(amount, currency) {
    const symbols = {
      USD: '$',
      JPY: '¥',
      LKR: 'Rs',
      EUR: '€'
    };

    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toLocaleString()}`;
  }

  // Get supported currencies
  getSupportedCurrencies() {
    return Object.keys(this.rates);
  }
}

module.exports = new CurrencyService();
