import "../styles/globals.css";
import Header from "../components/Header";
import NextNProgress from "nextjs-progressbar";
import { Provider } from "next-auth/client";

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <NextNProgress />
      <Header />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
