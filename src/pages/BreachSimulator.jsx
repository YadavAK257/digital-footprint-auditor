import { useState } from "react";
import BreachResult from "../components/BreachResult";
import IncidentDetails from "../components/IncidentDetails";
import { useAccounts } from "../context/AccountsContext";
import { useSecurity } from "../context/SecurityContext";

function getAffectedAccounts(sourceAccount, accounts) {
  if (!sourceAccount) {
    return [];
  }

  const affected = new Set();

  affected.add(sourceAccount.name);

  if (sourceAccount.recoveryEmailId) {
    const recoveryAccount = accounts.find(
      (account) => account.id === sourceAccount.recoveryEmailId
    );

    if (recoveryAccount) {
      affected.add(recoveryAccount.name);
    }
  }

  if (sourceAccount.ssoProviderId) {
    const ssoAccount = accounts.find(
      (account) => account.id === sourceAccount.ssoProviderId
    );

    if (ssoAccount) {
      affected.add(ssoAccount.name);
    }
  }

  accounts.forEach((account) => {
    if (
      account.recoveryEmailId === sourceAccount.id ||
      account.ssoProviderId === sourceAccount.id
    ) {
      affected.add(account.name);
    }
  });

  return [...affected];
}

function BreachSimulator() {
  const { accounts, updateAccount } = useAccounts();
  const {
    createIncident,
    secureIncident,
    dismissIncident: dismissSecurityIncident,
  } = useSecurity();

  const [selectedAccount, setSelectedAccount] = useState("");
  const [result, setResult] = useState(null);
  const [incident, setIncident] = useState(null);

  const simulateBreach = () => {
    const sourceAccount = accounts.find(
      (account) => account.id === selectedAccount
    );

    if (!sourceAccount) {
      return;
    }

    const affectedAccounts = getAffectedAccounts(sourceAccount, accounts);
    const affectedNames = affectedAccounts;

    updateAccount(sourceAccount.id, {
      breach: {
        year: new Date().getFullYear(),
        severity: 0.9,
      },
      lastActiveAt: new Date().toISOString(),
    });

    const newIncident = createIncident({
      sourceName: sourceAccount.name,
      affectedAccounts: affectedNames,
    });

    setResult({
      name: sourceAccount.name,
      affected: affectedNames,
    });

    setIncident({
      ...newIncident,
      sourceId: sourceAccount.id,
      status: "open",
    });
  };

  const secureAccount = () => {
    if (!incident) {
      return;
    }

    secureIncident(incident.id);

    setIncident({
      ...incident,
      status: "secured",
    });
  };

  const dismissIncident = () => {
    if (!incident) {
      return;
    }

    dismissSecurityIncident(incident.id);

    setIncident({
      ...incident,
      status: "dismissed",
    });
  };

  const closeResult = () => {
    setResult(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Breach Simulator</h1>

        <p className="text-gray-500 mt-2">
          Simulate how a compromised account could affect connected services.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <label className="block font-medium mb-2">Select an account</label>

        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">Select an account</option>

          {accounts
            .filter((account) => !account.deleted)
            .map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
        </select>

        <button
          onClick={simulateBreach}
          disabled={!selectedAccount}
          className="mt-5 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Simulate Breach
        </button>
      </div>

      {result && (
        <BreachResult
          account={result.name}
          affectedAccounts={result.affected}
          onClose={closeResult}
        />
      )}

      {incident && (
        <IncidentDetails
          account={incident.sourceName}
          affectedAccounts={incident.affected}
          onSecure={secureAccount}
          onDismiss={dismissIncident}
        />
      )}

      {incident && (
        <div className="mt-4 bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Incident ID</p>

              <p className="font-semibold">{incident.id}</p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                incident.status === "open"
                  ? "bg-red-100 text-red-700"
                  : incident.status === "secured"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {incident.status}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Affected Account</p>

              <p className="font-semibold mt-1">{incident.sourceName}</p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Detected</p>

              <p className="font-semibold mt-1">{incident.detectedAt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BreachSimulator;