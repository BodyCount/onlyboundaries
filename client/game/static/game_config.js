;(function()
{
	"use strict";

	var config = {
			"server": {"ip": "192.168.1.101:3000"},
			"canvas": {"width":0, "height": 0, "styleWidth":0, "styleHeight":0, "scaleRatio":0},
			"grid": {"x": 0, "y": 0, width:"0", "indent": 45},
			"shape": {"radius":15},
			"player": {"x": 100, "y": 0, "font": "25px Raleway",  "lineSpacing": 20},
			"timer": {"position": 75, "font": "25px Raleway"},
			"label": {"font": "25px Raleway"},
			"button": {"font": "17px Raleway"}
	};

	setConfig();

	function setConfig()
	{
		var width = document.body.clientWidth
			, height = document.body.clientHeight;

		console.log(width);
		console.log(height);

		var canvas = document.createElement("canvas") //dummy canvas just to check device scale ratio below
			, context = canvas.getContext("2d");

		var devicePixelRatio = window.devicePixelRatio || 1
			, backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio ||context.backingStorePixelRatio || 1
			, ratio = devicePixelRatio / backingStoreRatio;

		config.canvas.width = width * ratio;
		config.canvas.height = height * ratio;
		config.canvas.styleWidth = width + 'px';
		config.canvas.styleHeight = height + 'px';
		config.canvas.scaleRatio = ratio;

		config.grid.width = (config.grid.indent+config.shape.radius)*5;
		config.grid.x = width/2 - config.grid.width/2;
		config.grid.y = height/2 - config.grid.width/2;
	}

	window.CONFIG = config;
})();
