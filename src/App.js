import Header from "./components/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Matches from "./components/Matches";
import Graph from "./components/Graph";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exactly component={Graph} path="/graph" />
        <Route exactly component={Matches} path="/" />
      </Switch>
    </Router>
  );
}

export default App;
