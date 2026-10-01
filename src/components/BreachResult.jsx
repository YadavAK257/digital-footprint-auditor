function BreachResult({ account, affectedAccounts, onClose }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-bold text-red-700">
            Security Incident Detected
          </h2>

          <p className="text-red-600 mt-1">
            {account} was selected as the compromised account.
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-gray-500"
        >
          ✕
        </button>
      </div>

      <div className="mt-5">
        <h3 className="font-semibold">
          Potentially affected accounts
        </h3>

        <div className="flex flex-wrap gap-2 mt-3">
          {affectedAccounts.map((name) => (
            <span
              key={name}
              className="px-3 py-2 bg-white border border-red-200 rounded-lg"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="font-semibold">
          Recommended actions
        </h3>

        <ul className="list-disc ml-5 mt-2 text-gray-600">
          <li>Secure the affected account</li>
          <li>Review connected accounts</li>
          <li>Review recovery methods</li>
          <li>Enable two-factor authentication</li>
          <li>Review reused credentials</li>
        </ul>
      </div>
    </div>
  );
}

export default BreachResult;