// index.js
/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
var bodyParser = require('body-parser');
const defaultRouter = require('./routers/default');

const populateDB = require('./util/populatedb');
/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 *  Set up local environment if not prod
 */
if(!process.env.DEPLOYMENT || process.env.DEPLOYMENT != "prod"){
  populateDB.clearDB();
}else{
  const apiRouter = require('./routers/api');
  app.use(apiRouter);
}

/**
 * Routes Definitions
 */
app.use(defaultRouter);


app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
	bodyParser.json()
);

app.set('trust proxy', true);

/**
 * Server Activation
 */
app.listen(port, () => {
	console.log(`Listening to requests on http://localhost:${port}`);
});