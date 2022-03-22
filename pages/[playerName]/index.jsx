import axios from "axios";
import Match from "../../components/Match";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Matches({ playerName, playerData }) {
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
}

export async function getServerSideProps(context) {
  const { playerName } = context.params;
  const playerData = await axios(
    process.env.NEXT_PUBLIC_API_URL + `/api/players/${playerName}/matches`
  ).then((data) => data.data);

  return {
    props: { playerName, playerData },
  };
}
