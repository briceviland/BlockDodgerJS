	var one = 2;
	var context = document.getElementById("canvas").getContext("2d");


	function drawGround(thing)
	{
		if(thing.shape == "blasqu")
		{
		context.beginPath();
		context.moveTo(thing.x,thing.y);
		context.lineTo(thing.x1,thing.y1);
		context.lineTo(thing.x2,thing.y2);
		context.lineTo(thing.x3,thing.y3);
		context.fill();
		}

	}

	function drawBox(thing3)
	{
		context.beginPath();
		context.moveTo(thing3.x,thing3.y);
		context.lineTo(thing3.x+20,thing3.y);
		context.lineTo(thing3.x+20,thing3.y+20);
		context.lineTo(thing3.x,thing3.y+20);
		context.fill();
	}

	//Help to create ground object
	function Points(xPOS,yPOS,xPOS1,yPOS1,xPOS2,yPOS2,xPOS3,yPOS3,type)
	{
		if(type == "fill")
		{
			this.x = xPOS;
			this.y = yPOS;
			this.x1 = xPOS1;
			this.y1 = yPOS1;
			this.x2 = xPOS2;
			this.y2 = yPOS2;
			this.x3 = xPOS3;
			this.y3 = yPOS3;
			this.shape = "blasqu";
		}
	}

	function boxOBJ(xPOS,yPOS)
	{
		this.x = xPOS;
		this.y = yPOS;
	}

	function randomFall()
	{

		function fallingSquares(max)
		{
			if(fall[max+1])
			{
				drawBox(fall[1]);
				if(fall[1].y == 250)
				{
					delete fall[1];
				}
				else
				{
					fall[1].y += 0.3;
				}
			}
			else
			{
				for(i=1;i<=max;i++)
				{
					fall[i] = new boxOBJ(20,20);
				}

				fall[max+1] = "active";
			}

		}

		//Timer wont appear unless Fall[0] has been declared
		if(fall[0])
		{
			drawText();
		}
		else{
			fall[0] = "active";
		}

		if(fall[0])
		{
			fallingSquares(1);
		}
	}

	//TIMER
	function drawText()
	{
		context.font = "15pt Calibri";
		context.fillText(timedown,250,20);

	}

	var square = new Array();
	var fall = new Array();
	square[0] = new Points(0,300,300,300,300,250,0,250,"fill");
	var timedown = 60;


	//RENDER SCENE
	function renderScene()
	{
		drawGround(square[0]);
		randomFall();
	}

	setInterval(function()
					{
						context.clearRect(0,0,300,300);
						renderScene();
					},16);

	setInterval(function()
					{
						timedown--;
					},1000);