"use strict";

function GameSocket()
{
  this.socket = null;
  this.gameController = null;
  this.ping = null;
  //this.room = room;
}

GameSocket.prototype.init = function()
{
  this.socket = io(CONFIG.server.ip+"/game");


  this.ping = this.getPing();

  var socket = this.socket
    , that = this;
  var playerNumber;

  console.log(this.socket);
  if (this.socket.connected === false)
  {
    this.socket.io.reconnect();
    console.log("yey");
  }

  socket.on("player_playerNumber", function(_playerNumber)
  {
    playerNumber = _playerNumber;
  });

  socket.on("game_prepareGame", function(gameInstance)
  {
    that.gameController = new GameController(gameInstance, playerNumber);
    that.gameController.init(gameInstance.players, gameInstance.prepTime, gameInstance.time);
  });

  socket.on("game_startGame", function(gameInstance)
  {
    that.gameController.startGame(gameInstance);
  });

  socket.on("game_endGame", function(gameInstance)
  {
    console.log(gameInstance);
    that.gameController.endGame(gameInstance.winner);
  });

  socket.on("game_updateInfo", function(gameScore)
  {
    that.gameController.updateScore(gameScore);
  });

  socket.on("game_grid_updateCanvas", function(gameInstance)
  {
    //console.log(gameInstance);
    that.gameController.updateCanvas(gameInstance.grid, gameInstance.selected, gameInstance.aroundSelected);
  });

  socket.on("player_disconnect", function(data)
  {
    document.body.innerHTML = "Player has left";
  });
};

GameSocket.prototype.selectTile = function(tile)
{
  this.socket.emit("game_tile_onSelect", {"tile": tile});
};

GameSocket.prototype.removeSelected = function()
{
  this.socket.emit("game_tile_removeSelected");
};

GameSocket.prototype.leaveGame = function()
{
  this.socket.disconnect();
  defaultSocket.leave();
};

GameSocket.prototype.restartGame = function()
{
  this.socket.emit("game_restart");
};

GameSocket.prototype.sendEvent = function(e)
{
  this.socket.emit("debug_getEvent", {"e":e});
};

GameSocket.prototype.getPing = function()
{
  var startTime, latency, that = this;

  setInterval(function(){startTime = Date.now();that.socket.emit('ping');}, 2000);

  that.socket.on('pong', function()
  {
    latency = Date.now() - startTime;
    that.ping = latency;
    console.log("Ping: "+that.ping);
  });
};
