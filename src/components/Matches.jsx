import React, { useEffect, useState } from "react";
import axios from "axios";

const Matches = () => {
  const [match, setMatch] = useState("");
  const [kills, setKills] = useState("");
  const [assists, setAssists] = useState("");
  const [damage, setDamage] = useState("");
  const [rosterNames, setRosterNames] = useState([]);
  const [timeSurvived, setTimeSurvived] = useState("");
  const [winPlace, setWinPlace] = useState("");
  const [name, setName] = useState("");

  const headers = {
    Accept: "application/vnd.api+json",
    Authorization: process.env.REACT_APP_API_KEY,
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        "https://api.pubg.com/shards/steam/players?filter[playerNames]=Synoo",
        { headers }
      );

      const match = await axios(
        "https://api.pubg.com/shards/steam/matches/" +
          result.data.data[0].relationships.matches.data[0].id,
        { headers }
      );

      let rosterId = "";

      await match.data.included.map((z) => {
        if (z.attributes.stats) {
          if (z.attributes.stats.playerId === result.data.data[0].id) {
            setKills(z.attributes.stats.kills);
            setAssists(z.attributes.stats.assists);
            setDamage(z.attributes.stats.damageDealt);
            setTimeSurvived(z.attributes.stats.timeSurvived);
            setWinPlace(z.attributes.stats.winPlace);
            setName(z.attributes.stats.name);
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

      await roster.relationships.participants.data.map((a) => {
        if (rosterId !== a.id) {
          match.data.included.map((z) => {
            if (z.id === a.id) {
              setRosterNames((rosterNames) => [
                ...rosterNames,
                z.attributes.stats.name,
              ]);
            }
          });
        }
      });

      setMatch(match.data);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen p-5">
      {match.data && (
        <>
          <div className="bg-gray-900 text-green-300 p-5 rounded-xl mb-5 flex justify-between">
            <div>
              <p>Date: {match.data.attributes.createdAt}</p>
              <p>Survival Time: {timeSurvived / 60}</p>
              <p>Placement: {winPlace}</p>
              <p>Map: {match.data.attributes.mapName}</p>
            </div>
            <div>
              <p>Kills: {kills}</p>
              <p>Assists: {assists}</p>
              <p>Damage: {damage}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Roster</p>
              <p>{name}</p>
              {rosterNames.map((r) => {
                return <p key={r.name}>{r}</p>;
              })}
            </div>
          </div>

          <div className="bg-gray-900 text-green-300 p-5 rounded-xl mb-5 flex justify-between">
            <div>
              <p>Date: {match.data.attributes.createdAt}</p>
              <p>Survival Time: {timeSurvived / 60}</p>
              <p>Placement: {winPlace}</p>
              <p>Map: {match.data.attributes.mapName}</p>
            </div>
            <div>
              <p>Kills: {kills}</p>
              <p>Assists: {assists}</p>
              <p>Damage: {damage}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Roster</p>
              <p>{name}</p>
              {rosterNames.map((r) => {
                return <p key={r.name}>{r}</p>;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Matches;
