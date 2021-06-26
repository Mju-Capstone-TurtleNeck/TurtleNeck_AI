var video;
var poseNet;
var pose;
var skeleton;

var videoWidth = 320;
var videoHeight = 240;
var snapshots = []; // 캡쳐된 사진을 저장하기 위한 리스트
var idx = 0;
var img;
let retake = true;
var flag = true;

const scoreCount = 13;
var direction = 4;


function setup() {

  // Create Video
  createCanvas(videoWidth, videoHeight);
  var constraints = {
    video: {
      mandatory: {
        maxWidth: videoWidth,
        maxHeight: videoHeight
      }
    },
    audio: false // 오디오는 사용하지 않음
  };
  video = createCapture(constraints);

  
  // Create Button
  button = createButton('Capture!');
  button.mousePressed(takesnap);
  useBtn = createButton('Use this picture');
  useBtn.mousePressed(classify);
  useBtn.hide();
  // Connect to poseNet
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  // video.hide(); // 원본 비디오는 숨김. 
}

function classify() {
  flag = false; // false시 Total Score가 정지됨.

  select('#status').html('Complete Capture!');

  let degree = turtleModel(pose.keypoints);

  if(degree < 60){
    // console.log("You are Turtle!! \n" + " Your Turtle Degree : " + parseInt(degree));
    if(direction == 4) {
      select('#score').html("Right Side"+ "<br>" + "You are Turtle!! " + "<br>" + " Your Turtle Degree : " + parseInt(degree));
    }else
    {
      select('#score').html("Left Side"+ "<br>" + "You are Turtle!! " + "<br>" + " Your Turtle Degree : " + parseInt(degree));
    }
    }
  else{
    if(direction == 4) { 
      select('#score').html("Right Side"+ "<br>" +"You are not turtle!!" + "<br>" + "Your Turtle Degree :" + parseInt(degree));
  }else {
    select('#score').html("Left Side"+ "<br>" + "You are not turtle!!" + "<br>" + "Your Turtle Degree :" + parseInt(degree));
  }
}
  }

function takesnap(){
  // 카메라가 켜져있을 때에만 작동하도록 함
  if (video.loadedmetadata) {
    img = video.get(0,0, videoWidth, videoHeight);
    snapshots.push(img); // 캡쳐한 이미지를 배열에 push
  }
  if (retake) {
    button.html('Recapture');
    useBtn.show();
    snapshots = [];
  } 
  else {
    button.html('snap!');
    // useBtn.hide();
    
  }
  retake = !retake;
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0,videoWidth, videoHeight); // 실시간 자세 추적
  
  // 캡쳐된 이미지가 있다면
  if (snapshots.length > 0) {
    image(snapshots[idx], 0, 0, videoWidth, videoHeight);
  }

  if (pose) {
    //keypoint 3 ~ 6까지의 점만 출력.
    for (let i = 3; i < 7; i++) { 
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0); // 점의 색깔
      ellipse(x, y, 5, 5); // 점의 크기
      if (flag)  select('#score').html("Total Score : " + pose.score.toFixed(5) * 100);
      // console.log(pose);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
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
console.log(keypoints)
return angleDeg(eary,shoy,earx,shox);
  
}
