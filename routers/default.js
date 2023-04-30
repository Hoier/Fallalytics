const { Router } = require('express');
const app = Router();

//require controllers
const about = require('../controllers/about');
const update = require('../controllers/update');
const index = require('../controllers/index');
const meta = require('../controllers/meta');
const shows = require('../controllers/shows');
const rounds = require('../controllers/rounds');
const round = require('../controllers/round');
const roundsall = require('../controllers/roundsall');
const median = require('../controllers/median');

//Static pages
app.get('/about', about);
app.get('/update', update);

//Front page
app.get('/', index);

//Stats pages
app.get('/meta', meta);
app.get('/shows/*', shows);
app.get('/rounds', rounds);
app.get('/rounds/*', round);
app.get('/roundsall', roundsall);
app.get('/roundsall24', roundsall);
app.get('/median', median);

module.exports = app;