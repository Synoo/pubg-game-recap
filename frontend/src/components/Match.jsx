import React from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import axios from "axios";

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

const Match = ({ match, playerName, onToast }) => {
  const { register, handleSubmit } = useForm({ defaultValues: match });
  const onSubmit = async (data) => {
    await axios.put(`/api/matches/${playerName}/${match.id}`, data).then(() => {
      onToast();
    });
  };
  return (
    <div
      className="bg-gray-900 text-green-300 p-5 rounded-xl mb-5 flex justify-between"
      key={match.id}
    >
      <div>
        <p>Date: {moment(match.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</p>
        <p>
          Survival Time: {moment.utc(match.timeSurvived * 1000).format("mm:ss")}
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
      <form key={match.id} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          Bad Driving: <input type="checkbox" {...register(`bad_driving`)} />
          Bad Rotation: <input type="checkbox" {...register(`bad_rotation`)} />
          Bad Aim: <input type="checkbox" {...register(`bad_aim`)} />
          Bad Movement: <input type="checkbox" {...register(`bad_movement`)} />
          Bad Position: <input type="checkbox" {...register(`bad_position`)} />
          Too Aggressive: <input type="checkbox" {...register(`aggressive`)} />
          Too Passive: <input type="checkbox" {...register(`passive`)} />
          Flushing: <input type="checkbox" {...register(`flushing`)} />
          Hardpeek: <input type="checkbox" {...register(`hardpeek`)} />
          Communication:{" "}
          <input type="checkbox" {...register(`communication`)} />
          <textarea placeholder={"Add Comment"} {...register(`comment`)} />
        </div>
        <input key={match.id} type="submit" />
      </form>
    </div>
  );
};

export default Match;
