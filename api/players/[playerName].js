const app = require("express")();

app.get("/api/players/:playerName", async (req, res) => {
  res.send("HAHA" + req.query.playerName);
});

module.exports = app;
