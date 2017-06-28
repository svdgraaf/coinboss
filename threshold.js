YAML = require('yamljs');
parameters = YAML.load('serverless.yml');

var buy_at = parseInt(parameters.custom.buy_at);
var percentage = parseInt(parameters.custom.percentage);

module.exports.min = () => {
  return buy_at;
};

module.exports.max = () => {
  return buy_at + (buy_at / percentage);
};
