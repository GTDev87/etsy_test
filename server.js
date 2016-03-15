var express = require("express");
var _ = require("lodash");

var cell = require("./lib/cell");
var util = require("./lib/util");

var app = express();

function cellsToIntegerPairs(cells) {
  return _.map(cells, function (cell) {
    return [parseInt(cell[0], 10), parseInt(cell[1], 10)];
  });
}

app.get('/', function (req, res) {
  var cellData = req.query.liveCells,
    MData = req.query.M || 5,
    NData = req.query.N || 5; //height and width default to 5

  var cells, M, N;

  if(!_.isArray(cellData)) {return res.status(500).send('Cells are not an array');}

  try {M = parseInt(MData, 10)}
  catch(e) {return res.status(500).send('M is not a number');}
  if(!_.isFinite(M)) {return res.status(500).send('M is not a number');}

  try {N = parseInt(NData, 10)}
  catch(e) {return res.status(500).send('N is not a number');}

  if(!_.isFinite(N)) {return res.status(500).send('N is not a number');}

  try{ cells = cellsToIntegerPairs(cellData); }
  catch(e){ return res.status(500).send('Cells are not formatted properly'); }

  var filterLiveCells = cell.createLiveCellFilter(util.toSet(cells), M, N);
  var newCells = filterLiveCells(cell.getPossibleCells(cells));

  res.jsonp(newCells);
});

app.listen(process.env.NODE_ENV === "production" ? 80 : 3001, function () {
  console.log('Example app listening on port 3001!');
});