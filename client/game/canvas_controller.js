"use strict";

function CanvasController(grid, playerNumber)
{
  this.grid = grid;
  this.tileGrid = [];
  this.selectedTiles = [[], []];
  this.aroundSelected = [];
  this.playerNumber = playerNumber;

  this.canvas = this.createCanvas();
  this.scaleRatio = CONFIG.canvas.ratio;
  this.context = this.canvas.getContext("2d");
  this.createInputHandlers();
}

CanvasController.prototype.createInputHandlers = function()
{
  var that = this
    , canvas = this.canvas;

  canvas.addEventListener("mousedown", clickHandler, false);
  canvas.addEventListener("touchstart", clickHandler, false);
  canvas.addEventListener("mousemove", moveHandler, false);
  canvas.addEventListener("touchmove", moveHandler, false);
  canvas.addEventListener("mouseup", endHandler, false);
  canvas.addEventListener("touchend", endHandler, false);

  function clickHandler(e)
  {
    e.preventDefault();
    var mouse = that.getMouse(e);

    for (var i = 0; i < that.tileGrid.length; i++)
    {
      for (var j = 0; j < that.tileGrid[i].length; j++)
      {
        var tile = that.tileGrid[j][i];
        if (tile.isClickable && tile.contains(mouse.x, mouse.y))
          gameSocket.selectTile(tile);

      }
    }
  }

  function moveHandler(e)
  {
    e.preventDefault();
    var mouse = that.getMouse(e);

    if (that.selectedTiles[that.playerNumber].length > 0 && that.aroundSelected.length > 0)
    {
      for (var i = 0; i < that.tileGrid.length; i++)
      {
        for (var j = 0; j < that.tileGrid[i].length; j++)
        {
          var tile = that.tileGrid[j][i];
          if (tile.isClickable && tile.contains(mouse.x, mouse.y))
          {
            for (var k in that.selectedTiles[that.playerNumber])
              if (tile.row == that.selectedTiles[that.playerNumber][k].row && tile.col == that.selectedTiles[that.playerNumber][k].col)
                return;
            for (var k in that.aroundSelected)
              if (tile.row == that.aroundSelected[k].row && tile.col == that.aroundSelected[k].col)
                gameSocket.selectTile(tile);
          }
        }
      }
    }
  }

  function endHandler(e)
  {
    e.preventDefault();
    if (that.selectedTiles[that.playerNumber].length > 0)
      that.removeSelected();
  }
};

CanvasController.prototype.createCanvas = function()
{
  var canvas = document.createElement("canvas")
    , context = canvas.getContext("2d");

  canvas.width = CONFIG.canvas.width;
  canvas.height = CONFIG.canvas.height;
  canvas.style.width = CONFIG.canvas.styleWidth;
  canvas.style.height = CONFIG.canvas.styleHeight;
  context.scale(CONFIG.canvas.scaleRatio, CONFIG.canvas.scaleRatio);

  document.body.innerHTML = "";
  canvas.id ="main_canvas";

  document.body.appendChild(canvas);
  return canvas;

};

CanvasController.prototype.prepareCanvas = function()
{
  var indent = CONFIG.grid.indent;
  for (var i = 0; i < this.grid.length; i++)
  {
    this.tileGrid[i] = [];
    for (var j = 0; j < this.grid[i].length; j++)
    {
      var t = this.grid[j][i];
      var tile = new Tile(CONFIG.grid.x + (indent*i), CONFIG.grid.y + (indent*j), t.row, t.col, "0", this.context);
      tile.fillStyle = "#fff";
      tile.strokeStyle = "#000";
      tile.eAngle = 2*Math.PI;
			tile.isClickable = false;
      tile.draw();
    }
  }
};

CanvasController.prototype.draw = function()
{
  this.clear();
  var indent = CONFIG.grid.indent;
  for (var i = 0; i < this.grid.length; i++)
  {
    this.tileGrid[i] = [];
    for (var j = 0; j < this.grid[i].length; j++)
    {
      var t = this.grid[j][i];
      var tile = new Tile(CONFIG.grid.x + (indent * i), CONFIG.grid.y + (indent * j), t.row, t.col, t.type, this.context);
      if (tile.type === "-1") tile.isClickable = false;
        for (var k in this.selectedTiles)
          if (this.selectedTiles[k].length > 0)
            for (var x = 0; x < this.selectedTiles[k].length; x++)
              if (tile.row == this.selectedTiles[k][x].row && tile.col == this.selectedTiles[k][x].col)
                tile.eAngle = 2*Math.PI;


      this.tileGrid[i][j] = tile;
      tile.draw();
    }

  }
};

CanvasController.prototype.removeSelected = function()
{
  gameSocket.removeSelected();
};

CanvasController.prototype.getMouse = function(e)
{
  e = (e.touches)? e.touches[0]:e;
  return {x: e.clientX, y: e.clientY};
};

CanvasController.prototype.clear = function ()
{
  this.tileGrid = [];
  var w = CONFIG.grid.width
    , radius = CONFIG.shape.radius;

  this.context.clearRect(CONFIG.grid.x - radius - 4, CONFIG.grid.y - radius - 4, w + 6, w + 6);
};
