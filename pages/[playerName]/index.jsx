import axios from "axios";
import Match from "../../components/Match";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession, useSession } from "next-auth/client";

export default function Matches({ playerName, playerData }) {
  const [session, loading] = useSession();

  const handleToast = () => {
    toast.success("Match is Updated!", { theme: "dark" });
  };

  if (loading) {
    return (
      <div className="bg-gray-800 min-h-screen p-5 text-green-300">Loading</div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-800 min-h-screen p-5 text-green-300">
        Access Denied
      </div>
    );
  }

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
  const session = await getSession(context);
  const headers = context.req.headers;

  if (!session) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${process.env.NEXT_PUBLIC_API_URL}/${playerName}`,
        permanent: false,
      },
    };
  }

  if (session) {
    const playerData = await axios(
      process.env.NEXT_PUBLIC_API_URL + `/api/players/${playerName}/matches`,
      {
        headers: { Cookie: headers.cookie },
      }
    ).then((data) => data.data);

    return {
      props: { playerName, playerData },
    };
  }
}
