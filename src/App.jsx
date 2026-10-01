import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Footprint from "./pages/Footprint";
import Actions from "./pages/Actions";
import BreachSimulator from "./pages/BreachSimulator";
import Activity from "./pages/Activity";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<Layout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/footprint"
            element={<Footprint />}
          />

          <Route
            path="/actions"
            element={<Actions />}
          />

          <Route
            path="/breach-simulator"
            element={<BreachSimulator />}
          />

          <Route
            path="/activity"
            element={<Activity />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;