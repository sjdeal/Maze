// maze.js

var gl;
var program;

var points = [];
var normals = [];
var texCoords = [];

//parameters for viewer position
const initViewerDist  =  6.5;
const minViewerDist   =  1.0;
const maxViewerDist   = 10.0;
const maxOffsetRatio  =  2.0;
const deltaViewerDist =  0.25;
const deltaOffset     =  0.25;
var   eye             = vec3(0.0, 1.0, -1.0);
const at              = vec3(0.0, 1.0, -1.0);
const up              = vec3(0.0, 1.0, 0.0);
var viewer;
var theta = 3 * Math.PI / 2;
const deltaTheta = (Math.PI / 24);

//parameters for perspective projection
var   fieldOfViewY = 40.0,
      aspectRatio  =  (4.0/3.0),
      zNear        =  1.0,
      zFar         = 20.0;

//colors
const darkGray  = vec4(0.3, 0.3, 0.3, 1.0);
const white     = vec4(1.0, 1.0, 1.0, 1.0);
const black     = vec4(0.0, 0.0, 0.0, 1.0);
const green     = vec4(0.0, 0.8, 0.2, 1.0);
const red       = vec4(0.8, 0.2, 0.0, 1.0);
const yellow    = vec4(0.8, 0.8, 0.0, 1.0);

//parameters for light
const lightAmb  = darkGray;
const lightDiff = white;
const lightSpec = white;
const lightPos  = vec4(-1.0, 4.5, -1.5, 1.0);

//parameters for materials
const terrainAmb  = green;
const terrainDiff = green;
const terrainSpec = black;
const terrainShin = 0.0;

const wallAmb  = red;
const wallDiff = red;
const wallSpec = black;
const wallShin = 0.0;

const candyAmb  = yellow;
const candyDiff = yellow;
const candySpec = white;
const candyShin = 75.0;

const candyRotateDivs = 360;
var   candyRotatePos = 0;

//parameters for textures
const randomGreenTexSize = 64;
const texGreen = vec4(0, 200, 0, 255);
var randomGreenTexture;
var randomGreenTexImg = new Uint8Array(4*randomGreenTexSize*randomGreenTexSize);

const randomRedTexSize = 64;
const texRed = vec4(200, 0, 0, 255);
var randomRedTexture;
var randomRedTexImg = new Uint8Array(4*randomGreenTexSize*randomGreenTexSize);

const vertTexSize = 2;
var vertLinesTexture;
var vertLinesTexImg = new Uint8Array(4*vertTexSize*vertTexSize);

// uniform variables
var light_position;
var ambient_product;
var diffuse_product;
var specular_product;
var shininess;
var modelViewLoc;
var projectionLoc;
var normalLoc;

var numPatchPoints;
var cubePointsStart;
var numCubePoints;
var candyPointsStart;
var numCandyPoints;

var moving = false;
var numMovements;

var rotating = false;
var rotLeft = true;
var numRotations;

//  Run this function when the window loads
window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL (canvas);
    if  (!gl) { alert ("WebGL isn't available"); }

    //  Configure WebGL
    gl.viewport (0, 0, canvas.width, canvas.height);
    gl.clearColor (0.8, 1.0, 1.0, 1.0); // light cyan background
    gl.enable (gl.DEPTH_TEST);
    
    //  Load shaders and initialize attribute buffers
    program = initShaders (gl, "vertex-shader", "fragment-shader");
    gl.useProgram (program);

    modelViewLoc = gl.getUniformLocation(program, "model_view");
    projectionLoc = gl.getUniformLocation(program, "projection");
    normalLoc = gl.getUniformLocation(program, "normal_mat");
    ambient_product  = gl.getUniformLocation(program, "ambient_product");
    diffuse_product  = gl.getUniformLocation(program, "diffuse_product");
    specular_product = gl.getUniformLocation(program, "specular_product");
    shininess        = gl.getUniformLocation(program, "shininess");
    light_position   = gl.getUniformLocation(program, "light_position");

    // Initialize points, buffer; render
    initTextures();
    initPoints();
    setBuffer();
    initCamera();
    render();
};

