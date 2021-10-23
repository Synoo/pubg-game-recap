const express = require("express");
const cors = require("cors");

const matches = require("./api/matches");
const players = require("./api/players");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/api/players/:playerName", players.get);
app.get("/api/matches/:playerName", matches.list);
app.get("/api/matches/:playerName/:limit", matches.filteredList);
app.put("/api/matches/:playerName/:matchId", matches.update);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
