function MenuCreation(op1,x,y,width,fsize,state1,op2,x2,y2,width2,fsize2,state2,op3,x3,y3,width3,fsize3,state3,op4,x4,y4,width4,fsize4,state4,op5,x5,y5,width5,fsize5,state5) {
	this.options = new Array();
	this.x = new Array();
	this.y = new Array();
	this.width = new Array();
	this.active = new Array();
	this.fsize = new Array();
	this.anim = new Array();
	this.animend = new Array();
	this.animwob = new Array();
	this.state = new Array();
	this.options[0] = op1;
	this.animreset = false;
	this.x[0] = x;
	this.y[0] = y;
	this.width[0] = width;
	this.fsize[0] = fsize;
	this.anim[0] = 0;
	this.animend[0] = 1.5;
	this.animwob[0] = 1.5;
	this.state[0] = state1;
	this.options[1] = op2;
	this.x[1] = x2;
	this.y[1] = y2;
	this.width[1] = width2;
	this.fsize[1] = fsize2;
	this.anim[1] = 0;
	this.animend[1] = 1.5;
	this.animwob[1] = 1.5;
	this.state[1] = state2;
	this.options[2] = op3;
	this.x[2] = x3;
	this.y[2] = y3;
	this.width[2] = width3;
	this.fsize[2] = fsize3;
	this.anim[2] = 0;
	this.animend[2] = 1.5;
	this.animwob[2] = 1.5;
	this.state[2] = state3;
	this.options[3] = op4;
	this.x[3] = x4;
	this.y[3] = y4;
	this.width[3] = width4;
	this.fsize[3] = fsize4;
	this.anim[3] = 0;
	this.animend[3] = 1.5;
	this.animwob[3] = 1.5;
	this.state[3] = state4;
	this.options[4] = op5;
	this.x[4] = x5;
	this.y[4] = y5;
	this.width[4] = width5;
	this.fsize[4] = fsize5;
	this.anim[4] = 0;
	this.animend[4] = 1.5;
	this.animwob[4] = 1.5;
	this.state[4] = state5;
};
MenuCreation.prototype.drawItems = function(){
	//Do animations
	this.animate();
	
	for(i = 0; i < 30; i++){
		if(this.options[i] != undefined){
			context.font = this.fsize[i] + "px 'Press Start 2P'";
	
			if(gm.x > this.x[i] && gm.x < this.x[i] + this.width[i] && gm.y < this.y[i] && gm.y > this.y[i] - this.fsize[i]){
			this.active[i] = true;
				if(gm.click == true){
					gm.state = this.state[i];
					gm.click = false;
				}
			}
			else{
			this.active[i] = false;
			}
				
			if (this.active[i] === false){
				context.beginPath();
				context.moveTo(this.x[i],this.y[i] + 6);
				context.bezierCurveTo(this.x[i] + (this.width[i]* (1/3)), this.y[i] + this.animwob[i] + 6,this.x[i] + (this.width[i]* (2/3)), (this.y[i] - this.animwob[i])+6, this.x[i] + this.width[i], this.y[i]+6);
				context.stroke();
				context.beginPath();
				context.arc(this.x[i] -15,this.y[i] - (this.fsize[i]/2),10 , this.animend[i]*Math.PI, this.anim[i]*Math.PI,true);
				context.stroke();
				context.fillStyle = "blue";
				context.fillText(this.options[i],this.x[i],this.y[i],this.width[i]);
			}
			else if (this.active[i] === true){
				context.beginPath();
				context.moveTo(this.x[i],this.y[i] + 6);
				context.bezierCurveTo(this.x[i] + (this.width[i]* (1/3)), this.y[i] - this.animwob[i] + 6,this.x[i] + (this.width[i]* (2/3)), (this.y[i] + this.animwob[i])+6, this.x[i] + this.width[i], this.y[i]+6);
				context.stroke();
				context.beginPath();
				context.arc(this.x[i] -15,this.y[i] - (this.fsize[i]/2),10 , this.animend[i]*Math.PI, this.anim[i]*Math.PI,false);
				context.stroke();
				context.fillStyle = "red";
				context.fillText(this.options[i],this.x[i],this.y[i],this.width[i]);		
			}
		}
		else{
			gm.click = false;
			break;
		}
	}
}

MenuCreation.prototype.animate = function(){
	for(i = 0; i < 30; i++){
		if(this.options[i] != undefined){
			if(this.anim[i] <= 2){
				this.anim[i] += 0.015;
			}
			else if(this.anim[i] >= 2){
				this.anim[i] = 0;
			}
			
			if(this.animend[i] <= 2){
				this.animend[i] += 0.015;
			}
			else if(this.animend[i] >= 2){
				this.animend[i] = 0;
			}
			if(this.animwob[i] <= 10 && this.animreset == false){
				this.animwob[i] += 0.25;
			}
			else if(this.animwob[i] >= -10){
				this.animwob[i] -= 0.25;
				this.animreset = true;
			}
			else{
				this.animreset = false;
			}

		}
		else{
			break;
		}
	}
}