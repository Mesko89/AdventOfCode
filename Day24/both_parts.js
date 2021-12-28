'use strict';

let fs = require('fs');
let packages = fs
  .readFileSync('Day24/puzzle_input')
  .toString()
  .replace(/\r\n/g, '\n')
  .split('\n')
  .filter((w) => !!w)
  .map(Number)
	.reverse();

function sum(group) {
  if (group.length === 0) return 0;
  return group.reduce((a, b) => a + b);
}

function prod(group) {
  return group.reduce((a, b) => a * b, 1);
}

function getQuantumEntanglement(maxGroupSum, packages) {
  let bestGroup = packages;
  let bestQE = Number.MAX_SAFE_INTEGER;
  (function findGroup(packages, group = []) {
    const groupSum = sum(group);
    for (const pkg of packages) {
      const newGroupSum = groupSum + pkg;
      if (newGroupSum === maxGroupSum) {
        const newGroup = group.concat([pkg]);
        const newQE = prod(newGroup);
        if (
          bestGroup.length > newGroup.length ||
          (bestGroup.length === newGroup.length && bestQE > newQE)
        ) {
          bestGroup = newGroup;
          bestQE = newQE;
        }
      } else if (newGroupSum < maxGroupSum) {
        const newGroup = group.concat([pkg]);
        if (newGroup.length < bestGroup.length) {
          findGroup(
            packages.filter((p) => p !== pkg),
            newGroup
          );
        }
      }
    }
  })(packages);

	return bestQE;
}

function getMaxGroupSum(packages, totalGroups) {
  return packages.reduce((a, b) => a + b) / totalGroups;
}

const threeGroups = getQuantumEntanglement(getMaxGroupSum(packages, 3), packages);
const fourGroups = getQuantumEntanglement(getMaxGroupSum(packages, 4), packages);

console.log(
  'The quantum entanglement of the first group of packages in the ideal configuration is ',
  threeGroups
);
console.log(
  'The quantum entanglement of the first group of packages in the ideal configuration with trunk is ',
  fourGroups
);
