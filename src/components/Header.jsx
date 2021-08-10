import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [playerName, setPlayerName] = useState("");
  return (
    <div className="bg-gray-900 flex">
      <p className="text-3xl text-green-300 py-5 pl-20 pr-20 align-top">
        PUBG Game Recap
      </p>
      <Link to="/" className="text-green-300 align-top p-7">
        Matches
      </Link>
      <Link to="/graph" className="text-green-300 align-top p-7">
        Graph
      </Link>
      <input
        className="bg-gray-800 h-10 m-5 rounded-xl text-green-300 border-none focus:outline-none p-5"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
    </div>
  );
};

export default Header;
