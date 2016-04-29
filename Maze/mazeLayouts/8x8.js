// mazeLayout.js

var facing = 1; //1 = N, 2 = E, 3 = S, 4 = W
var currentPosX = 4;
var currentPosZ = 0;
const candyPosX = 3;
const candyPosZ = 7;
const mazeWidth = 8;
const mazeHeight = 8;

const maze = [[10, 9, 9, 7, 10, 9, 9, 7],
			  [3, 7, 13, 8, 5, 13, 10, 1],
			  [6, 8, 5, 10, 9, 2, 1, 11],
			  [6, 10, 9, 5, 10, 7, 11, 13],
			  [6, 8, 7, 10, 5, 8, 7, 6],
			  [8, 7, 6, 6, 10, 12, 6, 6],
			  [13, 6, 3, 5, 6, 10, 5, 6],
			  [8, 5, 8, 9, 5, 8, 9, 5]];