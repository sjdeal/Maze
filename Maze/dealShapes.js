/*
 * File: dealShapes.js
 */

/**
 * Function to generate a six-sided star with a cube center
 * and points lying on the coordinate axes.
 * Cube code adapted from holeyShapes.js, J. Andrew Whitford Holey
 */

function star( points ){

	var cubeVertices = [
    vec4( -0.25, -0.25,  0.25,  1.0 ), // 0
    vec4( -0.25,  0.25,  0.25,  1.0 ), // 1
    vec4(  0.25,  0.25,  0.25,  1.0 ), // 2
    vec4(  0.25, -0.25,  0.25,  1.0 ), // 3
    vec4( -0.25, -0.25, -0.25,  1.0 ), // 4
    vec4( -0.25,  0.25, -0.25,  1.0 ), // 5
    vec4(  0.25,  0.25, -0.25,  1.0 ), // 6
    vec4(  0.25, -0.25, -0.25,  1.0 )  // 7
  ];

  var faceIndices = [
    [ 1, 0, 3, 2 ], // 0  front face
    [ 2, 3, 7, 6 ], // 1  right face
    [ 3, 0, 4, 7 ], // 2  bottom face
    [ 6, 5, 1, 2 ], // 3  top face
    [ 4, 5, 6, 7 ], // 4  back face
    [ 5, 4, 0, 1 ]  // 5  left face
  ];

  var starPoints = [
    vec4( 0.0, 0.0, 1.0, 1.0 ), // 0
    vec4( 1.0, 0.0, 0.0, 1.0 ), // 1
    vec4( 0.0, -1.0, 0.0, 1.0),  // 2
    vec4( 0.0, 1.0, 0.0, 1.0 ), // 3
    vec4( 0.0, 0.0, -1.0, 1.0), // 4
    vec4( -1.0, 0.0, 0.0, 1.0), // 5
  ];

  for (i = 0; i < 6; i++){
    points.push( cubeVertices[faceIndices[i][0]]);
    points.push( cubeVertices[faceIndices[i][1]]);
    points.push( starPoints[i]);
    points.push( cubeVertices[faceIndices[i][1]]);
    points.push( cubeVertices[faceIndices[i][2]]);
    points.push( starPoints[i]);
    points.push( cubeVertices[faceIndices[i][2]]);
    points.push( cubeVertices[faceIndices[i][3]]);
    points.push( starPoints[i]);
    points.push( cubeVertices[faceIndices[i][3]]);
    points.push( cubeVertices[faceIndices[i][0]]);
    points.push( starPoints[i]);
  }

}


/**
 * Function to generate a Tootsie-Roll shape on its side.
 * Cylinder and pyramid code adapted from holeyShapes.js, J. Andrew Whitford Holey
 */
