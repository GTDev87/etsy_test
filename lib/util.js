var _ = require("lodash");

exports.toSet = function (array) {
  return _.chain(array).map(function (ele) {return [ele, true]}).fromPairs().value(); 
}