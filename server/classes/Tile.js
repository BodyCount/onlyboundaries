"use strict";

var config = require("../static/config");

class Tile
{
	constructor(type, row, col, clicks)
	{
		this.clicks =  clicks || 0;
		this.type = type;
		this.row = row;
		this.col 	= col;	

	}
}

module.exports = Tile;