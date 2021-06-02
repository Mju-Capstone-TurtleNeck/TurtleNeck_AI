//  sketch.js
let img1, img2;
let size=0;
let poseNet;
let poses=[];
let keypointX=[];
let keypointY=[];
let skeletons=[];

// Image Load 
function preload(){
  img1 = loadImage('images/turtle.png');
}

// Canvas and size setup
function setup() {
  createCanvas(640, 360);
  resizeCanvas(img1.width, img1.height);
  image(img1,0,0);
  poseNet = ml5.poseNet(modelReady);
  poseNet.on('pose', gotResult);
}

function modelReady(){
  poseNet.singlePose(img1);//able to single
  console.log('model OK');
}

// PoseNet Model
function gotResult(results){
  poses = results[0].pose.keypoints;
  skeletons = results[0].skeleton;
  fill('#FFFF00');
  stroke('#FF0000');
  strokeWeight(3);
  for(let i = 0; i < poses.length; i++){
    keypointX[i]=round(poses[i].position.x);
    keypointY[i]=round(poses[i].position.y);
    ellipse(keypointX[i], keypointY[i],10);
  }
  stroke('#FFFF00');
  strokeWeight(2);
  for(let i=0; i< skeletons.length; i++){
    line(round(skeletons[i][0].position.x), round(skeletons[i][0].position.y), round(skeletons[i][1].position.x), round(skeletons[i][1].position.y));
  }
  size = dist(keypointX[0],keypointY[0],keypointX[3],keypointY[3]);
  imageMode(CENTER);
  fill(255, 255, 0, 200);

  var earx = parseInt(poses[4].position.x) 
  var eary = parseInt(poses[6].position.y) 
  var shox = parseInt(poses[6].position.x) 
  var shoy = parseInt(poses[4].position.y) 

  console.log("This is Right ear's position!! \n" + "x :" + parseInt(poses[4].position.x) + " y :" + parseInt(poses[4].position.y));
  console.log("This is Right shoulder's position!! \n" + "x :" + parseInt(poses[6].position.x) + " y :" + parseInt(poses[6].position.y));
  
  // ear and shouler's angle function
  var angleDeg =  (ey,sy,ex,sx) => {
     return  Math.atan2(ey - sy, ex - sx) * 180 / Math.PI};

  console.log("Degree : "+ parseInt(angleDeg(eary,shoy,earx,shox)))

  // degree(65) is temporary value. 
  if (angleDeg(eary,shoy,earx,shox) < 65){
       console.log("You are Turtle!! \n" + " Your Turtle Degree : " + parseInt(angleDeg(eary,shoy,earx,shox)))
  }
  else{
       console.log("Congratulations!!!  You are not a turtle!!\n" + "Your Turtle Degree :" + parseInt(angleDeg(eary,shoy,earx,shox)))
  }

  // Key Poin check
  ellipse(poses[4].position.x, poses[4].position.y, 20, 20);
  ellipse(poses[6].position.x, poses[6].position.y, 20, 20);

  // Array's value
  console.log(poses);
}