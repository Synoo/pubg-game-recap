import moment from "moment";
import { useForm } from "react-hook-form";
import axios from "axios";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    await axios
      .put(
        `http://localhost:3000/api/players/${playerName}/matches/${match.id}`,
        data
      )
      .then(() => {
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
      <form className="flex" key={match.id} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col mr-10">
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`driving`)}
            />
            Driving
          </div>
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`rotation`)}
            />
            Rotation
          </div>
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`aim`)}
            />
            Aim
          </div>
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`movement`)}
            />
            Movement
          </div>
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`position`)}
            />
            Position
          </div>
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`parachute`)}
            />
            Parachute
          </div>
        </div>
        <div className="flex flex-col mr-10">
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`aggressive`)}
            />
            Aggressive
          </div>
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`passive`)}
            />
            Passive
          </div>
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`flushing`)}
            />
            Flushing
          </div>
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`hardpeek`)}
            />
            Hardpeek
          </div>
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`communication`)}
            />
            Communication
          </div>
          <div className="inline-flex items-center">
            <input
              className="mr-3 h-4 w-4"
              type="checkbox"
              {...register(`utility`)}
            />
            Utility
          </div>
        </div>

        <div className="flex flex-col mr-10">
          <textarea
            className="bg-gray-800 rounded-xl resize-none placeholder-green-300 placeholder-opacity-40 p-2 h-full  outline-none"
            placeholder={"Add Comment"}
            {...register(`comment`)}
          />
        </div>
        <div className="flex flex-col">
          <button className="m-auto" key={match.id} type="submit">
            <FontAwesomeIcon className="text-3xl" icon={faSave} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Match;
