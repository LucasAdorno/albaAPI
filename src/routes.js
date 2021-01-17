const express = require("express");
const ScrapeController = require("./controllers/ScrapeController.js");
const FullDataController = require("./controllers/FullDataController.js");
const SearchController = require("./controllers/SearchController.js");


const routes = express.Router();

routes.get("/results", ScrapeController.create);
routes.post("/fulldata", FullDataController.create);
routes.post("/inputsearch", SearchController.create);


module.exports = routes;
