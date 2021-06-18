
var video;
var poseNet;
var pose;
var skeleton;

var videoWidth = 320;
var videoHeight = 240;
var snapshots = []; // 캡쳐된 사진을 저장하기 위한 리스트
var idx = 0;

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
  button = createButton('캡쳐 하기');
  button.mousePressed(takesnap);

  // Connect to poseNet
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  // video.hide(); // 원본 비디오는 숨김. 
}

function takesnap(){
  // 카메라가 켜져있을 때에만 작동하도록 함
  if (video.loadedmetadata) {
    var img = video.get(0,0, videoWidth, videoHeight);
    snapshots.push(img); // 캡쳐한 이미지를 배열에 push
  }
  
  
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
  // background(200);
  
  // 캡쳐된 이미지가 있다면
  if (snapshots.length > 0) {
    image(snapshots[idx], 0, 0, videoWidth, videoHeight);

    // 30 프레임 주기로 캡쳐된 사진들을 순회함.
    if (frameCount%30 == 0) idx += 1;

    // 만약 idx가 배열의 크기와 같아진다면 다시 0으로 초기화
    if (idx == snapshots.length) idx = 0;
  }

  if (pose) {
    // let eyeR = pose.rightEye;
    // let eyeL = pose.leftEye;
    
    // let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y); // d값은 캠과의 거리를 계산함.
    // fill(255, 0, 0); // R , G, B
    // ellipse(pose.nose.x, pose.nose.y, d); // 가까울 수록 빨간 점이 크게 그려짐.
    
    // fill(0, 0, 255);
    // ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    // ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    // 상반신까지만 점을 출력하기 위해서 7로 설정.
    for (let i = 0; i < 7; i++) { 
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0); // 점의 색깔
      ellipse(x, y, 10, 10); // 점의 크기
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
