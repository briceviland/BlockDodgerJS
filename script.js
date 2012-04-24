var context = document.getElementById("canvas").getContext("2d");

//Game Object
var Game = {
	flag : 1,
	blocks : [],
	timedown : 60,
	blocksReady : 1,
	height : 450,
	width : 450,
	blockAmount: 5,
	state : "game",
	level : 0,
}

var level = new Array();

level[0] = {
	blocks: 3,
	range: (Game.width-20),
	speedmultiplier: 1,
}

level[1] = {
	blocks : 4,
	range : (Game.width-25),
	speedmultiplier: 1.1,
}

level[2] = {
	blocks : 5,
	range : (Game.width-30),
	speedmultiplier: 1.2,
}

level[3] = {
	blocks: 6,
	range : (Game.width-35),
	speedmultiplier: 1.3,
}

level[4] = {
	blocks : 7,
	range : (Game.width-40),
	speedmultiplier: 1.4,
}

level[5] = {
	blocks : 8,
	range : (Game.width-45),
	speedmultiplier: 1.5,
}

//Timer Object
var Timer = {
	timerID : 0,
}

//Character Object
var Character = function(imgloc,change,startpos,numlives){
	this.imgsrc = imgloc;
	this.imgsrc2 = change;
	this.pos = startpos;
	this.endpos = this.pos + 20;
	this.pressedKey = [];
	this.domElement = "";
	this.lives = numlives;
	this.speed = 2.0;
	this.honingRange = 125;
}
Character.prototype.move = function() {	
	this.domElement.style.left = this.pos + "px";
	switch(Game.flag) {
		case "w":
			if(this.pos >= (Game.width - 22)) {
				break;
			} else if(Game.state == "game"){
				this.domElement.src = "char.png";
				this.pos += this.speed;
				break;
			}
		case "a":
			if(this.pos <= 2) {
				break;
			} else if(Game.state == "game"){
				this.domElement.src = "char1.png";
				this.pos -= this.speed;
				break;
			}

	}
}
var player = new Character("./char.png","./char1.png",(Game.width/2)-20,5)
player.domElement = document.getElementById("character");

var Block = function(xPos,yPos) {
	if(xPos <= 0)
	{
		this.x = xPos + player.honingRange;
	}
	else if (xPos >= Game.width-20)
	{
		this.x = xPos - player.honingRange;
	}
	else
	{
		this.x = xPos;
	}
	this.y = yPos;
	this.xendpos = this.x + 20;
	this.force = 2.5;
	this.accelby = 0.008;
}

document.onkeydown = editFlagDown;
document.onkeyup = editFlagUp;

function drawBox(thing3) {
	context.beginPath();
	context.moveTo(thing3.x,thing3.y);
	context.lineTo(thing3.x+20,thing3.y);
	context.lineTo(thing3.x+20,thing3.y+20);
	context.lineTo(thing3.x,thing3.y+20);
	context.fill();
}

//Key Checker
function editFlagDown(e){
	var key = (window.event) ? event.keyCode : e.keyCode;
	switch(key){
		case 68:
			Game.flag = "w";
			player.pressedKey[key] = 1;
			break;
		case 65:
			Game.flag = "a";
			player.pressedKey[key] = 1;
			break;		
	}

}
function editFlagUp(e) {
	var key = (window.event) ? event.keyCode : e.keyCode;
	switch(key){
		case 68:
		if(Game.flag != "w"){
			player.pressedKey[68] = 0;
			break;
		} else {
			if(player.pressedKey[65] == 1) {
				player.pressedKey[68] = 0;
				Game.flag = "a";
			} else {
				Game.flag = "1";
				player.pressedKey[68] = 0;
				player.pressedKey[65] = 0;
				}
				break;
			}
		case 65:
		if(Game.flag != "a") {
			player.pressedKey[65] = 0;
			break;
		} else {
			if(player.pressedKey[68] == 1) {
				player.pressedKey[65] = 0;
				Game.flag = "w";
			} else {
				Game.flag = "1";
				player.pressedKey[65] = 0;
				player.pressedKey[68] = 0;
			}
			break;
		}
	}
}

function randomFall(number,levelnumber) {
	function fallingSquares(max,number) {
		if(Game.blocks[max+1]) {
			for(i=1;i<=max;i++) {
				drawBox(Game.blocks[i]);
				if(Game.blocks[i].y >= Game.height - 20) {
					delete Game.blocks[i];
					Game.blocks[i] = new Block(Math.floor((Math.random()* (player.honingRange))+player.pos-(player.honingRange/2)),0);
				} else {
					if(i <=  Game.blocksReady)
					{
						Game.blocks[i].y += Game.blocks[i].force;
						Game.blocks[i].force += (Game.blocks[i].accelby*level[number].speedmultiplier);
					}
				}
			}
		} else {
			for(i=1;i<=max;i++) {
				Game.blocks[i] = new Block(Math.floor((Math.random()* (player.honingRange))+player.pos-(player.honingRange/2)),0);
			}
			Game.blocks[max+1] = "active";
		}
	}
	//Timer wont appear unless Game.blocks[0] has been declared
	if(Game.blocks[0]) {
		drawText();
	} else {
		Game.blocks[0] = "active";
	}
	if(Game.blocks[0]) {
		fallingSquares(number,levelnumber);
	}
}

//TIMER
function drawText() {
	if(Game.state == "game"){
		context.font = "15pt Calibri";
		context.fillText(Game.timedown,Game.width-40,20);
		
		context.fillStyle = "red";
		context.fillText(player.lives + " Lives Left",15,20);
		context.fillStyle = "black";
	}
	else if(Game.state == "over"){
		context.fillStyle = "red";
		context.fillText("GAME OVER",100,100);
	}
}

//RENDER SCENE
function renderScene(number,levelnumber) {
	randomFall(number,levelnumber);
}

//CHECK COLLISIONS
function collisionCheck(max) {
	player.endpos = player.pos + 20;
	for(i=1;i<=max;i++) {
		Game.blocks[i].xendpos = Game.blocks[i].x + 20;
		if(Game.blocks[i].y >= Game.height - 68 && Game.blocks[i].x <= player.endpos && Game.blocks[i].x >= player.pos) {
			delete Game.blocks[i];
			Game.blocks[i] = new Block(Math.floor((Math.random()* (player.honingRange))+player.pos-(player.honingRange/2)),0);
			player.lives--;
		} else if (Game.blocks[i].y >= Game.height - 68 && Game.blocks[i].xendpos >= player.pos && Game.blocks[i].xendpos <= player.endpos) {
			delete Game.blocks[i];
			Game.blocks[i] = new Block(Math.floor((Math.random()* (player.honingRange))+player.pos-(player.honingRange/2)),0);
			player.lives--;
		}
	}
}

//CHECK IF PLAYER IS ALIVE
function checkPlayerLives(levelnumber){
	if(player.lives == 0){
		level[levelnumber].blocks = 0;
		Game.state = "over";
	}
}

function createWorld(levelnumber) {
	player.honingRange = level[levelnumber].range;

	renderScene(level[levelnumber].blocks,levelnumber);
	collisionCheck(level[levelnumber].blocks);
	checkPlayerLives(levelnumber);
}

setInterval(function() {
	context.clearRect(0,0,Game.width,Game.height);
	//createWorld(number of blocks); Control the amount of blocks.
	createWorld(Game.level);
	player.move();
	}
,16.5);

setInterval(function() {
	Game.timedown--;
	Game.blocksReady++;
	if(Game.timedown == 0){
		
		Game.level++;
		Game.timedown = 60;
		Game.blocksReady = 1;

	}
	}
,1000);