function initTextures() {

  //initialize textures
  randomColor(randomGreenTexImg, randomGreenTexSize, texGreen);
  randomColor(randomRedTexImg, randomRedTexSize, texRed);
  vertLines(vertLinesTexImg, vertTexSize);

  //configure textures
  randomGreenTexture = gl.createTexture();       
  gl.bindTexture(gl.TEXTURE_2D, randomGreenTexture );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, randomGreenTexSize, randomGreenTexSize,
                0, gl.RGBA, gl.UNSIGNED_BYTE, randomGreenTexImg);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                   gl.NEAREST_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  randomRedTexture = gl.createTexture();       
  gl.bindTexture(gl.TEXTURE_2D, randomRedTexture );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, randomRedTexSize, randomRedTexSize,
                0, gl.RGBA, gl.UNSIGNED_BYTE, randomRedTexImg);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                   gl.NEAREST_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  vertLinesTexture = gl.createTexture();       
  gl.bindTexture(gl.TEXTURE_2D, vertLinesTexture );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, vertTexSize, vertTexSize,
                0, gl.RGBA, gl.UNSIGNED_BYTE, vertLinesTexImg);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                   gl.NEAREST_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function initPoints() {
  initTerrainPoints();
  initCubePoints();
  initCandyPoints();
}

function initCubePoints(){
    cubePointsStart = points.length;
    numCubePoints = normalTexCube(points, normals, texCoords);
}

function initTerrainPoints() {

  var patch1 = [[vec4(0, 0, 0, 1), vec4(1, 0, 0, 1), vec4(2, 1, 0, 1), vec4(3, 1, 0, 1)],
                [vec4(0, 0, 1, 1), vec4(1, 0, 1, 1), vec4(2, 1, 1, 1), vec4(3, 1, 1, 1)],
                [vec4(0, -0.5, 2, 1), vec4(1, -1, 2, 1), vec4(2, 0, 2, 1), vec4(3, 0, 2, 1)],
                [vec4(0, -1, 3, 1), vec4(1, -1, 3, 1), vec4(2, 0, 3, 1), vec4(3, 0, 3, 1)]];

  var patch2 = [[vec4(0, -1, 0, 1), vec4(1, -1, 0, 1), vec4(2, 0, 0, 1), vec4(3, 0, 0, 1)],
                [vec4(0, -1.5, 1, 1), vec4(1, -1, 1, 1), vec4(2, 0, 1, 1), vec4(3, 0, 1, 1)],
                [vec4(0, 0, 2, 1), vec4(1, 0, 2, 1), vec4(2, 1, 2, 1), vec4(3, 1, 2, 1)],
                [vec4(0, 0, 3, 1), vec4(1, 0, 3, 1), vec4(2, 1, 3, 1), vec4(3, 1, 3, 1)]];

  var patch3 = [[vec4(0, 1, 0, 1), vec4(1, 1, 0, 1), vec4(2, 0, 0, 1), vec4(3, 0, 0, 1)],
                [vec4(0, 1, 1, 1), vec4(1, 1, 1, 1), vec4(2, 0, 1, 1), vec4(3, 0, 1, 1)],
                [vec4(0, 0, 2, 1), vec4(1, 0, 2, 1), vec4(2, 0, 2, 1), vec4(3, -0.5, 2, 1)],
                [vec4(0, 0, 3, 1), vec4(1, 0, 3, 1), vec4(2, -1, 3, 1), vec4(3, -1, 3, 1)]];

  var patch4 = [[vec4(0, 0, 0, 1), vec4(1, 0, 0, 1), vec4(2, -1, 0, 1), vec4(3, -1, 0, 1)],
                [vec4(0, 0, 1, 1), vec4(1, 0, 1, 1), vec4(2, -2, 1, 1), vec4(3, -1.5, 1, 1)],
                [vec4(0, 1, 2, 1), vec4(1, 1, 2, 1), vec4(2, 0, 2, 1), vec4(3, 0, 2, 1)],
                [vec4(0, 1, 3, 1), vec4(1, 1, 3, 1), vec4(2, 0, 3, 1), vec4(3, 0, 3, 1)]];

  var texPatch = [[vec2(0, 0), vec2(0, 1)],
                  [vec2(1, 0), vec2(1, 1)]];

  dividePatch(patch1, texPatch, 3, true, false);
  numPatchPoints = points.length;
  dividePatch(patch2, texPatch, 3, true, false);
  dividePatch(patch3, texPatch, 3, true, false);
  dividePatch(patch4, texPatch, 3, true, false);
}

function initCandyPoints(){
  candyPointsStart = points.length;
  normalTexturedTootsieRoll(points, normals, texCoords, 15, 4, 5);
  numCandyPoints = points.length - candyPointsStart;
}

