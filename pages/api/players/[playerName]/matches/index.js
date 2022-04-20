const db = require("../../../firebase");
import { getSession } from "next-auth/client";

export default async function handler(req, res) {
  const session = await getSession({
    req,
  });

  if (!session) {
    res.status(401).json({
      error: "Unauthenticated user",
    });
  }

  const docRef = db
    .collection("players")
    .doc(`${session.user?.email}-${req.query.playerName}`);
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
}
