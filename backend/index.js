const express = require("express");
const axios = require("axios");
// const firebase = require("./firebase");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const headers = {
  Accept: "application/vnd.api+json",
  Authorization: process.env.REACT_APP_API_KEY,
};

app.get("/api/:playerName", async (req, res) => {
  const result = await axios(
    `https://api.pubg.com/shards/steam/players?filter[playerNames]=${req.params.playerName}`,
    { headers }
  ).catch((err) => res.status(404).send("Player not found" + err));

  if (result.data) {
    let matchesData = [];

    const promises = result.data.data[0].relationships.matches.data.map(
      async (matchId) => {
        const match = await axios(
          "https://api.pubg.com/shards/steam/matches/" + matchId.id,
          { headers }
        );

        let rosterId = "";
        let matchData = {};

        match.data.included.map((z) => {
          if (z.attributes.stats) {
            if (z.attributes.stats.playerId === result.data.data[0].id) {
              matchData = {
                id: match.data.data.id,
                createdAt: match.data.data.attributes.createdAt,
                mapName: match.data.data.attributes.mapName,
                matchType: match.data.data.attributes.matchType,
                kills: z.attributes.stats.kills,
                assists: z.attributes.stats.assists,
                damage: z.attributes.stats.damageDealt,
                timeSurvived: z.attributes.stats.timeSurvived,
                winPlace: z.attributes.stats.winPlace,
              };
              rosterId = z.id;
            }
          }
        });

        let roster = "";

        match.data.included.map((x) => {
          if (x.relationships) {
            x.relationships.participants.data.map((y) => {
              if (rosterId === y.id) {
                roster = x;
              }
            });
          }
        });

        let rosterNames = [];
        roster.relationships.participants.data.map((a) => {
          if (rosterId !== a.id) {
            match.data.included.map((z) => {
              if (z.id === a.id) {
                rosterNames = [...rosterNames, z.attributes.stats.name];
              }
            });
          }
        });

        if (rosterNames.length > 0) {
          matchData = { ...matchData, rosterNames };
        }
        matchesData = [...matchesData, matchData];
        return matchesData;
      }
    );

    await Promise.all(promises);

    const playerData = {
      playerName: req.params.playerName,
      matches: matchesData,
    };

    if (req.params.playerName) {
      await db
        .collection("players")
        .doc(req.params.playerName)
        .set(playerData)
        .then(() => {
          res.status(200).send("Player successfully added!");
        })
        .catch((error) => {
          res.status(500).send("Error writing document: ", error);
        });
    }
  }
});

app.get("/api/test/:playerName", async (req, res) => {
  const docRef = db.collection("players").doc(req.params.playerName);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.json(doc.data());
      } else {
        res.status(404).send(`No document with name: ${req.params.playerName}`);
      }
    })
    .catch((error) => {
      res.status(500).send("Error getting document: ", error);
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
