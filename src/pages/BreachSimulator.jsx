import { useState } from "react";
import BreachResult from "../components/BreachResult";

const accounts = [
  {
    name: "Instagram",
    affected: ["Instagram", "Discord", "Gmail"],
  },
  {
    name: "Google",
    affected: ["Google", "Gmail", "GitHub"],
  },
  {
    name: "Facebook",
    affected: ["Facebook", "Gmail"],
  },
  {
    name: "GitHub",
    affected: ["GitHub", "Google"],
  },
];

function BreachSimulator() {
  const [selectedAccount, setSelectedAccount] =
    useState("Instagram");

  const [result, setResult] = useState(null);

  const simulateBreach = () => {
    const account = accounts.find(
      (item) => item.name === selectedAccount
    );

    setResult(account);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Breach Simulator
        </h1>

        <p className="text-gray-500 mt-2">
          Simulate how a compromised account could affect connected services.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <label className="block font-medium mb-2">
          Select an account
        </label>

        <select
          value={selectedAccount}
          onChange={(e) =>
            setSelectedAccount(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3"
        >
          {accounts.map((account) => (
            <option
              key={account.name}
              value={account.name}
            >
              {account.name}
            </option>
          ))}
        </select>

        <button
          onClick={simulateBreach}
          className="mt-5 px-5 py-3 bg-red-600 text-white rounded-lg"
        >
          Simulate Breach
        </button>
      </div>

      {result && (
        <BreachResult
          account={result.name}
          affectedAccounts={result.affected}
          onClose={() => setResult(null)}
        />
      )}
    </div>
  );
}

export default BreachSimulator;