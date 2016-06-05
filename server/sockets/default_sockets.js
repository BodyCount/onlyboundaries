"use strict";

module.exports.init = function (io, socket, app, socketsController)
{
	//var cookie = socket.handshake.headers.cookie
		//, match = cookie.match(/\buser_id=([a-zA-Z0-9]{32})/)
		var playerId = socket.id,
				 room;

	app.render("start_page", function(err, html)
	{
		if (err) console.log(err);
		io.to(socket.id).emit("view_renderStartPage", {"body": html});
	});

	function sendNewData() {
		var player;
		for (var k in socketsController.players)
		{
			if (socketsController.players[k].status == 2)
			{
				console.log("yes");
				var hide = (Object.keys(socketsController.rooms)[0]) ? 1 : 0;
				player = socketsController.players[k];

				app.render("join", {hide: hide, rooms: socketsController.rooms}, function (err, html) {
					if (err) console.log(err);
					io.to(player.socket).emit("view_renderRooms", {"body": html});
				});

			}
		}
	}
/*
	function sendRoom(roomId)
	{
		io.to(roomId).emit("update_roomData", {"room": socketsController.rooms[roomId]});
	}
*/
	socket.on("player_login", function(data)
	{
		let result = socketsController.createPlayer(socket.id, playerId, data.name);
		if (!result)
		{
			app.render("menu", function(err,html)
			{
				if (err) console.log(err);
				io.to(socket.id).emit("view_renderMenu", {"body": html});
			});
		}
		else io.to(socket.id).emit("error", {error: result.error});
	});

	socket.on("player_createRoom", function()
	{
		var result = socketsController.createRoom(playerId);
		room = result.room;

		socket.join(room.id);
		sendNewData();
		//sendRoom(room.id);
		app.render("lobby", {room: room}, function(err, html)
		{
			if (err) console.log(err);
			io.to(room.id).emit("view_renderLobby", {"body": html});
		});
	});

	socket.on("player_joinRoom", function(data)
	{
		var result = socketsController.joinRoom(playerId, data.roomName);
		if (!result.error)
		{
			room = result.room;
			socket.join(room.id);
			sendNewData();
			app.render("lobby", {room: room}, function(err, html)
			{
				if (err) console.log(err);
				io.to(room.id).emit("view_renderLobby", {"body": html});
			});
		}
		else
			io.to(socket.id).emit("error", {error: result.error});
	});

	socket.on("player_requestRooms", function()
	{
		var player = socketsController.players[playerId];
		player.status++;
		var hide = (Object.keys(socketsController.rooms)[0])? 1:0;
		app.render("join", {hide: hide, rooms: socketsController.rooms}, function(err, html)
		{
			if (err) console.log(err);
			io.to(socket.id).emit("view_renderRooms", {"body": html});
		});
	});

	socket.on("player_startGame", function()
	{
		var player = socketsController.players[playerId];

		room = socketsController.rooms[player.roomId];

		//if (room.players.length === room.playersLimit && player.id === room.hostId)
		//{
			socketsController.createGame(room);
			io.to(room.id).emit("game_connectToGame");
		//}
	});

	socket.on("player_leave", function()
	{
		var player, room;
		if (socketsController.players[playerId].status == 3)
		{
			player = socketsController.players[playerId];

			for (var k in socketsController.rooms)
				if (socketsController.rooms[k].hostId == player.id)
				{
					room = socketsController.rooms[k];
					socketsController.playerLeave(playerId);
					app.render("menu", function(err,html)
					{
						if (err) console.log(err);
						io.to(room.id).emit("view_renderMenu", {"body": html});
					});
					if (room.players[1])
						io.to(room.players[1].id).emit("error", {error: "Host left"});

				}
				else
				{
					socketsController.playerLeave(playerId);
					room = socketsController.rooms[k];
					app.render("lobby", {room: room}, function(err, html)
					{
						if (err) console.log(err);
						io.to(room.id).emit("view_renderLobby", {"body": html});
					});
				}
			sendNewData();
			return;
		}

		socketsController.playerLeave(playerId);
		app.render("menu", function(err,html)
		{
			if (err) console.log(err);
			io.to(socket.id).emit("view_renderMenu", {"body": html});
		});
	});

	socket.on("disconnect", function()
	{
		console.log("disconnect from default socket");
		socketsController.playerDisconnect(playerId);
		sendNewData();
	});

};
	/*
	if (players[playerId])
	{
		playerNumber = players[playerId];
		var player = players[playerId];
		player.socket = socket.id;
		console.log("player reconnected");

		switch(player.status)
		{
			case 0 :
				app.render("connection", function(err,html)
				{
					io.to(player.socket).emit("playerCreated", {"body": html});
				});
				break;
			case 1:
				if (rooms[player.name])
				{
					let room = rooms[player.name]
					socket.join(room.name);
					app.render("lobby", function(err, html)
					{
						io.to(player.socket).emit("connectToGame", {"body": html, "room": room});
					})
				}
		}
	}
	*/
