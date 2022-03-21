const app = require("express")();
const db = require("../../../firebase");
const _ = require("lodash");

app.put("/api/players/:playerName/matches/:matchId", async (req, res) => {
  const { body } = req;
  const docRef = db.collection("players").doc(req.params.playerName);
  docRef
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        const matches = doc.data().matches;
        const match = matches.filter(
          (match) => match.id === req.params.matchId
        );
        const newMatch = { ...match[0], ...body };

        const oldMatches = matches.filter(
          (match) => match.id !== req.params.matchId
        );

        const updateMatches = [...oldMatches, newMatch];

        const orderedMatchesData = _.orderBy(
          updateMatches,
          "createdAt",
          "desc"
        );

        const result = await docRef.update({ matches: orderedMatchesData });
        res
          .status(200)
          .send(
            `Match updated successfully: ${JSON.stringify(result)}` +
              "newmatch: " +
              JSON.stringify(newMatch)
          );
      } else {
        res.status(404).send(`No matches with name: ${req.params.playerName}`);
      }
    })
    .catch((error) => {
      res.status(500).send("Error getting matches data: ", error);
    });
});

module.exports = app;
