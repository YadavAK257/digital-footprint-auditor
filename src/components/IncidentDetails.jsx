import { useState } from "react";

function IncidentDetails({
  account,
  affectedAccounts,
  onSecure,
  onDismiss,
}) {
  const [status, setStatus] = useState("open");

  const secureAccount = () => {
    setStatus("secured");

    if (onSecure) {
      onSecure(account);
    }
  };

  const dismissIncident = () => {
    setStatus("dismissed");

    if (onDismiss) {
      onDismiss(account);
    }
  };

  return (
    <div className="mt-6 bg-white border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">
              Incident Details
            </h2>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === "open"
                  ? "bg-red-100 text-red-700"
                  : status === "secured"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {status}
            </span>
          </div>

          <p className="text-gray-500 text-sm mt-1">
            Simulated security incident
          </p>
        </div>
      </div>

      {/* Incident information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Affected Account
          </p>

          <p className="font-semibold mt-2">
            {account}
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Incident Type
          </p>

          <p className="font-semibold mt-2">
            Account Breach
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Status
          </p>

          <p className="font-semibold mt-2 capitalize">
            {status}
          </p>
        </div>
      </div>

      {/* Connected accounts */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg">
          Potentially Affected Accounts
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          These accounts may be exposed through existing connections.
        </p>

        <div className="mt-4 space-y-2">
          {affectedAccounts.map((affectedAccount) => (
            <div
              key={affectedAccount}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div>
                <p className="font-medium">
                  {affectedAccount}
                </p>

                {affectedAccount === account ? (
                  <p className="text-xs text-red-600">
                    Source account
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Connected account
                  </p>
                )}
              </div>

              <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">
                {affectedAccount === account
                  ? "Compromised"
                  : "Potential Impact"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended actions */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg">
          Recommended Actions
        </h3>

        <div className="mt-3 space-y-2">
          <div className="border rounded-lg p-3">
            Enable two-factor authentication on{" "}
            <strong>{account}</strong>.
          </div>

          <div className="border rounded-lg p-3">
            Review connected accounts and recovery methods.
          </div>

          <div className="border rounded-lg p-3">
            Change reused passwords associated with this account.
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={secureAccount}
          disabled={status !== "open"}
          className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:bg-gray-300"
        >
          Secure Account
        </button>

        <button
          onClick={dismissIncident}
          disabled={status !== "open"}
          className="px-4 py-2 rounded-lg border disabled:bg-gray-100"
        >
          Dismiss Incident
        </button>
      </div>
    </div>
  );
}

export default IncidentDetails;