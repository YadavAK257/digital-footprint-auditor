import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r p-5">

      <h1 className="text-xl font-bold mb-8">
        PrivacyHub
      </h1>

      <nav className="space-y-2">

        <Link
          to="/"
          className="block px-4 py-3 rounded-lg hover:bg-gray-100"
        >
          Dashboard
        </Link>

        <Link
          to="/footprint"
          className="block px-4 py-3 rounded-lg hover:bg-gray-100"
        >
          Digital Footprint
        </Link>

        <Link
          to="/actions"
          className="block px-4 py-3 rounded-lg hover:bg-gray-100"
        >
          Security Actions
        </Link>

        <Link
          to="/breach-simulator"
          className="block px-4 py-3 rounded-lg hover:bg-gray-100"
        >
          Breach Simulator
        </Link>

        <Link
          to="/activity"
          className="block px-4 py-3 rounded-lg hover:bg-gray-100"
        >
          Activity
        </Link>

      </nav>

    </aside>
  );
}

export default Sidebar;