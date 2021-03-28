const express = require("express");
const path = require("path");

const app = express();

// serve react files.
app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get("/api/list", (req, res) => {
  const obj = { text: "yes it works" };
  res.json(obj);
});

app.listen(process.env.PORT || 5000);
