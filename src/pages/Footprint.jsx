import FootprintGraph from "../components/FootprintGraph";

function Footprint() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Digital Footprint
        </h1>

        <p className="text-gray-500 mt-2">
          Explore how your online accounts and recovery connections are linked.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border">
          <p className="text-gray-500 text-sm">
            Connected Accounts
          </p>

          <h2 className="text-3xl font-bold mt-2">
            6
          </h2>
        </div>

        <div className="bg-white rounded-xl p-5 border">
          <p className="text-gray-500 text-sm">
            High Risk Accounts
          </p>

          <h2 className="text-3xl font-bold mt-2">
            2
          </h2>
        </div>

        <div className="bg-white rounded-xl p-5 border">
          <p className="text-gray-500 text-sm">
            Connections
          </p>

          <h2 className="text-3xl font-bold mt-2">
            5
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="text-xl font-semibold mb-4">
          Account Connection Map
        </h2>

        <FootprintGraph />
      </div>
    </div>
  );
}

export default Footprint;