function setBuffer() {

    //Set up normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    /****** Note the change to 3 for the second parameter ******/
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    // Set up vertex buffer
    var vBuffer = gl.createBuffer ();
    gl.bindBuffer (gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData (gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation (program, "vPosition");
    gl.vertexAttribPointer (vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray (vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);
    
    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    /****** Note the change to 2 for the second parameter ******/
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

}

function initCamera(){
  eye = vec3(currentPosX*3, 1.0, currentPosZ*-3);
  switch(facing){
      case 1:
        at[0] = currentPosX*3; at[2] = currentPosZ*-3 - 3;
        theta = 3 * Math.PI / 2;
        break;
      case 2:
        at[0] = currentPosX*3 + 1; at[2] = currentPosZ*-3;
        theta = 0;
        break;
      case 3:
        at[0] = currentPosX*3; at[2] = currentPosZ*-3 + 3;
        theta = Math.PI / 2;
        break;
      case 4:
        at[0] = currentPosX*3 - 1; at[2] = currentPosZ*-3;
        theta = Math.PI;
        break;
      default: break;
    }
}

function setActiveTexture( texture ) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


function render() {

    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projection = perspective(fieldOfViewY, aspectRatio, zNear, zFar);
    gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));

    

    viewer = lookAt(eye, at, up);

    // set up light position
    var newLightPos = vec4();
    for (i = 0; i < 4; i++) {
      newLightPos[i] = dot(viewer[i], lightPos);
    }
    gl.uniform4fv(light_position, newLightPos);

    for(i = 0; i < mazeHeight; i++){
      for(j = 0; j < mazeWidth; j++){
        drawSquare(i, j);
      }
    }

    setActiveTexture(vertLinesTexture);
    drawCandy();

    if(moving){
      switch(facing){
        case 1:
          eye[2] -= deltaOffset;
          at[2] -= deltaOffset;
          break;
        case 2: 
          eye[0] += deltaOffset;
          at[0] += deltaOffset;
          break;
        case 3:
          eye[2] += deltaOffset;
          at[2] += deltaOffset;
          break;
        case 4: 
          eye[0] -= deltaOffset;
          at[0] -= deltaOffset;
          break;
        default: break;
      }
      numMovements++;
      if(numMovements >= 12){
        moving = false;
        if(currentPosX == candyPosX && currentPosZ == candyPosZ) alert("You win!");
      }
    }

    if(rotating){
      if(rotLeft){
        theta -= deltaTheta;
      }else{
        theta += deltaTheta;
      }
      at[0] = Math.cos(theta) + currentPosX * 3;
      at[2] = Math.sin(theta) - currentPosZ * 3;
      numRotations++;
      if(numRotations >= 12){
        rotating = false;
        if(rotLeft){
          facing--;
          if(facing == 0) facing = 4;
        }else{
          facing++;
          if(facing == 5) facing = 1;
        }
        switch(facing){
          case 1:
            at[0] = currentPosX*3; at[2] = currentPosZ*-3 - 3;
            break;
          case 2:
            at[0] = currentPosX*3 + 1; at[2] = currentPosZ*-3;
            break;
          case 3:
            at[0] = currentPosX*3; at[2] = currentPosZ*-3 + 3;
            break;
          case 4:
            at[0] = currentPosX*3 - 1; at[2] = currentPosZ*-3;
            break;
          default: break;
        } 
      }
  }
  candyRotatePos = (candyRotatePos + 1) % candyRotateDivs;
  requestAnimFrame(render);
}

function drawSquare(x, z){

    //Draw terrain patch
    setActiveTexture(randomGreenTexture);

    drawPatches(3*x, -3*z);

    //Draw wall(s)
    setActiveTexture(randomRedTexture);

    var wallType = maze[x][z];
    switch(wallType){
      case 0: break;
      case 1:
        drawNorthWall(x, z);
        break;
      case 2:
        drawEastWall(x, z);
        break;
      case 3:
        drawSouthWall(x, z);
        break;
      case 4:
        drawWestWall(x, z);
        break;
      case 5:
        drawNorthWall(x, z);
        drawEastWall(x, z);
        break;
      case 6:
        drawNorthWall(x, z);
        drawSouthWall(x, z);
        break;
      case 7:
        drawNorthWall(x, z);
        drawWestWall(x, z);
        break;
      case 8:
        drawEastWall(x, z);
        drawSouthWall(x, z);
        break;
      case 9:
        drawEastWall(x, z);
        drawWestWall(x, z);
        break;
      case 10:
        drawSouthWall(x, z);
        drawWestWall(x, z);
        break;
      case 11:
        drawNorthWall(x, z);
        drawEastWall(x, z);
        drawSouthWall(x, z);
        break;
      case 12:
        drawNorthWall(x, z);
        drawEastWall(x, z);
        drawWestWall(x, z);
        break;
      case 13:
        drawNorthWall(x, z);
        drawSouthWall(x, z);
        drawWestWall(x, z);
        break;
      case 14:
        drawEastWall(x, z);
        drawSouthWall(x, z);
        drawWestWall(x, z);
        break;
      case 15:
        drawNorthWall(x, z);
        drawEastWall(x, z);
        drawSouthWall(x, z);
        drawWestWall(x, z);
        break;
      default: break;
    }
}

function drawCandy(){
    var candyTranslate = translate(candyPosX*3, 1, candyPosZ*-3);
    var candyRotateAngle = candyRotatePos * 360 / candyRotateDivs;
    var candyRotate = rotate(candyRotateAngle, 0, -1, 1);
    var candyMatrix = mult(mult(viewer, candyTranslate), candyRotate);

    gl.uniformMatrix4fv(modelViewLoc, false, flatten(candyMatrix));
    var normalMat = normalMatrix(mult(viewer, candyMatrix), true);
    gl.uniformMatrix3fv(normalLoc, false, flatten(normalMat));

    gl.uniform4fv(ambient_product,  mult(lightAmb,  candyAmb));
    gl.uniform4fv(diffuse_product,  mult(lightDiff, candyDiff));
    gl.uniform4fv(specular_product, mult(lightSpec, candySpec));

    gl.uniform1f(shininess, candyShin);

    gl.drawArrays (gl.TRIANGLES, candyPointsStart, numCandyPoints);
}

function drawNorthWall(x, z){
    var cubeMatrix = mult(translate(3*x, 0.5, -1.5 - (3*z)), scalem(1.5, 1.5, 0.25));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mult(viewer, cubeMatrix)));
    var normalMat = normalMatrix(mult(viewer, cubeMatrix), true);
    gl.uniformMatrix3fv(normalLoc, false, flatten(normalMat));

    gl.uniform4fv(ambient_product,  mult(lightAmb,  wallAmb));
    gl.uniform4fv(diffuse_product,  mult(lightDiff, wallDiff));
    gl.uniform4fv(specular_product, mult(lightSpec, wallSpec));

    gl.uniform1f(shininess, wallShin);

    gl.drawArrays (gl.TRIANGLES, cubePointsStart, numCubePoints);
}

