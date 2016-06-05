"use strict";

var	GameInstance = require("../classes/GameInstance")
	, config = require("../static/config");

module.exports.init = function (gameIo, socket, socketsController)
{
	var playerId = socket.id// match ? match[1] : null;
	, player, room, playerNumber, interval;

	if (!socketsController.players[playerId])
	{
		socket.disconnect();
		return;
	}

	player = socketsController.players[playerId];
	player.status ++;
	room = socketsController.rooms[player.roomId];
	playerNumber = (room.hostId == player.id)? 0:1;

	gameIo.to(socket.id).emit("player_playerNumber", playerNumber);
	socket.join(room.id);
	startGame();
	function startGame()
	{
		gameIo.to(room.id).emit("game_prepareGame", socketsController.gameInstances[room.id]);

		if (socketsController.gameInstances[room.id].isStarted) return;
		interval = socketsController.gameInstances[room.id].createLoop(changeListener);

		var previousGameState;
		function changeListener()
		{
			if (socketsController.gameInstances[room.id].gameState === previousGameState) return;

			if (socketsController.gameInstances[room.id].gameState == 1)
			{
				gameIo.to(room.id).emit("game_startGame", socketsController.gameInstances[room.id]);
				previousGameState = socketsController.gameInstances[room.id].gameState;
			}
			else if (socketsController.gameInstances[room.id].gameState == 2)
			{
				gameIo.to(room.id).emit("game_endGame", socketsController.gameInstances[room.id]);
			//	gameInstance = null;
				delete socketsController.gameInstances[room.id];
			}
		}
	}

	socket.on("game_restart", function()
	{
		clearInterval(interval);
		if (socketsController.gameInstances[room.id]) return;

		socketsController.gameInstances[room.id] = new GameInstance(room);
		startGame();
	});

	socket.on("game_tile_onSelect", function(data)
	{
		if (!data || !data.tile || !socketsController.gameInstances[room.id]) return;

		let gameInstance = socketsController.gameInstances[room.id];
		gameInstance.checkTile(playerNumber, data.tile);
		gameIo.to(room.id).emit("game_grid_updateCanvas", {"grid": gameInstance.grid, "selected": gameInstance.selectedTiles, "aroundSelected": gameInstance.aroundSelected});
	});

	socket.on("game_tile_removeSelected", function()
	{
		if (!socketsController.gameInstances[room.id]) return;
		let gameInstance = socketsController.gameInstances[room.id];
		gameInstance.removeSelected(playerNumber);
		room.players = gameInstance.players;
		gameIo.to(room.id).emit("game_grid_updateCanvas", {"grid": gameInstance.grid, "selected": gameInstance.selectedTiles, "aroundSelected": gameInstance.aroundSelected});
		gameIo.to(room.id).emit("game_updateInfo", gameInstance.gameScore);
	});

	socket.on("ping", function() {
    socket.emit("pong");
  });

	socket.on("disconnect", function()
	{
		console.log("disconnect from game socket");
		gameIo.to(room.id).emit("player_disconnect");
		player.status = 2;
		socketsController.playerLeave(playerId);

		if (!socketsController.gameInstances[room.id]) return;
		clearInterval(interval);
		delete socketsController.gameInstances[room.id];
	});

	socket.on("debug_getEvent", function(data)
	{
		console.log(data.e);
	});
};
