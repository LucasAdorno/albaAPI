const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { eventNames } = require("./database/connection");
const { loop } = require("./scripts/scrape.js");

// setInterval(() => {
//   loop();
// }, 1000);
loop();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 8080);