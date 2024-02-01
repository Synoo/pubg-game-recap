import Link from "next/link";

function Home() {
  return (
    <div className="bg-gray-800 min-h-screen p-5">
      <p className="text-green-300">
        Enter your PUBG username in the search bar
      </p>
      <p className="text-green-300 absolute bottom-0 left-0 h-32 w-64 p-5">
        Contact Information:
        <ul>
          <li>Discord: Synoo#8796test</li>
          <li>
            <Link href="https://github.com/Synoo/pubg-game-recap">
              <a className="hover:text-green-200 underline">Github: Synoo</a>
            </Link>
          </li>
        </ul>
      </p>
    </div>
  );
}

export default Home;
