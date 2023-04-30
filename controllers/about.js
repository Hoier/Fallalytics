const cacheHandler = require('../util/cachehandler');
module.exports = (req, res)=> {
	res.set('Cache-control', cacheHandler.cacheControlHeader);
	res.render("about", { title: "About"});
};