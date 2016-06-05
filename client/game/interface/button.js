"use strict";

function Button(value, x, y, context, alignment, width)
{
	this.x = x;
	this.y = y;
	this.value = value;
	this.context = context;
	this.font = CONFIG.button.font;
	this.width = width || null;
	this.textWidth = null;
	this.height = 0;
	this.alignment = alignment || 0;
	this.onclick = null;

	this.createButton();
}

Button.prototype.createButton = function()
{
	switch(this.alignment)
	{
		case 0.5:
			this.x = this.x - this.width/2;
			break;
		case 1:
			this.x = this.x - this.width;
			break;
	}

	this.context.font = this.font;
	this.width = this.width || this.context.measureText(this.value).width+10;
	this.textWidth = this.context.measureText(this.value).width;
	this.height = 30;

	this.context.save();
	this.context.globalAlpha = 0.5;
	this.context.strokeStyle = "#000";
	this.context.rect(this.x, this.y, this.width, this.height);
	this.context.stroke();
	this.context.restore();

	this.context.fillStyle = "#000";
	this.context.fillText(this.value, this.x + this.width/2 - this.textWidth/2, this.y+20);
	this.context.closePath();
};

Button.prototype.click = function()
{
	this.onclick();
};

Button.prototype.contains = function(x, y)
{
	return (x >= this.x ) && ( x <= this.x + this.width) &&
				 (y >= this.y) && (y <= this.y + this.height);
};