function drawSouthWall(x, z){
    var cubeMatrix = mult(translate(3*x, 0.5, 1.5 - (3*z)), scalem(1.5, 1.5, 0.25));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mult(viewer, cubeMatrix)));
    var normalMat = normalMatrix(mult(viewer, cubeMatrix), true);
    gl.uniformMatrix3fv(normalLoc, false, flatten(normalMat));

    gl.uniform4fv(ambient_product,  mult(lightAmb,  wallAmb));
    gl.uniform4fv(diffuse_product,  mult(lightDiff, wallDiff));
    gl.uniform4fv(specular_product, mult(lightSpec, wallSpec));

    gl.uniform1f(shininess, wallShin);

    gl.drawArrays (gl.TRIANGLES, cubePointsStart, numCubePoints);
}

function drawEastWall(x, z){
    var cubeMatrix = mult(translate(1.5 + (3*x), 0.5, -3*z), scalem(0.25, 1.5, 1.5));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mult(viewer, cubeMatrix)));
    var normalMat = normalMatrix(mult(viewer, cubeMatrix), true);
    gl.uniformMatrix3fv(normalLoc, false, flatten(normalMat));

    gl.uniform4fv(ambient_product,  mult(lightAmb,  wallAmb));
    gl.uniform4fv(diffuse_product,  mult(lightDiff, wallDiff));
    gl.uniform4fv(specular_product, mult(lightSpec, wallSpec));

    gl.uniform1f(shininess, wallShin);

    gl.drawArrays (gl.TRIANGLES, cubePointsStart, numCubePoints);
}

function drawWestWall(x, z){
    var cubeMatrix = mult(translate(-1.5 + (3*x), 0.5, -3*z), scalem(0.25, 1.5, 1.5));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mult(viewer, cubeMatrix)));
    var normalMat = normalMatrix(mult(viewer, cubeMatrix), true);
    gl.uniformMatrix3fv(normalLoc, false, flatten(normalMat));

    gl.uniform4fv(ambient_product,  mult(lightAmb,  wallAmb));
    gl.uniform4fv(diffuse_product,  mult(lightDiff, wallDiff));
    gl.uniform4fv(specular_product, mult(lightSpec, wallSpec));

    gl.uniform1f(shininess, wallShin);

    gl.drawArrays (gl.TRIANGLES, cubePointsStart, numCubePoints);
}

