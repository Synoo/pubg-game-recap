import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [playerName, setPlayerName] = useState("");
  const history = useHistory();

  const onEnter = async (e) => {
    if (e.key === "Enter") {
      if (playerName) {
        await axios(`/api/players/${playerName}`);
      }

      history.push(`/${playerName}`);
    }
  };

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