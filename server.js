const express = require("express");
const path = require('path')
const fs = require("fs");

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static('public'));


app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname,"/public/room.html"));
});

app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`)
);
