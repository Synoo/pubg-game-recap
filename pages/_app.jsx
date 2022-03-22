import "../styles/globals.css";
import Header from "../components/Header";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextNProgress />
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
