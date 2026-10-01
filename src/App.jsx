import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import AccountDetails from "./pages/AccountDetails";
import Footprint from "./pages/Footprint";
import Actions from "./pages/Actions";
import BreachSimulator from "./pages/BreachSimulator";
import Activity from "./pages/Activity";
import Login from "./pages/Login";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
          <Route path="/accounts/:id" element={<ProtectedRoute><AccountDetails /></ProtectedRoute>} />
          <Route path="/footprint" element={<ProtectedRoute><Footprint /></ProtectedRoute>} />
          <Route path="/actions" element={<ProtectedRoute><Actions /></ProtectedRoute>} />
          <Route path="/breach-simulator" element={<ProtectedRoute><BreachSimulator /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;