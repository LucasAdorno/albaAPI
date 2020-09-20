const express = require('express');
const ScrapeController = require('./controllers/ScrapeController.js')
const routes = express.Router();

routes.get('/results', ScrapeController.create);

module.exports = routes;
