require("dotenv").config();
const players = require("express").Router();

players.get = async (req, res) => {
  res.send("HAHA");
};

module.exports = players;
