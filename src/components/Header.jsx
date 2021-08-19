import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "../firebase";
import axios from "axios";

const Header = () => {
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState({});
  const history = useHistory();

  const headers = {
    Accept: "application/vnd.api+json",
    Authorization: process.env.REACT_APP_API_KEY,
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      const fetchData = async () => {
        const result = await axios(
          `https://api.pubg.com/shards/steam/players?filter[playerNames]=${playerName}`,
          { headers }
        );

        const match = await axios(
          "https://api.pubg.com/shards/steam/matches/" +
            result.data.data[0].relationships.matches.data[0].id,
          { headers }
        );

        let rosterId = "";
        let matchData = {};

        await match.data.included.map((z) => {
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

        await match.data.included.map((x) => {
          if (x.relationships) {
            x.relationships.participants.data.map((y) => {
              if (rosterId === y.id) {
                roster = x;
              }
            });
          }
        });

        let rosterNames = [];
        await roster.relationships.participants.data.map((a) => {
          if (rosterId !== a.id) {
            match.data.included.map((z) => {
              if (z.id === a.id) {
                rosterNames = [...rosterNames, z.attributes.stats.name];
              }
            });
          }
        });

        matchData = { ...matchData, rosterNames };

        setPlayerData({
          name: playerName,
          matches: [matchData],
        });
      };
      if (playerName) {
        fetchData();
      }

      history.push(`/${playerName}`);
    }
  };

  useEffect(() => {
    const setData = async () => {
      if (playerName) {
        const db = firebase.firestore();
        await db
          .collection("players")
          .doc(playerName)
          .set(playerData)
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      }
    };
    setData();
  }, [playerData]);

  return (
    <div className="bg-gray-900 flex">
      <Link to="/" className="text-3xl text-green-300 py-5 pl-20 pr-20">
        PUBG Game Recap
      </Link>
      <Link to={`/${playerName}`} className="text-green-300 p-7">
        Matches
      </Link>
      <Link to="/graph" className="text-green-300 p-7">
        Graph
      </Link>
      <input
        className="bg-gray-800 h-10 m-5 rounded-xl text-green-300 placeholder-green-300 placeholder-opacity-50 border-none focus:outline-none p-5"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        onKeyPress={(e) => onEnter(e)}
        placeholder="Enter PUBG name"
      />
    </div>
  );
};

export default Header;
