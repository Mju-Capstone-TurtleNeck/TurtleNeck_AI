const color = 'aqua';
const keyColor = 'yellow';
const boundingBoxColor = 'red';
const lineWidth = 2;
const scoreCount = 13;
var direction = 4;


function toTuple({ y, x }) {
    return [y, x];
}

function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function keyDrawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}


/**
 * Draws a line on a canvas, i.e. a joint
 */
function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
    const adjacentKeyPoints =
        posenet.getAdjacentKeyPoints(keypoints, minConfidence);

    adjacentKeyPoints.forEach((keypoints) => {
        drawSegment(
            toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
            scale, ctx);
    });
}

/**
 * Draw pose keypoints onto a canvas
 */
function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    let degree = turtleModel(keypoints);
    
    if (!degree) {
        console.log("Cannot Read Image!!");
        return 0;
    }
    else if(degree < minConfidence){
        console.log("You are Turtle!! \n" + " Your Turtle Degree : " + parseInt(degree));
    }
    else{
        console.log("Congratulations!!!  You are not a turtle!!\n" + "Your Turtle Degree :" + parseInt(degree))
    }
    
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        // if (keypoint.score < minConfidence) {
        //     continue;
        // }

        const { y, x } = keypoint.position;

        if(direction == 4 && i == 4 || direction == 4 && i == 6)  {
            keyDrawPoint(ctx, y * scale, x * scale, 3, keyColor);
        }
        else if(direction == 3 && i == 3 || direction == 3 && i == 5)  {
            keyDrawPoint(ctx, y * scale, x * scale, 3, keyColor);
        }
        else   {
            drawPoint(ctx, y * scale, x * scale, 3, color);
        }
    }
}

/**
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */
function drawBoundingBox(keypoints, ctx) {
    const boundingBox = posenet.getBoundingBox(keypoints);

    ctx.rect(
        boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
        boundingBox.maxY - boundingBox.minY);

    ctx.strokeStyle = boundingBoxColor;
    ctx.stroke();
}

function turtleModel(keypoints){
   
    var count = 0;
    var valueX = 0;
    var valueY = 0;

    for (let i = 0; i < keypoints.length; i++) {
        if (keypoints[i].score < 0.5) count++;
        if (count > scoreCount) return 0;
    }
     
    if(keypoints[4].score > keypoints[3].score){
        direction = 4;
        valueX = 4;
        valueY = 6;
    }
    else {
        direction = 3;
        valueX = 3;
        valueY = 5;
    }
    
    var earx = parseInt(keypoints[valueX].position.x) 
  var eary = parseInt(keypoints[valueY].position.y) 
  var shox = parseInt(keypoints[valueY].position.x) 
  var shoy = parseInt(keypoints[valueX].position.y) 

  console.log("This is ear's position!! \n" + "x :"
   + earx+ " y :" + eary);
  console.log("This is shoulder's position!! \n" + "x :" 
  + shox + " y :" + shoy);
  
  // ear and shouler's angle function
  var angleDeg =  (ey,sy,ex,sx) => {
      if(valueX == 4){
     return  Math.atan2(ey - sy, ex - sx) * 180 / Math.PI;
      }
      else{
       let deg =  Math.atan2(ey - sy, ex - sx) * 180 / Math.PI;
       deg = 90 - (deg - 90);
        return deg;
      }
    }
  console.log("Degree : "+ parseInt(angleDeg(eary,shoy,earx,shox)));

  return angleDeg(eary,shoy,earx,shox);
    
}
