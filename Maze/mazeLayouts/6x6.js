// mazeLayout.js

var facing = 4; //1 = N, 2 = E, 3 = S, 4 = W
var currentPosX = 3;
var currentPosZ = 0;
const candyPosX = 2;
const candyPosZ = 5;
const mazeWidth = 6;
const mazeHeight = 6;

const maze = [[10, 9, 7, 4, 7, 7],
							[6, 8, 5, 5, 0, 5],
							[3, 0, 2, 2, 5, 7],
							[11, 2, 2, 1, 0, 5],
							[3, 2, 0, 5, 2, 1],
							[8, 5, 2, 2, 2, 5]];