var express = require("express")
	, app = express()
	, server = require("http").Server(app)
	, routes = require("./server/routes");
var io = require("socket.io")(server)
	, gameIo = io.of("/game");
var defaultSockets = require("./server/sockets/default_sockets")
	, gameSockets = require("./server/sockets/game_sockets")
	, SocketsController = require("./server/classes/SocketsController");

app.use('/static', express.static(__dirname + '/server/views/public'));
app.use('/client', express.static(__dirname + '/client'));

app.set('view engine', 'jade');
app.set('views', './server/views');

server.listen(3000);

routes.init(app);

var socketsController = new SocketsController();

io.on("connection", function (socket)
{
	defaultSockets.init(io, socket, app, socketsController);
});

gameIo.on("connection", function (socket)
{
	console.log("new user connected to game socket");
	gameSockets.init(gameIo, socket, socketsController);
});
