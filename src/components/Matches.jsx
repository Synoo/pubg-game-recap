import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "../firebase";

const Matches = () => {
  const [playerData, setPlayerData] = useState();
  const { playerName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (playerName) {
        const db = firebase.firestore();
        const docRef = db.collection("players").doc(playerName);
        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              setPlayerData(doc.data());
            } else {
              console.log(`No document with name: ${playerName}`);
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      }
    };
    if (playerName) {
      fetchData();
    }
  }, [playerName]);

  return (
    <div className="bg-gray-800 min-h-screen p-5">
      {playerName && playerData ? (
        <>
          <div className="bg-gray-900 text-green-300 p-5 rounded-xl mb-5 flex justify-between">
            <div>
              <p>Date: {playerData.matches[0].createdAt}</p>
              <p>Survival Time: {playerData.matches[0].timeSurvived}</p>
              <p>Match Type: {playerData.matches[0].matchType}</p>
              <p>Map: {playerData.matches[0].mapName}</p>
            </div>
            <div>
              <p>Placement: {playerData.matches[0].winPlace}</p>
              <p>Kills: {playerData.matches[0].kills}</p>
              <p>Assists: {playerData.matches[0].assists}</p>
              <p>Damage: {playerData.matches[0].damage}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Roster</p>
              <p>{playerName}</p>
              {playerData.matches[0].rosterNames.map((r) => {
                return <p key={r.name}>{r}</p>;
              })}
            </div>
          </div>
        </>
      ) : (
        <p className="text-green-300">Enter PUBG username in the search bar</p>
      )}
    </div>
  );
};

export default Matches;
