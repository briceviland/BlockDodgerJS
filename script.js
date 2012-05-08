var context = document.getElementById("scene").getContext("2d");
var blood = document.getElementById("blood").getContext("2d");

// helper functions --------
// the clone function is what drives the inheritance pattern in this script
function clone(object) {
	function OneShotConstructor(){};
	OneShotConstructor.prototype = object;
	return new OneShotConstructor();
}
function getRandomInt (intSalt) {
	return Math.floor(Math.random() * intSalt)
}
function targetCharacter(plyObj) {
	return getRandomInt(plyObj.honingRange)+plyObj.pos-(plyObj.honingRange/2);
}
//Game Object
function Game() {
	this.flag = 1;
	this.blocks = [];
	this.timedown = 60;
	this.height = 450;
	this.width = 450;
	this.state = "pause";
	this.level = 0;
	this.seed = false;
	this.spikes = [];
	this.x = 10;
	this.y = 10;
	this.click = false;
	this.date = new Date();
	this.framefix = 0;
	this.bloodleft = new Image();
	this.bloodright = new Image();
	
};

Game.prototype.drawHUD = function() {
	if(this.state == "game"){
		context.font = "15pt Calibri";
		context.fillText(this.timedown,this.width-40,20);
		
		context.fillStyle = "red";
		context.fillText(player.lives + " Lives Left",15,20);
		context.fillStyle = "black";
	}
	else if(this.state == "over"){
		context.fillStyle = "red";
		context.fillText("GAME OVER",100,100);
	}
	else if(this.state == "pause"){
		context.fillStyle = "red";
		context.fillText("Game\nPaused",100,300);
		menuPause.drawItems();
	}
	else if(this.state == "menu"){
		menuMain.drawItems();
		
	}
	else if(this.state == "win"){
		context.fillStyle = "red";
		context.fillText("Congratulations!",100,100);
	}
}

function loadExternalScripts(url,url2,callback){
var body = document.getElementsByTagName('body')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = url;
body.appendChild(script);
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = url2;
script.onload = callback;
body.appendChild(script);
gm.bloodleft.src = "blood.png";
gm.bloodright.src = "blood1.png";
}

var loadLevelCallBack = function() {
	//Creating a menu. (text,x,y,width,size,gm.state to go into)
	menuMain = new MenuCreation('Play Game!',50,50,90,25,'game','Shop',50,120,40,25,'menu','Customize',50,190,90,25,'menu');
	menuPause = new MenuCreation('Resume!',50,50,80,25,'game','Exit to menu...',50,120,130,25,'menu');
	gm.state = "menu";
};

function Block(xwf) {
		// set the value of x based on current game state
		if(xwf.x <= 0) {
			this.x = xwf.x + player.honingRange;
		} else if (xwf.x >= xwf.width-20) {
			this.x = xwf.x - player.honingRange;
		} else {
			this.x = xwf.x;
		}
	this.y = 0;
	this.xendpos = this.x + 20;
	// if the f argument is undefined, default to the right (2.5)
	this.force = (xwf.force || 2.5);
	this.resetForce = this.force;
	this.accelby = 0.008;
};
Block.prototype.draw = function(){
	context.fillStyle = "black";
	context.beginPath();
	context.moveTo(this.x,this.y);
	context.lineTo(this.x+20,this.y);
	context.lineTo(this.x+20,this.y+20);
	context.lineTo(this.x,this.y+20);
	context.fill();
};
Block.prototype.fall = function() {
	this.draw();
	if(this.y <= gm.height - 20) {
		this.y += this.force;
		this.force += (this.accelby * level[gm.level].speedmultiplier);	
	} else {
		this.remove();
	}
};
Block.prototype.remove = function() {
	context.clearRect(this.x,this.y-1,20,22);
	this.x = getRandomInt(player.honingRange);
	this.y = 0;
	this.force = this.resetForce;
};
Block.prototype.impact = function(leftorright) {
	player.lives--;
	if(leftorright === "right"){
		player.pos += 3;
		blood.drawImage(gm.bloodleft, player.pos-50, this.y);
	}
	if(leftorright === "left"){
		player.pos -= 3;
		blood.drawImage(gm.bloodright, player.endpos, this.y);
	}
};

function Spike(xwf) {
	Block.call(this, xwf);
	this.accelby = 0.020;
	this.force = (xwf.force || 2.9);
};
Spike.prototype = clone(Block.prototype);
Spike.prototype.constructor = Spike;
Spike.prototype.draw = function() {
	context.fillStyle = "red";
	context.beginPath();
	context.moveTo(this.x,this.y);
	context.lineTo(this.x+20,this.y);
	context.lineTo(this.x+10,this.y+20);
	context.lineTo(this.x,this.y);
	context.fill();
};
Spike.prototype.impact = function() {
	player.lives--;
	player.speed--;
	setTimeout(function(){(player.speed++) * level[gm.level].speedmultiplier;},1000);
};

