"use strict";
var gameSocket;
function DefaultSocket()
{
	this.socket = io(CONFIG.server.ip);
	this.player = null;
	this.room = null;
	this.rooms = null;
}

DefaultSocket.prototype.init = function()
{
	var socket = this.socket
		, that = this;

	/*
	socket.on("update_playerData", function(data)
	{
		that.player = data.player;
	});

	socket.on("update_roomData", function(room)
	{
		that.room = room;
		console.log(that.room);
	});
*/
	socket.on("view_renderStartPage", function(data)
	{
		document.body.innerHTML = data.body;
	});

	socket.on("view_renderMenu", function(data)
	{
		document.body.innerHTML = data.body;
	});

	socket.on("view_renderRooms", function(data)
	{
		socketHandlers.setRooms(data.body);
	});

	socket.on("view_renderLobby", function(data)
	{
		socketHandlers.createLobby(data);
	});

	socket.on("game_connectToGame", function()
	{
		gameSocket = new GameSocket();
		gameSocket.init();
	});

	socket.on("error", function(data)
	{
		var div = document.getElementById("aligner");
		if (document.getElementById("error"))
			document.getElementById("error").innerHTML = data.error;
		else
		{
			var err = document.createElement("div");
			err.id = "error";
			err.appendChild(document.createTextNode(data.error));
			div.appendChild(err);
		}
	});

	socket.on("disconnect", function()
	{
		var div = document.getElementById("aligner");
		div.style.cssText = "font-size:1.2em";
		div.innerHTML = "Looks like you are disconnected :(";
	});
};

DefaultSocket.prototype.sendName = function(name)
{
	this.socket.emit("player_login", {"name": name})
};

DefaultSocket.prototype.leave = function()
{
	this.socket.emit("player_leave");
};

DefaultSocket.prototype.joinRoom = function(roomName)
{
	this.socket.emit("player_joinRoom", {"roomName": roomName});
};

DefaultSocket.prototype.requestRooms = function()
{
	this.socket.emit("player_requestRooms");
};

DefaultSocket.prototype.sendGameStart = function()
{
	this.socket.emit("player_startGame");
};
