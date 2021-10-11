import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Matches = () => {
  const [playerData, setPlayerData] = useState({ matches: [] });
  const { playerName } = useParams();

  useEffect(async () => {
    if (playerName) {
      await axios(`/api/test/${playerName}`).then((data) => {
        setPlayerData(data.data);
      });
    }
  }, [playerName]);

  return (
    <div className="bg-gray-800 min-h-screen p-5">
      {playerName && playerData ? (
        <>
          {playerData.matches.map((match) => (
            <div
              className="bg-gray-900 text-green-300 p-5 rounded-xl mb-5 flex justify-between"
              key={match.id}
            >
              <div>
                <p>Date: {match.createdAt}</p>
                <p>Survival Time: {match.timeSurvived}</p>
                <p>Match Type: {match.matchType}</p>
                <p>Map: {match.mapName}</p>
              </div>
              <div>
                <p>Placement: {match.winPlace}</p>
                <p>Kills: {match.kills}</p>
                <p>Assists: {match.assists}</p>
                <p>Damage: {match.damage}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">Roster</p>
                <p>{playerName}</p>
                {match.rosterNames && (
                  <>
                    {match.rosterNames.map((r) => {
                      return <p key={r.name}>{r}</p>;
                    })}
                  </>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="text-green-300">Enter PUBG username in the search bar</p>
      )}
    </div>
  );
};

export default Matches;
