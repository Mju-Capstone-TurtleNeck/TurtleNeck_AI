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
var flag = 0;
var imgKeypoint;

const scoreCount = 13;
var direction = 4;

let faceapi;
let detections = [];
// Chin의 값을 받아오는 변수.
var point;
// 최초 Snapshot을 제외한 나머지 Snapshot의 값들이 저장되는 변수. 
var tempDegree;
// 최초 Snapshot의 Degree를 담는변수. 한 명의 정상값으로 고정된 값.
var middleDegree;

// setup()
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
  // Connect to Faceapi
  const faceOptions = { withLandmarks: true, withExpressions: false, withDescriptors: false };
  // 충돌방지용 딜레이
  setTimeout(() =>{faceapi = ml5.faceApi(video, faceOptions, faceReady)},3000);
  // video.hide(); // 원본 비디오는 숨김. 
}
// 'Use this Picture' 클릭 시 호출.
function classify() {
  
  select('#status').html('Complete Capture!');

  let degree = FrontTurtleModel(imgKeypoint);
  
  if(flag == 0){
      flag ++;
      console.log("first poing");
    select('#score').html("Your Straight Turtle Degree  :" + middleDegree);
  }

  if (middleDegree - degree > 5 && flag > 0)
  {
      console.log("You are Turtleneck");
      select('#score').html("You are Turtleneck" + "<br>" + " Your Front Turtle Degree  :" + degree);
  } 
  else if (middleDegree - degree < 5 && flag > 0)
  {
    console.log("You are NOT Turtleneck!!");
    select('#score').html("You are Not Turtleneck" + "<br>" + " Your Front Turtle Degree  :" + degree);
  }
}

// Snapshot or retake 클릭 시 호출.
function takesnap(){
  // 카메라가 켜져있을 때에만 작동하도록 함
  if (video.loadedmetadata) {
    img = video.get(0,0, videoWidth, videoHeight);
    snapshots.push(img); // 캡쳐한 이미지를 배열에 push

    console.log(pose);
    console.log(point);
  }
  if (retake) {
    button.html('Recapture');
    imgKeypoint = pose.keypoints;
    useBtn.show();
    snapshots = [];
    console.log("Completed retake");
  } 
  else {
    button.html('snap!');
    // useBtn.hide();
    imgKeypoint = pose.keypoints;
    
  }
  retake = !retake;
}

// Faceapi setup()
function faceReady() {
    faceapi.detect(gotFaces);
    console.log("Completed faceReady!");
}

// Faceapi's point get function
function gotFaces(error, result) {
    if (error) {
      console.log(error);
      return;
    }
    detections = result;
    faceapi.detect(gotFaces);
    point = detections[0].parts.jawOutline[8];
}

// Posenet's point get function
function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
  select('#status').html('정자세로 촬영해주세요.');
  console.log("Completed ModelLoaded!")
}

// image draw function
function draw() {
  image(video, 0, 0,videoWidth, videoHeight); // 실시간 자세 추적

  if (snapshots.length > 0) {
    image(snapshots[idx], 0, 0, videoWidth, videoHeight);
 
}}

// Degree of FrontTurtleModel Estimate function
function FrontTurtleModel(keypoints){
  
  // chin's x & y point valuables
  var chinX = parseInt(point.x);
  var chinY = videoHeight - parseInt(point.y);
  //   leftShoulders x & y point valuables
  var leftShoX = parseInt(keypoints[5].position.x);
  var leftShoY = videoHeight - parseInt(keypoints[5].position.y); 
  //   rightShoulders x & y point valuables
  var rightShoX = parseInt(keypoints[6].position.x);
  var rightShoY = videoHeight - parseInt(keypoints[6].position.y);  
  
  console.log("This is Left Shoulder position!! \n" + "x :"
   + leftShoX + " y :" + leftShoY);
   console.log("This is Right Shoulder position!! \n" + "x :"
   + rightShoX + " y :" + rightShoY);
  console.log("This is chin position!! \n" + "x :" 
  + chinX + " y :" + chinY);
  
    // Estimate Degree function
    var leftDeg = (cx,cy,sx,sy) => {
        return 180 -Math.atan2(cy - sy , cx - sx) * 180 / Math.PI;
    }
    // Estimate Degree function
    var rightDeg = (cx,cy,sx,sy) => {
        return Math.atan2(cy - sy, cx - sx) * 180 / Math.PI;
    }

    // 중간값 정해서 += 5 까지가 거북목이 아닌것으로 임시 설정.
  console.log("LeftDegree : "+ parseInt(leftDeg(chinX,chinY,leftShoX,leftShoY)));
  console.log("RightDegree : "+ parseInt(rightDeg(chinX,chinY,rightShoX,rightShoY)));
  // 최초의 Degree를 제외한 Degree를 temp에 넣기.
  if(!middleDegree){  
  middleDegree = (parseInt(leftDeg(chinX,chinY,leftShoX,leftShoY)) + parseInt(rightDeg(chinX,chinY,rightShoX,rightShoY))) / 2;
  }
  else{
    tempDegree = (parseInt(leftDeg(chinX,chinY,leftShoX,leftShoY)) + parseInt(rightDeg(chinX,chinY,rightShoX,rightShoY))) / 2;
  }

  console.log("This is Middle Degree :" +  middleDegree);
  console.log("This is temp Degree :" +  tempDegree);

  // function Classify에 임시Degree Return.
  return tempDegree;
    
  }