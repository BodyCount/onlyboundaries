"use strict";
function UserInterface()
{
	this.canvas = this.getCanvas();
	this.context = this.canvas.getContext("2d");
	this.time = null;
	this.labels = [];
	this.buttons = [];

	this.createClickHandler();
}

UserInterface.prototype.createClickHandler = function()
{
	this.canvas.addEventListener("mousedown", clickHandler, false);
	this.canvas.addEventListener("touchstart", clickHandler, false);

	var that = this;
	function clickHandler(e)
	{
		e.preventDefault();
		var mouse = that.getMouse(e);
		for (var i = 0; i < that.buttons.length; i++)
		{
			if (!that.buttons[i].contains(mouse.x, mouse.y)) continue;
			that.buttons[i].click();
		}
	}
};

UserInterface.prototype.createInterface = function(players)
{
	var x = CONFIG.grid.x + CONFIG.grid.width/2 - CONFIG.shape.radius
			, y = CONFIG.grid.y - CONFIG.timer.position;

	var prepLabel = new Label(STRINGS[0], x, y, this.context, 0.5);
	this.labels.push(prepLabel);

	x = CONFIG.grid.x - CONFIG.player.x - CONFIG.shape.radius;
	y = CONFIG.grid.y - CONFIG.player.y;
	var nameLabel = new Label(players[0].name, x, y, this.context);
	this.labels.push(nameLabel);

	if (players.length > 1)
	{
		x = CONFIG.grid.x + CONFIG.grid.width + CONFIG.shape.radius;
		y = CONFIG.grid.y - CONFIG.player.y;

		nameLabel = new Label(players[1].name, x, y, this.context);
		this.labels.push(nameLabel);
	}

};

var timeInterval;
UserInterface.prototype.updateInterface = function(gameScore, time)
{
	var that = this;

	var x = CONFIG.grid.x+CONFIG.shape.radius*4
			, y = CONFIG.grid.y  - CONFIG.shape.radius*1.7;

	//var scoreTextLabel = new Label("Score", x, y, this.context, 0.5);
	var scoreLabel = new Label(gameScore[0], x, y ,  this.context);

	x = CONFIG.grid.x + CONFIG.grid.width - CONFIG.shape.radius*7;

	//scoreTextLabel = new Label("Score: ", x, y + 25, this.context);
	scoreLabel = new Label(gameScore[1], x, y,  this.context);

	if (this.time != null) return;

	this.time = time + 1;
	this.labels[0].clearSpace();

	timeInterval = function ()
	{
		if (that.time == 0)
		{
			clearInterval(timer);
			return;
		}
		var x = CONFIG.grid.x + CONFIG.grid.width/2 - CONFIG.shape.radius
				, y = CONFIG.grid.y - CONFIG.timer.position;

		that.labels[0] = new Label(that.time, x, y, that.context, 0.5);
		that.time--;
	};

	timeInterval();
	var timer = setInterval(timeInterval, 1000)
};

UserInterface.prototype.endGameInterface = function(winner)
{
	this.labels[0].clearSpace();
	var x = CONFIG.grid.x + CONFIG.grid.width/2 - CONFIG.shape.radius
			, y = CONFIG.grid.y - CONFIG.timer.position*1.5
			, restartButton, leaveButton;

	var winnerTextLabel = new Label("Winner is: "+ winner.name , x, y, this.context, 0.5);

	y = CONFIG.grid.y - CONFIG.timer.position*1.3;

	restartButton = new Button(STRINGS[1], x + 6, y, this.context, 1);
	restartButton.onclick = gameSocket.restartGame.bind(gameSocket);
	this.buttons.push(restartButton);

	leaveButton = new Button(STRINGS[2], x - 6, y, this.context, 1, restartButton.width);
	leaveButton.onclick = gameSocket.leaveGame.bind(gameSocket);
	this.buttons.push(leaveButton);

};

UserInterface.prototype.getMouse = function(e)
{
	e = (e.touches)? e.touches[0]:e;
	return {x: e.clientX, y: e.clientY};
};

UserInterface.prototype.getCanvas = function()
{
	return document.getElementById("main_canvas");
};
