module.exports.init = function(app)
{
	app.get("/", function(req, res, next)
	{
	  res.render("index");
	  next();
	});
};