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
	state : "pause",
	level : 0,
	seed : false,
	spikes : [],
	spikesReady : 1,
	spikeAmount : 5,
};

function loadLevelPack(url, callback)
{
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}

var loadLevelCallBack = function() {
	Game.state = "game";
};

loadLevelPack("levelpack.js", loadLevelCallBack);

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

Character.prototype.isAlive = function() {
	if(this.lives === 0){
		return false;
	}
	else {
		return true;
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

var Spike = function(xPos,yPos) {
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
	this.force = 2.9;
	this.accelby = 0.020;
};

document.onkeydown = editFlagDown;
document.onkeyup = editFlagUp;

function drawBox(thing3) {
	context.fillStyle = "black";
	context.beginPath();
	context.moveTo(thing3.x,thing3.y);
	context.lineTo(thing3.x+20,thing3.y);
	context.lineTo(thing3.x+20,thing3.y+20);
	context.lineTo(thing3.x,thing3.y+20);
	context.fill();
}

function drawSpike(thing4) {
	context.fillStyle = "red";
	context.beginPath();
	context.moveTo(thing4.x,thing4.y);
	context.lineTo(thing4.x+20,thing4.y);
	context.lineTo(thing4.x+10,thing4.y+20);
	context.lineTo(thing4.x,thing4.y);
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

var getRandom = function (intSalt) {
	return Math.floor(Math.random() * intSalt)
}

function randomFall(blockCount, spikeCount, intLevel) {
	this.blockCount = blockCount;
	this.spikeCount = spikeCount;
	this.intLevel = intLevel;
	this.arrObjSelect = [0,0,0,0,1,0,1,1,1];
	this.spikeFalling = function(bc) {
		drawSpike(Game.spikes[bc]);
		if(Game.spikes[bc].y >= Game.height - 20) {
			delete Game.spikes[bc];
			Game.spikes[bc] = new Spike(getRandom(player.honingRange)+player.pos-(player.honingRange/2),0);
		} else {
			if(bc <=  Game.spikesReady)
			{
				Game.spikes[bc].y += Game.spikes[bc].force;
				Game.spikes[bc].force += (Game.spikes[bc].accelby*level[this.intLevel].speedmultiplier);
			}
		}
	}
	this.blockFalling = function(bc) {
		drawBox(Game.blocks[bc]);
		if(Game.blocks[bc].y >= Game.height - 20) {
			delete Game.blocks[bc];
			Game.blocks[bc] = new Block(getRandom(player.honingRange)+player.pos-(player.honingRange/2),0);
		} else {
			if(bc <=  Game.blocksReady)
			{
				Game.blocks[bc].y += Game.blocks[bc].force;
				Game.blocks[bc].force += (Game.blocks[bc].accelby*level[this.intLevel].speedmultiplier);
			}
		}		
	}
	var fallingSquares = function () {
		if(Game.blocks[this.blockCount+1]) {
			for(bc1=1;bc1<=this.blockCount;bc1++) {
				(this.arrObjSelect[bc1] == 1) ? this.spikeFalling(bc1) : this.blockFalling(bc1);
			}
		} else {
			for(bc2=1;bc2<=this.blockCount;bc2++) {
				Game.blocks[bc2] = new Block(getRandom(player.honingRange)+player.pos-(player.honingRange/2),0);
				Game.spikes[bc2] = new Spike(getRandom(player.honingRange)+player.pos-(player.honingRange/2),0);
			}
			Game.blocks[this.blockCount+1] = "active";
		}
	}
	//Timer wont appear unless Game.blocks[0] has been declared
	if(Game.blocks[0]) {
		drawText();
	} else {
		Game.blocks[0] = "active";
	}
	if(Game.blocks[0]) {
		fallingSquares();
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
	else if(Game.state == "pause"){
		context.fillStyle = "red";
		context.fillText("Waiting For Level Load",100,100);
	}
	else if(Game.state == "win"){
		context.fillStyle = "red";
		context.fillText("Congratulations!",100,100);
	}
}

//RENDER SCENE
function renderScene(blockCount,spikeCount,intLevel) {
	randomFall(blockCount,spikeCount,intLevel);
}

//CHECK COLLISIONS
function collisionCheck(max, intLevel) {
	player.endpos = player.pos + 20;
	for(cc=1;cc<=max;cc++) {
		Game.blocks[cc].xendpos = Game.blocks[cc].x + 20;
		if(Game.blocks[cc].y >= Game.height - 68 && Game.blocks[cc].x <= player.endpos && Game.blocks[cc].x >= player.pos) {
			delete Game.blocks[cc];
			Game.blocks[cc] = new Block(getRandom(player.honingRange)+player.pos-(player.honingRange/2),0);
			player.lives--;
 		} 
 		else if(Game.blocks[cc].y >= Game.height - 68 && Game.blocks[cc].xendpos >= player.pos && Game.blocks[cc].xendpos <= player.endpos) {
			delete Game.blocks[cc];
			Game.blocks[cc] = new Block(getRandom(player.honingRange)+player.pos-(player.honingRange/2),0);
			player.lives--;
		}
		Game.spikes[cc].xendpos = Game.spikes[cc].x + 20;
		if(Game.spikes[cc].y >= Game.height - 68 && Game.spikes[cc].x <= player.endpos && Game.spikes[cc].x >= player.pos) {
			delete Game.spikes[cc];
			Game.spikes[cc] = new Spike(getRandom(player.honingRange)+player.pos-(player.honingRange/2),0);
			player.speed--;
			player.lives--;
			setTimeout(function(){(player.speed++) * level[intLevel].speedmultiplier;},1000);
 		} 
 		else if(Game.spikes[cc].y >= Game.height - 68 && Game.spikes[cc].xendpos >= player.pos && Game.spikes[cc].xendpos <= player.endpos) {
			delete Game.spikes[cc];
			Game.spikes[cc] = new Spike(getRandom(player.honingRange)+player.pos-(player.honingRange/2),0);
			player.speed--;
			player.lives--;
			setTimeout(function(){(player.speed++) * level[intLevel].speedmultiplier;},1000);
		}
	}
}

function createWorld(intLevel) {
	if(Game.state == "pause" || Game.state == "win"){
		drawText();
	}
	else if(Game.level == Game.seed){
		Game.state = "win";
	}
	else{
		player.honingRange = level[intLevel].range;
		renderScene(level[intLevel].blocks,level[intLevel].spikes,intLevel);
		collisionCheck(level[intLevel].blocks, intLevel);
			if(!player.isAlive()) {
				Game.state = "over";
				level[intLevel].blocks = 0;
			}
	}
}

setInterval(function() {
	context.clearRect(0,0,Game.width,Game.height);
	//createWorld(number of blocks); Control the amount of blocks.
	createWorld(Game.level);
	player.move();
	}
,16.5);

setInterval(function() {
	if(Game.state == "pause" || Game.state == "win"){
		
	}
	else{
		Game.timedown--;
		Game.blocksReady++;
		Game.spikesReady++;
		if(Game.timedown === 0){
			Game.level++;
			Game.state == "win";
			Game.timedown = 60;
			Game.blocksReady = 1;
			Game.spikesReady = 1;
		}
	}
	}
,1000);
