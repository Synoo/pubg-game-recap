const db = require("../firebase");

exports.list = async (req, res) => {
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
};
