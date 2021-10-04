var jake, bomb, coin, path, battery, mediumBattery, lowBattery, emptyBattery;
var batteryCounter = 0;
var scoreCounter = 0;

var noseX = "";
var noseY = "";

rightWristX = '';
rightWristY = '';
rightWristScore = '';
leftWristScore = '';

randomNumber = 0;

function preload() {
  //pre-load images
  jake = loadAnimation("Jake1.png", "Jake2.png", "jake3.png", "jake4.PNG", "jake5.png");
  bomb = loadImage("bomb.png");
  coin = loadImage("coin.png");
  path = loadImage("path.png");

  battery = loadImage("power.png");
  mediumBattery = loadImage("Medium Power.png");
  lowBattery = loadImage("Low Power.png");
  emptyBattery = loadImage("emptyPower.png");
  world_start = loadSound("Subway-Surfers-theme-song.mp3");
}

function setup() {
	canvas = createCanvas(400,700);

	setupSubwaySurfers();
  world_start.play();

	video = createCapture(VIDEO);
	video.size(800,400);
	video.parent('game_console');

	poseNet = ml5.poseNet(video, modelLoaded);
	poseNet.on('pose', gotPoses);

}

function modelLoaded() {
	console.log('Model Loaded!');
  }

function gotPoses(results)
  {
    console.log(results);
	if(results.length > 0)
	{	  
	  noseX = results[0].pose.nose.x;
	  noseY = results[0].pose.nose.y;
    
    rightWristX=results[0].pose.rightWrist.x;
    rightWristY=results[0].pose.rightWrist.y;

    rightWristScore=results[0].pose.keypoints[10].score;
    leftWristScore = results[0].pose.keypoints[9].score;
    
	}
}

function setupSubwaySurfers() {

  //Path: Background Sprite
  movingPath = createSprite(200, 200, 10, 10);
  movingPath.addImage("movingPath", path);
  movingPath.velocityY = 5;


  //Jake Sprite
  jakeRunning = createSprite(110, 600, 10, 10);
  jakeRunning.addAnimation("jakeRunning", jake);
  jakeRunning.scale = 0.5;

  //bomb Sprite
  bombMoving = createSprite(110, 0, 10, 10);
  bombMoving.addImage("bomb", bomb);
  bombMoving.velocityY = 5;
  bombMoving.scale = 0.10;

  //coin Sprite
  coinMoving = createSprite(310, -300, 10, 10);
  coinMoving.addImage("coinMoving", coin);
  coinMoving.velocityY = 5;
  coinMoving.scale = 0.5;

  //battery Sprite
  jakeBattery = createSprite(350, 350, 10, 10);
  jakeBattery.addImage("jakeBattery", battery);
  jakeBattery.scale = 0.1;

}
 
function draw() {
  background("#f0ad4e");

  if(rightWristScore > 0.1)
  {
    document.getElementById("test").innerHTML = "Game is at high speed";
    document.getElementById("test").style.background = "red";
    movingPath.velocityY = 15;
    bombMoving.velocityY = 15;
    coinMoving.velocityY = 15;
  }
  if(leftWristScore > 0.1)
  {
    document.getElementById("test").innerHTML = "Game is at normal speed";
    document.getElementById("test").style.background = "#5cb85c";
    movingPath.velocityY = 5;
    bombMoving.velocityY = 10;
    coinMoving.velocityY = 5;
  }

  //infinte running loop
  if (movingPath.y > 400) {
    movingPath.y = 150
  }
  if (bombMoving.y > 700) {
    generateRandomNumber(50,350);
    bombMoving.x = randomNumber;
    bombMoving.y = -500;
    bombMoving.velocityY = 10;

  }

  if (coinMoving.y > 700) {
    generateRandomNumber(50,350);
    coinMoving.x = randomNumber;
    coinMoving.y = -800;
    coinMoving.velocityY = 5;
  }

  //jake hits bomb, then
  if (jakeRunning.isTouching(bombMoving)) {
    bombMoving.y = -1000;
    batteryCounter = batteryCounter + 1;
  }

  //scoreIncrements
  if (jakeRunning.isTouching(coinMoving)) {
    coinMoving.y = -2000;
    scoreCounter = scoreCounter + 10;
    document.getElementById("score").innerHTML = "Score = " + scoreCounter;
  }

  //batteryChanges
  if (batteryCounter <= 0) {
    jakeBattery = createSprite(350, 350, 10, 10);
    jakeBattery.addImage("jakeBattery", battery);
    jakeBattery.scale = 0.1;
  }
  if (batteryCounter === 1) {
    jakeBattery.visible = false;

    jakeMediumBattery = createSprite(350, 350, 10, 10);
    jakeMediumBattery.addImage("jakeMediumBattery", mediumBattery);
    jakeMediumBattery.scale = 0.1;
  }
  if (batteryCounter === 2) {
    jakeMediumBattery.visible = false;
    jakeLowBattery = createSprite(350, 350, 10, 10);
    jakeLowBattery.addImage("jakeLowBattery", lowBattery);
    jakeLowBattery.scale = 0.1;
  }
  if (batteryCounter > 2) {
    window.location.replace("gameOver.html");
  }


  //movement
  movement();
  drawSprites();


}

function movement() {
  if (jakeRunning.x > 110||jakeRunning.x < 310 ) {
    jakeRunning.x = noseX/2;
  }
}

function generateRandomNumber(min, max) { 
	num  = Math.random() * (max - min) + min;
  randomNumber = Math.floor(num);
} 
