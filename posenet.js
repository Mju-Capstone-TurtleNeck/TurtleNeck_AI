const color = 'aqua';
const keyColor = 'yellow';
const boundingBoxColor = 'red';
const lineWidth = 2;
const scoreCount = 13;
var direction = 4;
var degFlag;
// let faceapi;
var semiTurtle = 73;
var highTurtle = 60;

var count;
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

function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

 function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    // let degree = turtleModel(keypoints);
    count = 0;
    // 측면에 대한 포인트를 3개 이상 잡지 못하면 콘솔출력
    for (let i = 0; i < 7; i++) {
       if (count == 3){
           console.log("Cannot Read Image");
           return 0;
       } 
        else if (keypoints[i].score < 0.2) {
          count ++;
        }
    }
    let degree = turtleModel(keypoints);

    if(degree < highTurtle){
        console.log("Score :" + parseInt(degree)  + "  You are Not Turtle");
    }
    // between 73 and 60 degree
    else if (degree < semiTurtle){
        console.log("Score :" + parseInt(degree)  + "  You are SemiTurtle");
    }
    // 73 degree upper
    else {
        console.log("Score :" + parseInt(degree) + "  You are Not Turtle");
    }

    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        const { y, x } = keypoint.position;

        if(direction == 4 && i == 4 || direction == 4 && i == 6)  {
            keyDrawPoint(ctx, y * scale, x * scale, 3, keyColor);
        }
        else if(direction == 3 && i == 3 || direction == 3 && i == 5)  {
            keyDrawPoint(ctx, y * scale, x * scale, 3, keyColor);
        }
        else   {
//             drawPoint(ctx, y * scale, x * scale, 3, color);
        }
    }
}
 function turtleModel(keypoints){
   
    var valueX = 0;
    var valueY = 0;

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
