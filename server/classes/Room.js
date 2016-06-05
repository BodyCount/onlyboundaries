"use strict";

class Room
{
	constructor(id, hostId, players)
	{
		this.id = id;
		this.hostId = hostId;
		this.players = players || [];
		this.playersLimit = 2;
	}
}

module.exports = Room;