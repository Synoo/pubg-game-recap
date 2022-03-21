import React, { useEffect, useState } from "react";
import axios from "axios";
import Match from "./Match";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Matches = () => {
  const [playerData, setPlayerData] = useState({ matches: [] });
  const { playerName } = useParams();

  useEffect(async () => {
    if (playerName) {
      await axios(`/api/players/${playerName}/matches`).then((data) => {
        setPlayerData(data.data);
      });
    }
  }, [playerName]);

  const handleToast = () => {
    toast.success("Match is Updated!", { theme: "dark" });
  };

  return (
    <div className="bg-gray-800 min-h-screen p-5">
      {playerName && playerData ? (
        <>
          {playerData.matches.map((match) => (
            <Match
              key={match.id}
              match={match}
              playerName={playerName}
              onToast={handleToast}
            />
          ))}
          <ToastContainer />
        </>
      ) : (
        <p className="text-green-300">Enter PUBG username in the search bar</p>
      )}
    </div>
  );
};

export default Matches;
