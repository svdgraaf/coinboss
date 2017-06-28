'use strict';
var Client = require('coinbase').Client;
var AWS = require('aws-sdk');
var moment = require('moment');
var cloudwatch = new AWS.CloudWatch();

var cbClient = new Client({'apiKey': process.env.API_KEY, 'apiSecret': process.env.API_SECRET});

module.exports.updateTransactionPrices = (event, context, callback) => {

  var currencyPair = event.coin + '-' + process.env.CURRENCY;

  cbClient.getBuyPrice({'currencyPair': currencyPair}, function(err, price) {
    module.exports.putCloudwatchValue('Buy ' + currencyPair, price.data.amount);
  });

  cbClient.getSellPrice({'currencyPair': currencyPair}, function(err, price) {
    module.exports.putCloudwatchValue('Sell ' + currencyPair, price.data.amount);
  });
};

module.exports.putCloudwatchValue = (what, amount) => {
  var params = {
    MetricData: [
      {
        MetricName: what,
        Timestamp: new Date,
        Value: parseFloat(amount),
        Unit: 'Count'
      },
    ],
    Namespace: 'Coinboss'
  };
  console.log(params);
  cloudwatch.putMetricData(params, function(err, data){
    console.log(err, data);
  });
}

module.exports.calculateExponentialAverage = (event) => {
  // var currencyPair = process.env.COIN + '-' + process.env.CURRENCY;
  //
  // var params = {
  //   EndTime: new Date,
  //   MetricName: 'Sell ' + currencyPair,
  //   Namespace: 'Coinboss',
  //   Period: event.minutes * 60,
  //   StartTime: moment(new Date).subtract(event.minutes, 'm').toDate(),
  //   Statistics: ['Average'],
  //   Unit: 'Count'
  // };
  //
  // cloudwatch.getMetricStatistics(params, function(err, data) {
  //   if (err){
  //     console.log(err, err.stack); // an error occurred
  //   } else {
  //     console.log(data);           // successful response
  //     module.exports.putCloudwatchValue('ETH ' + event.minutes + ' average ', data.Datapoints[0].Average);
  //   }
  // });
}


module.exports.buyCoins = (event, context, callback) => {}
module.exports.sellCoins = (event, context, callback) => {}

module.exports.updateThresholds = (event, context, callback) => {
  module.exports.putCloudwatchValue('Buy At', event.BuyAt);
  module.exports.putCloudwatchValue('Sell At', event.SellAt);
};