function drawPatches(x, z){

  //Patch 1
    var translation = mult(translate(-1.5+x, 0.0, -1.5+z), scalem(0.5, 0.125, 0.5));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mult(viewer, translation)));
    var normalMat = normalMatrix(mult(viewer, translation), true);
    gl.uniformMatrix3fv(normalLoc, false, flatten(normalMat));

    gl.uniform4fv(ambient_product,  mult(lightAmb,  terrainAmb));
    gl.uniform4fv(diffuse_product,  mult(lightDiff, terrainDiff));
    gl.uniform4fv(specular_product, mult(lightSpec, terrainSpec));

    gl.uniform1f(shininess, terrainShin);

    gl.drawArrays (gl.TRIANGLES, 0, numPatchPoints);

    //Patch 2
    var translation = mult(translate(-1.5+x, 0.0, z), scalem(0.5, 0.125, 0.5));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mult(viewer, translation)));
    var normalMat = normalMatrix(mult(viewer, translation), true);
    gl.uniformMatrix3fv(normalLoc, false, flatten(normalMat));

    gl.uniform4fv(ambient_product,  mult(lightAmb,  terrainAmb));
    gl.uniform4fv(diffuse_product,  mult(lightDiff, terrainDiff));
    gl.uniform4fv(specular_product, mult(lightSpec, terrainSpec));

    gl.uniform1f(shininess, terrainShin);

    gl.drawArrays (gl.TRIANGLES, numPatchPoints, numPatchPoints);

    //Patch 3
    var translation = mult(translate(x, 0.0, -1.5+z), scalem(0.5, 0.125, 0.5));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mult(viewer, translation)));
    var normalMat = normalMatrix(mult(viewer, translation), true);
    gl.uniformMatrix3fv(normalLoc, false, flatten(normalMat));

    gl.uniform4fv(ambient_product,  mult(lightAmb,  terrainAmb));
    gl.uniform4fv(diffuse_product,  mult(lightDiff, terrainDiff));
    gl.uniform4fv(specular_product, mult(lightSpec, terrainSpec));

    gl.uniform1f(shininess, terrainShin);

    gl.drawArrays (gl.TRIANGLES, numPatchPoints*2, numPatchPoints);

    //Patch 4
    var translation = mult(translate(x, 0.0, z), scalem(0.5, 0.125, 0.5));
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mult(viewer, translation)));
    var normalMat = normalMatrix(mult(viewer, translation), true);
    gl.uniformMatrix3fv(normalLoc, false, flatten(normalMat));

    gl.uniform4fv(ambient_product,  mult(lightAmb,  terrainAmb));
    gl.uniform4fv(diffuse_product,  mult(lightDiff, terrainDiff));
    gl.uniform4fv(specular_product, mult(lightSpec, terrainSpec));

    gl.uniform1f(shininess, terrainShin);

    gl.drawArrays (gl.TRIANGLES, numPatchPoints*3, numPatchPoints);
}

function canMove(x, z){
    if(moving || rotating) return false;
    var wallType = maze[x][z];
    if(facing == wallType || facing + 10 == wallType || wallType == 15) return false;
    switch(facing){
      case 1:
        if(wallType == 5 || wallType == 6 || wallType == 7 || wallType == 12 || wallType == 13) return false;
        else return true;
        break;
      case 2:
        if(wallType == 5 || wallType == 8 || wallType == 9 || wallType == 11 || wallType == 14) return false;
        else return true;
        break;
      case 3:
        if(wallType == 6 || wallType == 8 || wallType == 10 || wallType == 11 || wallType == 14) return false;
        else return true;
        break;
      case 4:
        if(wallType == 7 || wallType == 9 || wallType == 10 || wallType == 12 || wallType == 13) return false;
        else return true;
        break;
      default: return false;
    }
}

function keyPressed(event){
  var offsetRatio;
  var key = event.which || event.keyCode;
  switch(key){

    //move the viewer
    case 37: //left
      if(!rotating && !moving){
        rotating = true;
        rotLeft = true;
        numRotations = 0;
      }
      break;
    case 38: //up
      if(canMove(currentPosX, currentPosZ)){
        moving = true;
        numMovements = 0;
        switch(facing){
            case 1:
              currentPosZ++;
              break;
            case 2: 
              currentPosX++;
              break;
            case 3:
              currentPosZ--;
              break;
            case 4: 
              currentPosX--;
              break;
            default: break;
          }
      }
      break;
    case 39: //right
      if(!rotating && !moving){
        rotating = true;
        rotLeft = false;
        numRotations = 0;
      }
      break;
  }
}
