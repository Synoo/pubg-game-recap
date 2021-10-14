import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Matches = () => {
  const [playerData, setPlayerData] = useState({ matches: [] });
  const { playerName } = useParams();

  const MAP_SWITCH = {
    Baltic_Main: "Erangel",
    Chimera_Main: "Paramo",
    Desert_Main: "Miramar",
    DihorOtok_Main: "Vikendi",
    Erangel_Main: "Erangel",
    Heaven_Main: "Haven",
    Range_Main: "Camp Jackal",
    Savage_Main: "Sanhok",
    Summerland_Main: "Karakin",
    Tiger_Main: "Taego",
  };

  useEffect(async () => {
    if (playerName) {
      await axios(`/api/matches/${playerName}`).then((data) => {
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
                <p>
                  Date:{" "}
                  {moment(match.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                </p>
                <p>
                  Survival Time:{" "}
                  {moment.utc(match.timeSurvived * 1000).format("mm:ss")}
                </p>
                <p className="capitalize">Match Type: {match.matchType}</p>
                <p>Map: {MAP_SWITCH[match.mapName]}</p>
              </div>
              <div>
                <p>Placement: {match.winPlace}</p>
                <p>Kills: {match.kills}</p>
                <p>Assists: {match.assists}</p>
                <p>Damage: {match.damage.toFixed(2)}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-bold">Roster</p>
                <p>{playerName}</p>
                {match.rosterNames && (
                  <>
                    {match.rosterNames.map((r) => {
                      return <p key={r}>{r}</p>;
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
