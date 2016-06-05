"use strict";

class Player
{
	constructor(id, socket, name)
	{
		this.id = id;
		this.socket = socket;
		this.status = 0;
		this.name = name;
		this.roomId =  -1;
	}
}

module.exports = Player;
