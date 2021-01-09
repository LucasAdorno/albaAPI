const connection = require("../database/connection");

async function create() {
  const requests = await connection("data").select("*");
}

create()
  .then(() => console.log("ok"))
  .catch((err) => console.log(err));
