'use strict';

let fs = require('fs');
let [row, column] = fs
  .readFileSync('Day25/puzzle_input')
  .toString()
  .match(/row (\d+), column (\d+)\./)
  .slice(1)
  .map(Number);

function findCode(code, row, column) {
  let currentRow = 1;
  let currentColumn = 1;

  while (currentRow !== row || currentColumn !== column) {
    code = (code * 252533) % 33554393;

    if (currentRow === 1) {
      currentRow = currentColumn + 1;
      currentColumn = 1;
    } else {
      currentColumn++;
      currentRow--;
    }
  }
  return code;
}

console.log('Code to give the machine:', findCode(20151125, row, column));
