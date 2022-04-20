import { getSession } from "next-auth/client";

const db = require("../../../firebase");
const _ = require("lodash");

export default async function handler(req, res) {
  const session = await getSession({
    req,
  });

  if (!session) {
    res.status(401).json({
      error: "Unauthenticated user",
    });
  }

  const { body } = req;
  const docRef = db
    .collection("players")
    .doc(`${session.user?.email}-${req.query.playerName}`);
  docRef
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        const matches = doc.data().matches;
        const match = matches.filter((match) => match.id === req.query.matchId);
        const newMatch = { ...match[0], ...body };

        const oldMatches = matches.filter(
          (match) => match.id !== req.query.matchId
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
        res.status(404).send(`No matches with name: ${req.query.playerName}`);
      }
    })
    .catch((error) => {
      res.status(500).send("Error getting matches data: ", error);
    });
}
