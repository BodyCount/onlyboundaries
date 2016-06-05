"use strict";

var CONFIG = require("../static/config")
	, Tile = require("./tile");

class GameInstance
{
	constructor(room)
	{
		this.isStarted = false;
		this.room = room;
		this.time = CONFIG.game.prepTime;
		this.gameState = 0;
		this.players = room.players;
		this.grid = null; //this.createGrid();
		this.selectedTiles = [[], []];
		this.aroundSelected = [[], []];
		this.gameScore = [0,0];
		this.winner = null;
	}

	createLoop(callback)
	{
		this.isStarted = true;
		this.gameState = 0;

		var that = this;

		var timeInterval = function()
		{
			if (that.time > 0)
				that.time--;
			else if (that.gameState == 0) 
			{
				that.gameState++;
				that.grid = that.createGrid();
				that.time = CONFIG.game.roundTime;
				callback();
			}
			else if (that.gameState == 1)
			{
				that.gameState++;
				that.winner = that.endGame();
				clearInterval(interval);
				callback();
			}
		};
		timeInterval();
		var interval = setInterval(timeInterval, 1000);
		return interval;
	}

	createGrid()
	{
		var grid = [], type;

		for (let i = 0; i < CONFIG.grid.width; i++)
		{
			grid[i] = [];
			for (let j = 0; j < CONFIG.grid.height; j++)
			{
				type = (this.gameState == 0)? "-1":getRandomTile();
				grid[i][j] = new Tile(type, i, j);
			}
		}
		return grid;
	}

	checkTile(playerNumber, tile)
	{
		for (var i = 0; i < this.selectedTiles.length; i++)
			if (this.selectedTiles[i].length > 0)
				for (var j = 0; j < this.selectedTiles[i].length; j++)
					if (tile.row == this.selectedTiles[i][j].row && tile.col == this.selectedTiles[i][j].col)
						return;

		if (this.selectedTiles[playerNumber].length > 0)
		{
			for (var i = 0; i < this.selectedTiles[playerNumber].length; i++)
				if (tile.row == this.selectedTiles[playerNumber][i].row && tile.col == this.selectedTiles[playerNumber][i].col)
					return;

			for (var i = 0; i < this.aroundSelected[playerNumber].length; i++)
			{
				if (tile.row == this.aroundSelected[playerNumber][i].row && tile.col == this.aroundSelected[playerNumber][i].col)
				{
					this.getNearest(playerNumber, tile);
					this.selectTile(playerNumber, tile);
				}
			}
		}
		else this.selectTile(playerNumber, tile);
	}

	selectTile(playerNumber, tile)
	{
		for (let i = 0; i < this.grid.length; i++)
			for (let j = 0; j < this.grid[i].length; j++)
				if (this.grid[i][j].row == tile.row && this.grid[i][j].col == tile.col)
				{
					if (this.grid[i][j].type !=0) this.grid[i][j].clicks++;
					this.getNearest(playerNumber, tile);
					this.selectedTiles[playerNumber].push(this.grid[i][j]);
				}
	}

	getNearest(playerNumber, tile)
	{
		this.aroundSelected[playerNumber] = [];
		for (var i = tile.row-1; i <= tile.row+1; i++)
			for (var j = tile.col-1; j <= tile.col+1; j++)
				if (i >= 0 && j >= 0)
					if ((i < this.grid.length) && (j<this.grid[i].length))
						if (i != tile.row || j != tile.col)
							if (tile.type == this.grid[i][j].type)
								this.aroundSelected[playerNumber].push(this.grid[i][j]);
	}

	removeSelected(playerNumber)
	{
		if (this.selectedTiles[playerNumber].length == 0) return;

		for (var i = 0; i < this.grid.length; i++)
			for (var j = 0; j < this.grid[i].length; j++)
				for (var k in this.selectedTiles[playerNumber])
					if (this.grid[i][j].row == this.selectedTiles[playerNumber][k].row && this.grid[i][j].col == this.selectedTiles[playerNumber][k].col)
					{
						var type = getRandomTile();
						while (type == this.selectedTiles[playerNumber][k].type)
							type = getRandomTile();
						this.grid[i][j] = new Tile(type, i, j, this.grid[i][j].clicks);
					}


		this.calculateScore(playerNumber, this.selectedTiles[playerNumber]);
		this.selectedTiles[playerNumber] = [];
	}

	calculateScore(currentPlayer, selectedTiles)
	{
		this.gameScore[currentPlayer] += Math.pow(selectedTiles.length, 2);
	}

	endGame()
	{
		if (this.gameScore[0] > this.gameScore[1])
			return this.players[0];
		else
			return this.players[1];
	}
}

var getRandomTile = () => Math.floor(Math.random() * CONFIG.game.tilesAmount);

module.exports = GameInstance;
