const db = require("../../../firebase");

export default async function handler(req, res) {
  const docRef = db.collection("players").doc(req.query.playerName);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        let filteredList;
        if (req.query.limit === "all") {
          filteredList = doc.data().matches;
        } else {
          filteredList = doc.data().matches.slice(0, req.query.limit);
        }

        const aim = [];
        const driving = [];
        const rotation = [];
        const movement = [];
        const position = [];
        const parachute = [];
        const aggressive = [];
        const passive = [];
        const flushing = [];
        const hardpeek = [];
        const communication = [];
        const utility = [];
        const comments = [];

        filteredList.map((match) => {
          aim.push(match.aim);
          driving.push(match.driving);
          rotation.push(match.rotation);
          movement.push(match.movement);
          position.push(match.position);
          parachute.push(match.parachute);
          aggressive.push(match.aggressive);
          passive.push(match.passive);
          flushing.push(match.flushing);
          hardpeek.push(match.hardpeek);
          communication.push(match.communication);
          utility.push(match.utility);
          if (match.comment) {
            comments.push(match.comment);
          }
        });

        const graphData = [
          { name: "aim", value: aim.filter(Boolean).length },
          { name: "driving", value: driving.filter(Boolean).length },
          { name: "rotation", value: rotation.filter(Boolean).length },
          { name: "movement", value: movement.filter(Boolean).length },
          { name: "position", value: position.filter(Boolean).length },
          { name: "parachute", value: parachute.filter(Boolean).length },
          { name: "aggressive", value: aggressive.filter(Boolean).length },
          { name: "passive", value: passive.filter(Boolean).length },
          { name: "flushing", value: flushing.filter(Boolean).length },
          { name: "hardpeek", value: hardpeek.filter(Boolean).length },
          {
            name: "communication",
            value: communication.filter(Boolean).length,
          },
          { name: "utility", value: utility.filter(Boolean).length },
        ];

        const data = {
          comments: comments,
          graphData: graphData,
        };

        res.json(data);
      } else {
        res.status(404).send(`No matches with name: ${req.query.playerName}`);
      }
    })
    .catch((error) => {
      res.status(500).send("Error getting matches data: ", error);
    });
}
