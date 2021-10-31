const express = require("express");
const cors = require("cors");

const matches = require("./routes/matches");
const players = require("./routes/players");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/api/players/:playerName", players.get);
app.get("/api/players/:playerName/matches", matches.list);
app.get("/api/players/:playerName/limit/:limit", matches.filteredList);
app.put("/api/players/:playerName/matches/:matchId", matches.update);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
