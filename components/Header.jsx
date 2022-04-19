import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [session] = useSession();
  const router = useRouter();
  const [playerName, setPlayerName] = useState(router.query.playerName);

  const onEnter = async (e) => {
    if (e.key === "Enter") {
      if (playerName) {
        await axios(
          process.env.NEXT_PUBLIC_API_URL + `/api/players/${playerName}`,
          {
            headers: { Cookie: session },
          }
        );
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
    <div className="bg-gray-900 flex items-center justify-between text-green-300">
      <Link href={`/${playerName}`}>
        <a className="text-3xl py-5 pl-20 pr-20">PUBG Game Recap</a>
      </Link>
      {!session ? (
        <button className="pr-10" onClick={() => signIn()}>
          <FontAwesomeIcon className="text-3xl" icon={faSignInAlt} />
        </button>
      ) : (
        <>
          <div>
            <Link href={`/${playerName}`}>
              <a className="p-7">Matches</a>
            </Link>
            <Link href={`/${playerName}/graph`}>
              <a className="p-7">Graph</a>
            </Link>
            <input
              className="bg-gray-800 h-10 m-5 rounded-xl placeholder-green-300 placeholder-opacity-50 border-none focus:outline-none p-5"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => onEnter(e)}
              placeholder="Enter PUBG name"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span>Discord: {session.user.email}</span>
            <button className="pr-10" onClick={() => signOut()}>
              <FontAwesomeIcon className="text-3xl" icon={faSignOutAlt} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
