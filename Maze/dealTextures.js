function checkerboard( texture, texSize, k ){

	var k2 = k * 2;

	for(var i = 0; i < texSize; i++){
		for(var j = 0; j < texSize; j++){
			var iOdd = (i % k2) < k;
			var jOdd = (j % k2) < k;
			if((iOdd && jOdd) || (!iOdd && !jOdd)){
				texture[4*(i*texSize+j)] = 0;
				texture[4*(i*texSize+j)+1] = 0;
				texture[4*(i*texSize+j)+2] = 0;
			}else{
				texture[4*(i*texSize+j)] = 255;
				texture[4*(i*texSize+j)+1] = 255;
				texture[4*(i*texSize+j)+2] = 255;
			}
			texture[4*(i*texSize+j)+3] = 255;
		}
	}

}

function vertLines( texture, texSize ){
	for(var i = 0; i < texSize; i++){
		for(var j = 0; j < texSize; j++){
			if(j >= texSize / 2){
				texture[4*(i*texSize+j)] = 0;
				texture[4*(i*texSize+j)+1] = 0;
				texture[4*(i*texSize+j)+2] = 0;
			}else{
				texture[4*(i*texSize+j)] = 255;
				texture[4*(i*texSize+j)+1] = 255;
				texture[4*(i*texSize+j)+2] = 255;
			}
			texture[4*(i*texSize+j)+3] = 255;
		}
	}
}

/**
 * Adapted from texMovingGlobe.js by J. Andrew Whitford Holey
 */
function randomColor( texture, texSize, color ) {

  const darkeningFactor = 0.8;
  const darkeningCount  = texSize * texSize * 2;

  // initialize texture to the color
  for (i = 0; i < texSize; i++) {
    for (j = 0; j < texSize; j++) {
      for (k = 0; k < 4; k++) {
        texture[4*(i*texSize+j)+k] = color[k];
      }
    }
  }

  // randomly darken texels
  for (k = 0; k < darkeningCount; k++) {
    var s = Math.floor(Math.random() * texSize);
    var t = Math.floor(Math.random() * texSize);
    texture[4*(s*texSize+t)] = 
        Math.floor(texture[4*(s*texSize+t)] * darkeningFactor);
    texture[4*(s*texSize+t)+1] =
        Math.floor(texture[4*(s*texSize+t)+1] * darkeningFactor);
  }

}