const app = require("express")();
const db = require("../../firebase");

app.get = async (req, res) => {
  const docRef = db.collection("players").doc(req.query.playerName);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.json(doc.data());
      } else {
        res.status(404).send(`No matches with name: ${req.query.playerName}`);
      }
    })
    .catch((error) => {
      res.status(500).send("Error getting matches data: ", error);
    });
};

module.exports = app;
