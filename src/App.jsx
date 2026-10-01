import { BrowserRouter, Routes, Route } from "react-router-dom";

function Dashboard() {
  return <h1>Dashboard</h1>;
}

function Accounts() {
  return <h1>Accounts</h1>;
}

function Footprint() {
  return <h1>Digital Footprint</h1>;
}

function Actions() {
  return <h1>Security Actions</h1>;
}

function BreachSimulator() {
  return <h1>Breach Simulator</h1>;
}

function Activity() {
  return <h1>Activity</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/accounts" element={<Accounts />} />

        <Route path="/footprint" element={<Footprint />} />

        <Route path="/actions" element={<Actions />} />

        <Route
          path="/breach"
          element={<BreachSimulator />}
        />

        <Route path="/activity" element={<Activity />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;