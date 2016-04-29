# Maze
A simple 3D maze game, programmed using JavaScript and WebGL. Created as a final project for CSCI 321 - Computer Graphics.

## How to play
Use the up arrow to move forward, and the left and right arrows to rotate 90 degrees in either direction. Find the candy in the maze to win!

## How to create a maze
The `mazeLayout.js` file contains everything needed to create a unique maze. The parameters are as follows:
- `facing` - The initial facing direction of the player. 1=N, 2=E, 3=S, 4=W.
- `currentPosX` and `currentPosZ` - The initial position of the player (the start of the maze).
- `candyPosX` and `candyPosZ` - The position of the candy (the end of the maze).
- `mazeWidth` and `mazeHeight` - The size of the maze.
- `maze` - A 2D array containing the actual maze. Maze coordinates are transposed (one row in the array = one column in the maze) and follow this architecture:
  - 0 = No wall
  - 1 = North wall only
  - 2 = East wall only
  - 3 = South wall only
  - 4 = West wall only
  - 5 = N + E
  - 6 = N + S
  - 7 = N + W
  - 8 = E + S
  - 9 = E + W
  - 10 = S + W
  - 11 = N + E + S
  - 12 = N + E + W
  - 13 = N + S + W
  - 14 = E + S + W
  - 15 = All walls
  
The `mazeLayouts` folder contains a few example maze layout files.
