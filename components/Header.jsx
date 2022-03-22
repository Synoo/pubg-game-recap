import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

const Header = () => {
  const [playerName, setPlayerName] = useState("");
  const router = useRouter();

  const onEnter = async (e) => {
    if (e.key === "Enter") {
      if (playerName) {
        await axios(process.env.NEXT_PUBLIC_API_URL + `players/${playerName}`);
      }

      const pathName = router.pathname;
      const substrPathName = pathName.substr(0, pathName.lastIndexOf("/"));

      if (substrPathName) {
        router.push(`/${playerName}/graph`);
      } else {
        router.push(`/${playerName}`);
      }
    }
  };

  return (
    <div className="bg-gray-900 flex">
      <Link href={`/${playerName}`}>
        <a className="text-3xl text-green-300 py-5 pl-20 pr-20">
          PUBG Game Recap
        </a>
      </Link>
      <Link href={`/${playerName}`}>
        <a className="text-green-300 p-7">Matches</a>
      </Link>
      <Link href={`/${playerName}/graph`}>
        <a className="text-green-300 p-7">Graph</a>
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