function tootsieRoll( points, k, thin ) {

	//Middle cylinder
  var leftCenter     = vec4( -0.5, 0.0, 0.0, 1.0);
  var rightCenter    = vec4( 0.5,  0.0, 0.0, 1.0);
  var topVertices    = [];
  var bottomVertices = [];
  var leftBaseVertices  = [];
  var rightBaseVertices = [];

  var theta = 2.0 * Math.PI / k;
  for (i = 0; i < k; i++) {
    var angle = i * theta;
    topVertices.push     ( vec4( 0.5, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    bottomVertices.push  ( vec4( -0.5, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    leftBaseVertices.push( vec4( -0.75, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    rightBaseVertices.push(vec4( 0.75, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
  }

  for (i = 0; i < k-1; i++ ) {
    // triangle for bottom base
    points.push( leftCenter );
    points.push( bottomVertices[i] );
    points.push( bottomVertices[i+1] );
    // triangle for top base
    points.push( rightCenter );
    points.push( topVertices[i+1] );
    points.push( topVertices[i] );
    // triangles for side rectangle
    points.push( bottomVertices[i] );
    points.push( topVertices[i] );
    points.push( topVertices[i+1] );
    points.push( bottomVertices[i] );
    points.push( topVertices[i+1] );
    points.push( bottomVertices[i+1] );
  }
  // last bottom triangle
  points.push( leftCenter );
  points.push( bottomVertices[k-1] );
  points.push( bottomVertices[0] );
  // last top triangle
  points.push( rightCenter );
  points.push( topVertices[0] );
  points.push( topVertices[k-1] );
  // last side triangles
  points.push( bottomVertices[k-1] );
  points.push( topVertices[k-1] );
  points.push( topVertices[0] );
  points.push( bottomVertices[k-1] );
  points.push( topVertices[0] );
  points.push( bottomVertices[0] );


  //Left pyramid
  var leftApex          = leftCenter;
  var leftBaseCenter    = vec4( -0.75, 0.0, 0.0, 1.0);

  for (i = 0; i < k-1; i++ ) {
    points.push( leftBaseCenter );
    points.push( leftBaseVertices[i] );
    points.push( leftBaseVertices[i+1] );
    points.push( leftApex );
    points.push( leftBaseVertices[i+1] );
    points.push( leftBaseVertices[i] );
  }
  points.push( leftBaseCenter );
  points.push( leftBaseVertices[k-1] );
  points.push( leftBaseVertices[0] );
  points.push( leftApex );
  points.push( leftBaseVertices[0] );
  points.push( leftBaseVertices[k-1] );

  var rightApex          = rightCenter;
  var rightBaseCenter    = vec4( 0.75, 0.0, 0.0, 1.0);

  for (i = 0; i < k-1; i++ ) {
    points.push( rightBaseCenter );
    points.push( rightBaseVertices[i] );
    points.push( rightBaseVertices[i+1] );
    points.push( rightApex );
    points.push( rightBaseVertices[i+1] );
    points.push( rightBaseVertices[i] );
  }
  points.push( rightBaseCenter );
  points.push( rightBaseVertices[k-1] );
  points.push( rightBaseVertices[0] );
  points.push( rightApex );
  points.push( rightBaseVertices[0] );
  points.push( rightBaseVertices[k-1] );

}

function normalTootsieRoll( points, normals, k, thin ) {

  //Middle cylinder
  var leftCenter     = vec4( -0.5, 0.0, 0.0, 1.0);
  var rightCenter    = vec4( 0.5,  0.0, 0.0, 1.0);
  var topVertices     = [];
  var bottomVertices  = [];
  var leftBaseVertices  = [];
  var rightBaseVertices = [];

  var cylinderNormals = [];
  var leftPyramidNormals = [];
  var rightPyramidNormals = [];
  var leftNormal = vec3(-1.0, 0.0, 0.0);
  var rightNormal = vec3(1.0, 0.0, 0.0);

  var theta = 2.0 * Math.PI / k;
  for (i = 0; i < k; i++) {
    var angle = i * theta;
    topVertices.push     ( vec4( 0.5, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    bottomVertices.push  ( vec4( -0.5, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    cylinderNormals.push ( vec3( 0.0, Math.cos(angle)/thin, Math.sin(angle)/thin));
    leftBaseVertices.push( vec4( -0.75, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    rightBaseVertices.push(vec4( 0.75, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    leftPyramidNormals.push(vec3(4*(1/thin), Math.cos(angle)/thin, Math.sin(angle)/thin));
    rightPyramidNormals.push(vec3(4*(1/thin), Math.cos(angle)/thin, Math.sin(angle)/thin));

  }

  for (i = 0; i < k-1; i++ ) {
    // triangle for bottom base
    points.push( leftCenter );
    points.push( bottomVertices[i] );
    points.push( bottomVertices[i+1] );

    normals.push( leftNormal );
    normals.push( leftNormal );
    normals.push( leftNormal );

    // triangle for top base
    points.push( rightCenter );
    points.push( topVertices[i+1] );
    points.push( topVertices[i] );

    normals.push( rightNormal );
    normals.push( rightNormal );
    normals.push( rightNormal );

    // triangles for side rectangle
    points.push( bottomVertices[i] );
    points.push( topVertices[i] );
    points.push( topVertices[i+1] );
    points.push( bottomVertices[i] );
    points.push( topVertices[i+1] );
    points.push( bottomVertices[i+1] );

    normals.push(cylinderNormals[i]);
    normals.push(cylinderNormals[i]);
    normals.push(cylinderNormals[i+1]);
    normals.push(cylinderNormals[i]);
    normals.push(cylinderNormals[i+1]);
    normals.push(cylinderNormals[i+1]);
  }
  // last bottom triangle
  points.push( leftCenter );
  points.push( bottomVertices[k-1] );
  points.push( bottomVertices[0] );

  normals.push( leftNormal );
  normals.push( leftNormal );
  normals.push( leftNormal );

  // last top triangle
  points.push( rightCenter );
  points.push( topVertices[0] );
  points.push( topVertices[k-1] );

  normals.push( rightNormal );
  normals.push( rightNormal );
  normals.push( rightNormal );

  // last side triangles
  points.push( bottomVertices[k-1] );
  points.push( topVertices[k-1] );
  points.push( topVertices[0] );
  points.push( bottomVertices[k-1] );
  points.push( topVertices[0] );
  points.push( bottomVertices[0] );

  normals.push(cylinderNormals[k-1]);
  normals.push(cylinderNormals[k-1]);
  normals.push(cylinderNormals[0]);
  normals.push(cylinderNormals[k-1]);
  normals.push(cylinderNormals[0]);
  normals.push(cylinderNormals[0]);


  //Left pyramid
  var leftApex          = leftCenter;
  var leftBaseCenter    = vec4( -0.75, 0.0, 0.0, 1.0);

  for (i = 0; i < k-1; i++ ) {
    points.push( leftBaseCenter );
    points.push( leftBaseVertices[i] );
    points.push( leftBaseVertices[i+1] );

    normals.push( leftNormal );
    normals.push( leftNormal );
    normals.push( leftNormal );

    points.push( leftApex );
    points.push( leftBaseVertices[i+1] );
    points.push( leftBaseVertices[i] );

    normals.push( leftPyramidNormals[i]);
    normals.push( leftPyramidNormals[i+1]);
    normals.push( leftPyramidNormals[i]);

  }
  points.push( leftBaseCenter );
  points.push( leftBaseVertices[k-1] );
  points.push( leftBaseVertices[0] );

  normals.push( leftNormal );
  normals.push( leftNormal );
  normals.push( leftNormal );

  points.push( leftApex );
  points.push( leftBaseVertices[0] );
  points.push( leftBaseVertices[k-1] );

  normals.push( leftPyramidNormals[k-1]);
  normals.push( leftPyramidNormals[0]);
  normals.push( leftPyramidNormals[k-1]);

  //Right pyramid
  var rightApex          = rightCenter;
  var rightBaseCenter    = vec4( 0.75, 0.0, 0.0, 1.0);

  for (i = 0; i < k-1; i++ ) {
    points.push( rightBaseCenter );
    points.push( rightBaseVertices[i] );
    points.push( rightBaseVertices[i+1] );

    normals.push( rightNormal );
    normals.push( rightNormal );
    normals.push( rightNormal );

    points.push( rightApex );
    points.push( rightBaseVertices[i+1] );
    points.push( rightBaseVertices[i] );

    normals.push( rightPyramidNormals[i]);
    normals.push( rightPyramidNormals[i+1]);
    normals.push( rightPyramidNormals[i]);
  }
  points.push( rightBaseCenter );
  points.push( rightBaseVertices[k-1] );
  points.push( rightBaseVertices[0] );

  normals.push( rightNormal );
  normals.push( rightNormal );
  normals.push( rightNormal );

  points.push( rightApex );
  points.push( rightBaseVertices[0] );
  points.push( rightBaseVertices[k-1] );

  normals.push( rightPyramidNormals[k-1]);
  normals.push( rightPyramidNormals[0]);
  normals.push( rightPyramidNormals[k-1]);

}

function normalTexturedTootsieRoll( points, normals, texCoords, k, thin, texLoop ) {

  //Middle cylinder
  var leftCenter     = vec4( -0.5, 0.0, 0.0, 1.0);
  var rightCenter    = vec4( 0.5,  0.0, 0.0, 1.0);
  var topVertices     = [];
  var bottomVertices  = [];
  var leftBaseVertices  = [];
  var rightBaseVertices = [];

  var cylinderNormals = [];
  var leftPyramidNormals = [];
  var rightPyramidNormals = [];
  var leftNormal = vec3(-1.0, 0.0, 0.0);
  var rightNormal = vec3(1.0, 0.0, 0.0);

  var theta = 2.0 * Math.PI / k;
  for (i = 0; i < k; i++) {
    var angle = i * theta;
    topVertices.push     ( vec4( 0.5, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    bottomVertices.push  ( vec4( -0.5, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    cylinderNormals.push ( vec3( 0.0, Math.cos(angle)/thin, Math.sin(angle)/thin));
    leftBaseVertices.push( vec4( -0.75, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    rightBaseVertices.push(vec4( 0.75, Math.cos(angle)/thin, Math.sin(angle)/thin, 1.0));
    leftPyramidNormals.push(vec3(4*(1/thin), Math.cos(angle)/thin, Math.sin(angle)/thin));
    rightPyramidNormals.push(vec3(4*(1/thin), Math.cos(angle)/thin, Math.sin(angle)/thin));

  }

  for (i = 0; i < k-1; i++ ) {
    // triangle for bottom base
    points.push( leftCenter );
    points.push( bottomVertices[i] );
    points.push( bottomVertices[i+1] );

    normals.push( leftNormal );
    normals.push( leftNormal );
    normals.push( leftNormal );

    texCoords.push(vec2(0,0));
    texCoords.push(vec2(1,0));
    texCoords.push(vec2(0,1));

    // triangle for top base
    points.push( rightCenter );
    points.push( topVertices[i+1] );
    points.push( topVertices[i] );

    normals.push( rightNormal );
    normals.push( rightNormal );
    normals.push( rightNormal );

    texCoords.push(vec2(0,0));
    texCoords.push(vec2(0,1));
    texCoords.push(vec2(1,0));

    // triangles for side rectangle
    points.push( bottomVertices[i] );
    points.push( topVertices[i] );
    points.push( topVertices[i+1] );
    points.push( bottomVertices[i] );
    points.push( topVertices[i+1] );
    points.push( bottomVertices[i+1] );

    normals.push(cylinderNormals[i]);
    normals.push(cylinderNormals[i]);
    normals.push(cylinderNormals[i+1]);
    normals.push(cylinderNormals[i]);
    normals.push(cylinderNormals[i+1]);
    normals.push(cylinderNormals[i+1]);

    texCoords.push(vec2(0,0));
    texCoords.push(vec2(texLoop,0));
    texCoords.push(vec2(texLoop,1));
    texCoords.push(vec2(0,0));
    texCoords.push(vec2(texLoop,1));
    texCoords.push(vec2(0,1));
  }
  // last bottom triangle
  points.push( leftCenter );
  points.push( bottomVertices[k-1] );
  points.push( bottomVertices[0] );

  normals.push( leftNormal );
  normals.push( leftNormal );
  normals.push( leftNormal );

  texCoords.push(vec2(0,0));
  texCoords.push(vec2(1,0));
  texCoords.push(vec2(0,1));

  // last top triangle
  points.push( rightCenter );
  points.push( topVertices[0] );
  points.push( topVertices[k-1] );

  normals.push( rightNormal );
  normals.push( rightNormal );
  normals.push( rightNormal );

  texCoords.push(vec2(0,0));
  texCoords.push(vec2(0,1));
  texCoords.push(vec2(1,0));

  // last side triangles
  points.push( bottomVertices[k-1] );
  points.push( topVertices[k-1] );
  points.push( topVertices[0] );
  points.push( bottomVertices[k-1] );
  points.push( topVertices[0] );
  points.push( bottomVertices[0] );

  normals.push(cylinderNormals[k-1]);
  normals.push(cylinderNormals[k-1]);
  normals.push(cylinderNormals[0]);
  normals.push(cylinderNormals[k-1]);
  normals.push(cylinderNormals[0]);
  normals.push(cylinderNormals[0]);

  texCoords.push(vec2(0,0));
  texCoords.push(vec2(texLoop,0));
  texCoords.push(vec2(texLoop,1));
  texCoords.push(vec2(0,0));
  texCoords.push(vec2(texLoop,1));
  texCoords.push(vec2(0,1));


  //Left pyramid
  var leftApex          = leftCenter;
  var leftBaseCenter    = vec4( -0.75, 0.0, 0.0, 1.0);

  for (i = 0; i < k-1; i++ ) {
    points.push( leftBaseCenter );
    points.push( leftBaseVertices[i] );
    points.push( leftBaseVertices[i+1] );

    normals.push( leftNormal );
    normals.push( leftNormal );
    normals.push( leftNormal );

    texCoords.push(vec2(0,0));
    texCoords.push(vec2(1,0));
    texCoords.push(vec2(0,1));

    points.push( leftApex );
    points.push( leftBaseVertices[i+1] );
    points.push( leftBaseVertices[i] );

    normals.push( leftPyramidNormals[i]);
    normals.push( leftPyramidNormals[i+1]);
    normals.push( leftPyramidNormals[i]);

    texCoords.push(vec2(0,0));
    texCoords.push(vec2(0,1));
    texCoords.push(vec2(1,0));

  }
  points.push( leftBaseCenter );
  points.push( leftBaseVertices[k-1] );
  points.push( leftBaseVertices[0] );

  normals.push( leftNormal );
  normals.push( leftNormal );
  normals.push( leftNormal );

  texCoords.push(vec2(0,0));
  texCoords.push(vec2(1,0));
  texCoords.push(vec2(0,1));

  points.push( leftApex );
  points.push( leftBaseVertices[0] );
  points.push( leftBaseVertices[k-1] );

  normals.push( leftPyramidNormals[k-1]);
  normals.push( leftPyramidNormals[0]);
  normals.push( leftPyramidNormals[k-1]);

  texCoords.push(vec2(0,0));
  texCoords.push(vec2(0,1));
  texCoords.push(vec2(1,0));

  //Right pyramid
  var rightApex          = rightCenter;
  var rightBaseCenter    = vec4( 0.75, 0.0, 0.0, 1.0);

  for (i = 0; i < k-1; i++ ) {
    points.push( rightBaseCenter );
    points.push( rightBaseVertices[i] );
    points.push( rightBaseVertices[i+1] );

    normals.push( rightNormal );
    normals.push( rightNormal );
    normals.push( rightNormal );

    texCoords.push(vec2(0,0));
    texCoords.push(vec2(0,1));
    texCoords.push(vec2(1,0));

    points.push( rightApex );
    points.push( rightBaseVertices[i+1] );
    points.push( rightBaseVertices[i] );

    normals.push( rightPyramidNormals[i]);
    normals.push( rightPyramidNormals[i+1]);
    normals.push( rightPyramidNormals[i]);

    texCoords.push(vec2(0,0));
    texCoords.push(vec2(1,0));
    texCoords.push(vec2(0,1));
  }
  points.push( rightBaseCenter );
  points.push( rightBaseVertices[k-1] );
  points.push( rightBaseVertices[0] );

  normals.push( rightNormal );
  normals.push( rightNormal );
  normals.push( rightNormal );

  texCoords.push(vec2(0,0));
  texCoords.push(vec2(0,1));
  texCoords.push(vec2(1,0));

  points.push( rightApex );
  points.push( rightBaseVertices[0] );
  points.push( rightBaseVertices[k-1] );

  normals.push( rightPyramidNormals[k-1]);
  normals.push( rightPyramidNormals[0]);
  normals.push( rightPyramidNormals[k-1]);

  texCoords.push(vec2(0,0));
  texCoords.push(vec2(1,0));
  texCoords.push(vec2(0,1));

}

function parallelogramDonut( points ){

	var vertices = [
    vec4(0.5, 0.3, 0.25, 1.0),  // 0
    vec4(-0.3, 0.3, 0.25, 1.0), // 1
    vec4(-0.5, -0.3, 0.25, 1.0),// 2
    vec4(0.3, -0.3, 0.25, 1.0), // 3
    vec4(0.75, 0.5, 0.25, 1.0),  // 4
    vec4(-0.45, 0.5, 0.25, 1.0), // 5
    vec4(-0.75, -0.5, 0.25, 1.0),// 6
    vec4(0.45, -0.5, 0.25, 1.0), // 7
    vec4(0.5, 0.3, -0.25, 1.0),  // 8
    vec4(-0.3, 0.3, -0.25, 1.0), // 9
    vec4(-0.5, -0.3, -0.25, 1.0),// 10
    vec4(0.3, -0.3, -0.25, 1.0), // 11
    vec4(0.75, 0.5, -0.25, 1.0),  // 12
    vec4(-0.45, 0.5, -0.25, 1.0), // 13
    vec4(-0.75, -0.5, -0.25, 1.0),// 14
    vec4(0.45, -0.5, -0.25, 1.0), // 15
  ];

  //Front face
  points.push(vertices[0]);
  points.push(vertices[4]);
  points.push(vertices[1]);
  points.push(vertices[4]);
  points.push(vertices[1]);
  points.push(vertices[5]);
  points.push(vertices[1]);
  points.push(vertices[5]);
  points.push(vertices[2]);
  points.push(vertices[5]);
  points.push(vertices[2]);
  points.push(vertices[6]);
  points.push(vertices[2]);
  points.push(vertices[6]);
  points.push(vertices[3]);
  points.push(vertices[6]);
  points.push(vertices[3]);
  points.push(vertices[7]);
  points.push(vertices[3]);
  points.push(vertices[7]);
  points.push(vertices[0]);
  points.push(vertices[7]);
  points.push(vertices[0]);
  points.push(vertices[4]);

  //Back face
  points.push(vertices[8]);
  points.push(vertices[12]);
  points.push(vertices[9]);
  points.push(vertices[12]);
  points.push(vertices[9]);
  points.push(vertices[13]);
  points.push(vertices[9]);
  points.push(vertices[13]);
  points.push(vertices[10]);
  points.push(vertices[13]);
  points.push(vertices[10]);
  points.push(vertices[14]);
  points.push(vertices[10]);
  points.push(vertices[14]);
  points.push(vertices[11]);
  points.push(vertices[14]);
  points.push(vertices[11]);
  points.push(vertices[15]);
  points.push(vertices[11]);
  points.push(vertices[15]);
  points.push(vertices[8]);
  points.push(vertices[12]);
  points.push(vertices[8]);
  points.push(vertices[15]);

  //Sides
  points.push(vertices[5]);
  points.push(vertices[6]);
  points.push(vertices[14]);
  points.push(vertices[14]);
  points.push(vertices[13]);
  points.push(vertices[5]);

  points.push(vertices[5]);
  points.push(vertices[4]);
  points.push(vertices[13]);
  points.push(vertices[13]);
  points.push(vertices[12]);
  points.push(vertices[4]);

  points.push(vertices[4]);
  points.push(vertices[7]);
  points.push(vertices[12]);
  points.push(vertices[12]);
  points.push(vertices[15]);
  points.push(vertices[7]);

  points.push(vertices[6]);
  points.push(vertices[7]);
  points.push(vertices[14]);
  points.push(vertices[14]);
  points.push(vertices[15]);
  points.push(vertices[7]);

  points.push(vertices[0]);
  points.push(vertices[1]);
  points.push(vertices[8]);
  points.push(vertices[8]);
  points.push(vertices[9]);
  points.push(vertices[1]);

  points.push(vertices[1]);
  points.push(vertices[2]);
  points.push(vertices[9]);
  points.push(vertices[9]);
  points.push(vertices[10]);
  points.push(vertices[2]);

  points.push(vertices[2]);
  points.push(vertices[3]);
  points.push(vertices[10]);
  points.push(vertices[10]);
  points.push(vertices[11]);
  points.push(vertices[3]);

  points.push(vertices[0]);
  points.push(vertices[3]);
  points.push(vertices[8]);
  points.push(vertices[8]);
  points.push(vertices[11]);
  points.push(vertices[3]);


}

/**
 * Generates a cube with unit coordinates and appends the vertices as triangles
 * to the specified array of points.
 * Also pushes normals and texture coordinates.
 * This code is adapted from code by Angel & Shriener from their book
 * Interactive Computer Graphics, 7th Edition.
 * This cube requires 36 vertices in the array points.
 *
 * @author  J. Andrew Whitford Holey and Sean Deal
 * @version April 28, 2016
 * @param   points the array to append the points to
 * @return  the number of points appended (36)
 */
function normalTexCube( points, normals, texCoords ) {

  const numFaces     = 6;
  const vertsPerFace = 6;

  var vertices = [
    vec4( -1.0, -1.0,  1.0,  1.0 ), // 0
    vec4( -1.0,  1.0,  1.0,  1.0 ), // 1
    vec4(  1.0,  1.0,  1.0,  1.0 ), // 2
    vec4(  1.0, -1.0,  1.0,  1.0 ), // 3
    vec4( -1.0, -1.0, -1.0,  1.0 ), // 4
    vec4( -1.0,  1.0, -1.0,  1.0 ), // 5
    vec4(  1.0,  1.0, -1.0,  1.0 ), // 6
    vec4(  1.0, -1.0, -1.0,  1.0 )  // 7
  ];

  var texVertices = [
    vec2(0, 1),
    vec2(0, 0),
    vec2(1, 1),
    vec2(1, 0)
  ];

  var normalVertices = [
    vec3(0, 0, 1),
    vec3(1, 0, 0),
    vec3(0, -1, 0),
    vec3(0, 1, 0),
    vec3(0, 0, -1),
    vec3(-1, 0, 0)
  ];

  var faceIndices = [
    [ 1, 0, 3, 2 ], // 0  front face
    [ 2, 3, 7, 6 ], // 1  right face
    [ 3, 0, 4, 7 ], // 2  bottom face
    [ 6, 5, 1, 2 ], // 3  top face
    [ 4, 5, 6, 7 ], // 4  back face
    [ 5, 4, 0, 1 ]  // 5  left face
  ];

  for ( i = 0; i < numFaces; i++ ) {
    points.push( vertices[faceIndices[i][0]] );
    texCoords.push( texVertices[0]);

    points.push( vertices[faceIndices[i][1]] );
    texCoords.push( texVertices[1]);

    points.push( vertices[faceIndices[i][2]] );
    texCoords.push( texVertices[2]);

    points.push( vertices[faceIndices[i][0]] );
    texCoords.push( texVertices[0]);

    points.push( vertices[faceIndices[i][2]] );
    texCoords.push( texVertices[2]);

    points.push( vertices[faceIndices[i][3]] );
    texCoords.push( texVertices[3]);

    for(j = 0; j < 6; j++){
      normals.push(normalVertices[i]);
    }
  }
  return vertsPerFace * numFaces;
}