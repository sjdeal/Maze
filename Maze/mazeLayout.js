// mazeLayout.js

var facing = 1; //1 = N, 2 = E, 3 = S, 4 = W
var currentPosX = 0;
var currentPosZ = 0;
const candyPosX = 1;
const candyPosZ = 0;
const mazeWidth = 4;
const mazeHeight = 4;

const maze = [[14, 4, 9, 7],
              [6, 0, 6, 1],
              [6, 0, 8, 5],
              [8, 2, 2, 5]];