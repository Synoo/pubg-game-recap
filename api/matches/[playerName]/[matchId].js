const app = require("express")();
const db = require("../firebase");
const _ = require("lodash");

app.put = async (req, res) => {
  const docRef = db.collection("players").doc(req.params.playerName);
  docRef
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        const matches = doc.data().matches;
        const match = matches.filter(
          (match) => match.id === req.params.matchId
        );
        const newMatch = { ...match[0], ...req.body };

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
        res.status(200).send(`Match updated successfully: ${result}`);
      } else {
        res.status(404).send(`No matches with name: ${req.params.playerName}`);
      }
    })
    .catch((error) => {
      res.status(500).send("Error getting matches data: ", error);
    });
};

module.exports = app;