function Orb(xwf) {
	Block.call(this, xwf);
	this.accelby = 0.005;
};
Orb.prototype = clone(Block.prototype);
Orb.prototype.constructor = Orb;
Orb.prototype.draw = function() {
	var circle_grad = context.createRadialGradient(this.x-3,this.y-3,1,this.x,this.y, Math.PI*2);
	circle_grad.addColorStop(0, "#fff");
	circle_grad.addColorStop(1, "blue");
	context.fillStyle = circle_grad;
	context.beginPath();
	context.arc(this.x, this.y, 10, 0, Math.PI*2, true);
	context.fill();
};
Orb.prototype.impact = function() {
	player.lives++;
	player.speed++;
	setTimeout(function(){(player.speed--) * level[gm.level].speedmultiplier;},1000);
};

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
	this.honingRange = gm.width;
}
Character.prototype.move = function() {	
	this.domElement.style.left = this.pos + "px";
	switch(gm.flag) {
		case "d":
			if(this.pos >= (gm.width - 22)) {
				break;
			} else if(gm.state == "game"){
				this.domElement.src = "char.png";
				this.pos += this.speed;
				break;
			}
		case "a":
			if(this.pos <= 2) {
				break;
			} else if(gm.state == "game"){
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

//RENDER SCENE
function renderScene() {
	for (var bc = 0; bc <= level[gm.level].blocks; bc++) {
		if(!(gm.state == "over")) {
			gm.blocks[bc].fall();
		}
		else {
			break;
		}
	};
}

//CHECK COLLISIONS
function collisionCheck(max, intLevel) {
	player.endpos = player.pos + 20;
	for(cc=0;cc<=max;cc++) {
		gm.blocks[cc].xendpos = gm.blocks[cc].x + 20;
		if(gm.blocks[cc].y >= gm.height - 64 && gm.blocks[cc].x <= player.endpos && gm.blocks[cc].x >= player.pos) {
			gm.blocks[cc].impact("left");
			gm.blocks[cc].remove();

 		} 
 		else if(gm.blocks[cc].y >= gm.height - 64 && gm.blocks[cc].xendpos >= player.pos && gm.blocks[cc].xendpos <= player.endpos) {
			gm.blocks[cc].impact("right");
			gm.blocks[cc].remove();
		}
	}
}

function createWorld(intLevel) {
	// clear canvas on each call for redraw
	context.clearRect(0,0,gm.width,gm.height);
	if(gm.state == "pause" || gm.state == "win"){
		gm.drawHUD();
	}
	else if(gm.state == "menu"){
		renderScene();
		gm.drawHUD();
		gm.level = 0;
		player.lives = 5;
		blood.clearRect(0,0,gm.width,gm.height);
		gm.timedown = 60;
	}
	else if(gm.level === gm.seed){
		gm.state = "win";
	}
	else{
		player.honingRange = level[intLevel].range;
		gm.drawHUD();		
		renderScene();
		player.move();
		collisionCheck(level[intLevel].blocks, intLevel);
			if(!player.isAlive()) {
				gm.state = "over";
				level[intLevel].blocks = 0;
			}
	}
	setTimeout(function(){createWorld(gm.level);},(17));
}

// Initialize Game ------
var gm = new Game();
loadExternalScripts("levelpack.js","menu.js", loadLevelCallBack);
var player = new Character("./char.png","./char1.png",(gm.width/2)-20,5)
player.domElement = document.getElementById("character");
gm.blocks[0] = new Block({x:targetCharacter(player),width:gm.width-40,force:2.3});
gm.blocks[1] = new Block({x:targetCharacter(player),width:gm.width-40,force:2.4});
gm.blocks[2] = new Block({x:targetCharacter(player),width:gm.width-40,force:2.6});
gm.blocks[3] = new Block({x:targetCharacter(player),width:gm.width-40});
gm.blocks[4] = new Spike({x:targetCharacter(player),width:gm.width-40});
gm.blocks[5] = new Spike({x:targetCharacter(player),width:gm.width-40,force:3.0});
gm.blocks[6] = new Block({x:targetCharacter(player),width:gm.width-40,force:2.7});
gm.blocks[7] = new Orb({x:targetCharacter(player),width:gm.width-40});
gm.blocks[8] = new Spike({x:targetCharacter(player),width:gm.width-40,force:3.1});
gm.blocks[9] = new Spike({x:targetCharacter(player),width:gm.width-40,force:3.2});

//Enter the game loop
setTimeout(function(){createWorld(gm.level);},(33.333 - gm.framefix));

//If in game the countdown begins
setInterval(function(){
	if(gm.state === "game"){
	gm.timedown--;
		if(gm.timedown === 0){
			gm.level++;
			//Clear blood splatters on next level
			blood.clearRect(0,0,gm.width,gm.height);
			gm.timedown = 60;
		}
	}
},1000);

//Key Handlers
$("#blood").mousemove(function(e){
		var offset = $("#blood").offset();
		gm.x = e.clientX - offset.left;
		gm.y = e.clientY - offset.top;
});
$("#blood").click(function(e){
		var offset = $("#blood").offset();
		gm.x = e.clientX - offset.left;
		gm.y = e.clientY - offset.top;
		gm.click = true;
});
$(document).keydown(function(e){
	var keycode = e.keyCode;
	switch(keycode){
		case 68:
			gm.flag = "d";
			player.pressedKey[keycode] = 1;
			break;
		case 65:
			gm.flag = "a";
			player.pressedKey[keycode] = 1;
			break;		
		case 27:
			if(gm.state == "pause"){
				gm.state = "game";
				break;
			}
			else if(gm.state == "menu"){
				break;
			}
			else{
				gm.state = "pause";
				break;
			}
	}
});
$(document).keyup(function(e){
	var keycode = e.keyCode;
	switch(keycode){
		case 68:
		if(gm.flag != "d"){
			player.pressedKey[keycode] = 0;
			break;
		} else {
			if(player.pressedKey[65] == 1) {
				player.pressedKey[keycode] = 0;
				gm.flag = "a";
			} else {
				gm.flag = "1";
				player.pressedKey[keycode] = 0;
				player.pressedKey[65] = 0;
				}
				break;
			}
		case 65:
		if(gm.flag != "a") {
			player.pressedKey[keycode] = 0;
			break;
		} else {
			if(player.pressedKey[68] == 1) {
				player.pressedKey[keycode] = 0;
				gm.flag = "d";
			} else {
				gm.flag = "1";
				player.pressedKey[keycode] = 0;
				player.pressedKey[68] = 0;
			}
			break;
		}
	}
});



