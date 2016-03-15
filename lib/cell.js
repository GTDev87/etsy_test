var _ = require("lodash");

function getNeighbors(pair){
  var x = pair[0];
  var y = pair[1];

  return [
    [x + 1, y],
    [x - 1, y],
    [x,     y + 1],
    [x,     y - 1],
    [x - 1, y + 1],
    [x - 1, y - 1],
    [x + 1, y + 1],
    [x + 1, y - 1],
  ];
}
exports.getNeighbors = getNeighbors;

function getNumNeighbors(cell, cellSet) {
  return _.filter(getNeighbors(cell), function (neighbor) { return cellSet[neighbor];}).length; 
}
exports.getNumNeighbors = getNumNeighbors;

function inRange(cell, width, height) { 
  return (0 <= cell[0] && cell[0] < width) && (0 <= cell[1] && cell[1] < height); 
}
exports.inRange = inRange;

function lives(cell, cellSet) { 
  var numNeighbors = getNumNeighbors(cell, cellSet);
  return numNeighbors === 3 || (numNeighbors === 2 && cellSet[cell]);
}
exports.lives = lives;

exports.getPossibleCells = function (cells) {
  return _.chain(cells)
    .map(getNeighbors)
    .concat([cells])
    .flatten()
    .uniqBy(function (cell) {return cell[0] + "," + cell[1]; })
    .value();
}

exports.createLiveCellFilter = function (cellSet, width, height) {
  return function (possibleCells) {
    return _.chain(possibleCells)
      .filter(function (cell) { return inRange(cell, width, height); })
      .filter(function (cell) { return lives(cell, cellSet); })
      .value();
  };
}