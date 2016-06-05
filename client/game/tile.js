"use strict";

function Tile(x, y, row, col, type, context)
{
	this.isClickable = true;

	this.x = x;
	this.y = y;

	this.row = row;
	this.col = col;
	this.type = type;

	this.context = context;
	this.color = COLORS[type];
	this.radius = CONFIG.shape.radius;
	this.sAngle = 0;
	this.eAngle = 1.2*Math.PI;
	this.strokeStyle = "#fff";
	this.fillStyle = this.color;
}

Tile.prototype.draw = function()
{
	this.context.beginPath();
	this.context.arc(this.x, this.y, this.radius, this.sAngle, this.eAngle);
	this.context.fillStyle = this.fillStyle;
	this.context.fill();
	this.context.strokeStyle = this.strokeStyle;
	this.context.stroke();
	this.context.closePath();
};

Tile.prototype.fadeout = function()
{

};
Tile.prototype.contains = function(x, y)
{
	return (x >= this.x-this.radius) && (x <= this.x + this.radius) &&
	       (y >= this.y-this.radius) && (y <= this.y + this.radius);
};
