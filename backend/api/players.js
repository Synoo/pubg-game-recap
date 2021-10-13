const db = require("../firebase");
const axios = require("axios");
require("dotenv").config();

const headers = {
  Accept: "application/vnd.api+json",
  Authorization: process.env.REACT_APP_API_KEY,
};

exports.get = async (req, res) => {
  const result = await axios(
    `https://api.pubg.com/shards/steam/players?filter[playerNames]=${req.params.playerName}`,
    { headers }
  ).catch((err) => res.status(404).send("Player not found" + err));

    if(result.data) {
      const playerRef = db.collection('players').doc(req.params.playerName);
      const doc = await playerRef.get();
      if (!doc.exists) {
        const matchesIds = result.data.data[0].relationships.matches.data.map((matchId) => matchId.id);
        const playerId = result.data.data[0].id;
        const matchesData = await getMatchesData(matchesIds, playerId);
    
        const playerData = {
          playerName: req.params.playerName,
          matches: matchesData,
        }

        db.collection("players")
        .doc(req.params.playerName)
        .set(playerData)
        .then(() => {
          res.status(200).send("Player successfully added!");
        })
        .catch((error) => {
          res.status(500).send("Error writing player: ", error);
        });
      } else {
        const matchesIds = result.data.data[0].relationships.matches.data.map((matchId) => matchId.id);
        const dbMatchesIds = doc.data().matches.map((match) => (match.id))

        var filteredMatchesIds = matchesIds.filter((matchId) => !dbMatchesIds.includes(matchId));

        const playerId = result.data.data[0].id;
        const matchesData = await getMatchesData(filteredMatchesIds, playerId);

        const dbMatches = doc.data().matches;

        const newMatches = [...dbMatches, ...matchesData]

        await playerRef.update({matches: newMatches})
          .then(()=> {
            res.status(200).send("Player successfully updated!");
          })
          .catch((error) => {
            console.log(error);
          res.status(500).send("Error updating player: ", error);
        });
      }
    }
  }

const getMatchesData = async (matchesIds, playerId) => { 
  let matchesData = [];

  const promises = matchesIds.map(
    async (matchId) => {
      const match = await axios(
        "https://api.pubg.com/shards/steam/matches/" + matchId,
        { headers }
      );

      let rosterId = "";
      let matchData = {};

      match.data.included.map((z) => {
        if (z.attributes.stats) {
          if (z.attributes.stats.playerId === playerId) {
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

  return matchesData;}