var libFlayer = require("../libFlayer.js");

module.exports = {
  name: 'stock',
  description: 'Stock',
  async execute(message, args) {
    try {
      if (args.length < 1) {
        message.reply(`Please use in !stock [question] format`);
        return;
      }
      var question = encodeURIComponent(args.join(" "));

      var stockData = await libFlayer.getStock(question);
      message.reply(`**Search Stock Info**:
        symbol: ${stockData.symbol}
        open: ${stockData.open}
        high: ${stockData.high}
        low: ${stockData.low}
        price: ${stockData.price}
        volume: ${stockData.volume}
        latest: ${stockData.latest}
        previous: ${stockData.previous}
        change: ${stockData.change}
        percent: ${stockData.percent}
        `);
    } catch (e) {
      message.reply(e.toString());
    }

  }
};