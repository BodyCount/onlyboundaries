"use strict";

function GameController(gameInstance, playerNumber)
{
	this.players = [];
	this.playerNumber = playerNumber;
	this.canvasController = new CanvasController(gameInstance.grid, playerNumber);
	this.userInterface = null;
}

GameController.prototype.init = function(players)
{
	this.players = players;
	//this.canvasController.prepareCanvas();

	this.userInterface = new UserInterface();
	this.userInterface.createInterface(this.players);
};

GameController.prototype.startGame = function(gameInstance)
{
	this.canvasController.grid = gameInstance.grid;
	this.canvasController.draw();
	this.userInterface.updateInterface(gameInstance.gameScore, gameInstance.time);
};

GameController.prototype.endGame = function(winner)
{
	//this.canvasController.prepareCanvas();
	this.userInterface.endGameInterface(winner);
};

GameController.prototype.updateScore = function(gameScore)
{
	this.userInterface.updateInterface(gameScore);
};

GameController.prototype.updateCanvas = function(grid, selected, aroundSelected)
{
	//console.log(aroundSelected);
	this.canvasController.grid = grid;
	this.canvasController.selectedTiles = selected || [[], []];
	this.canvasController.aroundSelected = aroundSelected[this.playerNumber] || [];
	this.canvasController.draw();
};