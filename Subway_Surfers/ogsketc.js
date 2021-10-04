var jake, bomb, coin, path, power, battery, mediumBattery, lowBattery, emptyBattery;
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
  power = loadImage("power.png");
  battery = loadImage("Power.PNG");
  mediumBattery = loadImage("Medium Power.png");
  lowBattery = loadImage("Low Power.png");
  emptyBattery = loadImage("emptyPower.png");
  gameOverImg = loadImage("croppedGameOver.png");
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

  //power Sprite
  powerup = createSprite(250, -1000, 10, 10)
  powerup.addImage("powerup", power);
  powerup.scale = 0.1;
  powerup.velocityY = 5;

  //battery Sprite
  jakeBattery = createSprite(350, 350, 10, 10);
  jakeBattery.addImage("jakeBattery", battery);
  jakeBattery.scale = 0.1;



}
 
function draw() {
  background("#9d6e5e");
  //batteryCounter
  fill("black");
  //text("B: " + batteryCounter, 355, 320);
  textSize(15);
  text("Score:", 353, 50);
  text(scoreCounter, 373, 65);

  if(rightWristScore > 0.1)
  {
    document.getElementById("test").innerHTML = "Speed up the game" + batteryCounter ;
    batteryCounter = batteryCounter - 100;
    movingPath.velocityY = 50;
  }
  else
  {
    //document.getElementById("test").innerHTML = "Normal Speed of the game" + batteryCounter;
    //movingPath.velocityY = 5;
  }
  if(leftWristScore > 0.1)
  {
    document.getElementById("test").innerHTML = "Normal Speed of the game" + batteryCounter ;
    movingPath.velocityY = 5;
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
  if(rightWristScore>0.1){
    bombMoving.velocityY=15;
   }

  if (coinMoving.y > 700) {
    generateRandomNumber(50,350);
    coinMoving.x = randomNumber;
    coinMoving.y = -800;
    coinMoving.velocityY = 5;
  }
  if(rightWristScore>0.1){
    bombMoving.velocityY=10;
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
    jakeLowBattery.visible = false;
    jakeEmptyBattery = createSprite(350, 350, 10, 10);
    jakeEmptyBattery.addImage("jakeEmptyBattery", emptyBattery);
    jakeEmptyBattery.scale = 0.1;
    jakeRunning.x=jakeRunning.x;
    jakeRunning.y=jakeRunning.y;

    coinMoving.setVelocity(0, 0);
    movingPath.setVelocity(0, 0);
    bombMoving.setVelocity(0, 0);
    powerup.setVelocity(0, 0);

    //create Game Over Sprite
    gameOver = createSprite(400, 700, 10, 10);
    gameOver.addImage("gameOver", gameOverImg);
    gameOver.scale = 0.5;
    world_start.stop();



  }

  if (jakeRunning.isTouching(powerup)) {
    batteryCounter = batteryCounter - 1;
    powerup.y = -4500;

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
