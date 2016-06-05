var defaultSocket = new DefaultSocket();
;(function(defaultSocket)
{
	"use strict";

	var socketHandlers = {};
	defaultSocket.init();
	generateHash();


	function createLobby(data, rooms)
	{
		document.body.innerHTML = data.body;
	}

	function connectToGame()
	{
		defaultSocket.requestRooms();
	}

	function sendName()
	{
		var nameField = document.getElementById("player_name");

		if (nameField.value)
			defaultSocket.sendName(nameField.value)
	}

	function createGame()
	{
		defaultSocket.socket.emit("player_createRoom");
	}

	function joinRoom(roomName)
	{
		if (!arguments.length != 0)
		{
			var gameId = document.getElementById("room_name").value;
			if (gameId != 0)
				defaultSocket.joinRoom(gameId);
		}
		else if (roomName)
			defaultSocket.joinRoom(roomName);
	}

	function setRooms(body)
	{
		document.body.innerHTML = body;
	}

	function startGame()
	{
		defaultSocket.sendGameStart();
	}

	function leave()
	{
		defaultSocket.leave();
	}
	function generateHash()
	{
		if (!/\buser_id=/.test(document.cookie))
		{
			var length = 32
				, arr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', hash = '';
			for (var i = 0; i < length; i++)
			{
				var symIndex = Math.floor(Math.random() * arr.length);
				hash += arr.charAt(symIndex);
			}
			document.cookie = 'user_id=' + hash;
		}
	}
	socketHandlers.createLobby = createLobby;
	socketHandlers.connectToGame = connectToGame;
	socketHandlers.sendName = sendName;
	socketHandlers.createGame = createGame;
	socketHandlers.joinRoom = joinRoom;
	socketHandlers.setRooms = setRooms;
	socketHandlers.startGame = startGame;
	socketHandlers.leave = leave;
	//socketHandlers.generateHash = generateHash;

	window.socketHandlers = socketHandlers;

}(defaultSocket));
