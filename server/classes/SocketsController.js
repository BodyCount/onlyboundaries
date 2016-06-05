"use strict";

var e = require("../static/errors");

var Player = require("../classes/Player")
	, Room = require("../classes/Room")
	, GameInstance = require("../classes/GameInstance");

var PLAYERSTATUS = [1, 2, 3]; // 0 - connected, 1 - lobby, 2 - game//

class SocketsController
{
	constructor()
	{
		this.players = {};
		this.rooms = {};
		this.gameInstances = {};
	}

	createPlayer(socketId, playerId, name)
	{
		for (let k in this.players)
		{
			if (name === this.players[k].name)
				return {"error": e.errors[0]};
		}
		let player = new Player(playerId, socketId, name);
		player.status = PLAYERSTATUS[0];
		this.players[playerId] = player;
	}

	createRoom(playerId)
	{
		var player = this.players[playerId]
			, room, roomId, roomPlayers = [];

		roomId = parseInt(Math.random() * 50000);
		while(this.rooms[roomId]) // this is bad
		{
			roomId = parseInt(Math.random() * 50000)
		}

		player.roomId = roomId;
		player.status = PLAYERSTATUS[2];
		roomPlayers.push(player);
		room = new Room(roomId, playerId, roomPlayers);
		this.rooms[room.id] = room;

		return {"room":room};
	}

	joinRoom(playerId, roomName)
	{
		var player = this.players[playerId], host;
		for (let k in this.players)
			if (this.players[k].name === roomName)
				host = this.players[k];

		if (!host) return {"error": e.errors[2]};
		if (!this.rooms[host.roomId]) return {"error": e.errors[3]};

		let room = this.rooms[host.roomId];
		if (room.players.length < room.playersLimit)
		{
			player.roomId = room.id;
			player.status = PLAYERSTATUS[2];
			room.players.push(player);
			return {"room":room};
		}
		return {"error": e.errors[1]};
	}

	createGame(room)
	{
		this.gameInstances[room.id] = new GameInstance(room);
	}

	playerLeave(playerId)
	{
		if (!this.players[playerId]) return;
		var player = this.players[playerId];

		for (let k in this.rooms)
		{
			if (this.rooms[k].hostId == player.id)
			{
				player.roomId = -1;
				delete this.rooms[k];
			}
			else
			{
				var length = this.rooms[k].players.length;
				for (let i = 0; i < length; i++)
				{
					if (player.id != this.rooms[k].players[i].id) continue;
					player.roomId = -1;
					this.rooms[k].players.splice(i, 1);
				}
			}
		}
		player.status = PLAYERSTATUS[0];
	}
	playerDisconnect(playerId)
	{
		if (!this.players[playerId]) return;
		var player = this.players[playerId];

		if (this.players[player.id].roomId == -1)
		{
			delete this.players[player.id];
			return;
		}

		for (let k in this.rooms)
		{
			if (this.rooms[k].hostId == player.id)
				delete this.rooms[k];
			else
			{
				var length = this.rooms[k].players.length;
				for (let i = 0; i < length; i++)
				{
					if (player.id != this.rooms[k].players[i].id) continue;
					delete this.rooms[k].players[i];

				}
			}
		}
		delete this.players[player.id];
	}
}

module.exports = SocketsController;
