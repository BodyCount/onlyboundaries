"use strict";

function Label(value, x, y, context, alignment, font)
{
	this.x = x;
	this.y = y;
	this.value = value;
	this.context = context;
	this.font = font || CONFIG.label.font;
	this.width = null;
	this.alignment = alignment || 0;

	this.createLabel();
}

Label.prototype.createLabel = function()
{
	this.context.font = this.font;
	this.width = this.context.measureText(this.value).width+10;
	switch(this.alignment)
	{
		case 0.5:
			this.x = this.x - this.width/2;
			break;
		case 1:
			this.x = this.x - this.width;
			break;
	}

	this.clearSpace();
	this.context.beginPath();
	this.context.fillStyle = "#000";
	this.context.fillText(this.value, this.x , this.y);
	this.context.closePath();
};

Label.prototype.clearSpace = function()
{
	this.context.clearRect(this.x-10, this.y - 20, this.width+15, 30);
};