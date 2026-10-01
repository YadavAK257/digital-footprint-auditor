import { useMemo } from "react";
import { useAccounts } from "../context/AccountsContext";
import FootprintGraph from "../components/FootprintGraph";

function Footprint() {
  const { accounts } = useAccounts();

  const activeAccounts = useMemo(
    () => accounts.filter((account) => !account.deleted),
    [accounts]
  );

  const connectionCount = useMemo(
    () =>
      activeAccounts.reduce((total, account) => {
        const connections = [account.recoveryEmailId, account.ssoProviderId].filter(Boolean);
        return total + connections.length;
      }, 0),
    [activeAccounts]
  );

  const highRiskAccounts = activeAccounts.filter((account) => account.breach).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Digital Footprint</h1>

        <p className="mt-2 text-gray-500">
          Explore how your online accounts and recovery connections are linked.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Connected Accounts</p>
          <h2 className="mt-2 text-3xl font-bold">{activeAccounts.length}</h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">High Risk Accounts</p>
          <h2 className="mt-2 text-3xl font-bold">{highRiskAccounts}</h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Connections</p>
          <h2 className="mt-2 text-3xl font-bold">{connectionCount}</h2>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-4 text-xl font-semibold">Account Connection Map</h2>

        <FootprintGraph />
      </div>
    </div>
  );
}

export default Footprint;