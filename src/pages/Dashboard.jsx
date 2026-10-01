function Dashboard() {
  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome to your Digital Footprint & Privacy Risk Auditor.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500 text-sm">
            Privacy Score
          </p>

          <h2 className="text-3xl font-bold mt-2">
            72
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500 text-sm">
            Connected Accounts
          </p>

          <h2 className="text-3xl font-bold mt-2">
            6
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500 text-sm">
            Actions Pending
          </p>

          <h2 className="text-3xl font-bold mt-2">
            4
          </h2>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;