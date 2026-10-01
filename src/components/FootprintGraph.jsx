import { useState } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";

import {
  securityAccounts,
  connections,
} from "../data/securityData";

import "@xyflow/react/dist/style.css";

const nodes = [
  {
    id: "google",
    position: { x: 350, y: 50 },
    data: { label: "🔐 Google" },
  },
  {
    id: "gmail",
    position: { x: 100, y: 200 },
    data: { label: "✉️ Gmail" },
  },
  {
    id: "github",
    position: { x: 600, y: 200 },
    data: { label: "💻 GitHub" },
  },
  {
    id: "instagram",
    position: { x: 100, y: 400 },
    data: { label: "📷 Instagram" },
  },
  {
    id: "facebook",
    position: { x: 350, y: 400 },
    data: { label: "👥 Facebook" },
  },
  {
    id: "discord",
    position: { x: 600, y: 400 },
    data: { label: "💬 Discord" },
  },
];

const edges = connections.map((connection) => ({
  id: `${connection.source}-${connection.target}`,
  source: connection.source,
  target: connection.target,
  label: connection.label,
}));

function FootprintGraph() {
  const [selectedAccount, setSelectedAccount] =
    useState(null);

  const handleNodeClick = (event, node) => {
    const account = securityAccounts.find(
      (item) => item.id === node.id
    );

    setSelectedAccount(account);
  };

  const getAccountConnections = (accountId) => {
    return connections.filter(
      (connection) =>
        connection.source === accountId ||
        connection.target === accountId
    );
  };

  return (
    <div>

      {/* Graph */}
      <div
        style={{
          width: "100%",
          height: "600px",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          onNodeClick={handleNodeClick}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Account Details */}
      {selectedAccount && (
        <div className="mt-4 bg-white border rounded-xl p-6">

          {/* Header */}
          <div className="flex justify-between items-start">

            <div>
              <p className="text-sm text-gray-500">
                Selected Account
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {selectedAccount.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {selectedAccount.type}
              </p>
            </div>

            <button
              onClick={() => setSelectedAccount(null)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Close
            </button>

          </div>

          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

            {/* Risk */}
            <div className="border rounded-lg p-4">

              <p className="text-sm text-gray-500">
                Risk Level
              </p>

              <p
                className={`font-semibold mt-2 ${
                  selectedAccount.risk === "High"
                    ? "text-red-600"
                    : selectedAccount.risk === "Medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {selectedAccount.risk}
              </p>

            </div>

            {/* 2FA */}
            <div className="border rounded-lg p-4">

              <p className="text-sm text-gray-500">
                Two-Factor Authentication
              </p>

              <p className="font-semibold mt-2">
                {selectedAccount.twoFA
                  ? "✓ Enabled"
                  : "✕ Disabled"}
              </p>

            </div>

            {/* Account Type */}
            <div className="border rounded-lg p-4">

              <p className="text-sm text-gray-500">
                Account Type
              </p>

              <p className="font-semibold mt-2">
                {selectedAccount.type}
              </p>

            </div>

          </div>

          {/* Connections */}
          <div className="mt-6">

            <h3 className="font-semibold text-lg">
              Account Connections
            </h3>

            <div className="mt-3 space-y-2">

              {getAccountConnections(
                selectedAccount.id
              ).map((connection) => {

                const otherAccountId =
                  connection.source === selectedAccount.id
                    ? connection.target
                    : connection.source;

                const otherAccount =
                  securityAccounts.find(
                    (account) =>
                      account.id === otherAccountId
                  );

                return (
                  <div
                    key={`${connection.source}-${connection.target}`}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >

                    <div>
                      <p className="font-medium">
                        {otherAccount?.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {connection.label}
                      </p>
                    </div>

                    <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">
                      Connected
                    </span>

                  </div>
                );
              })}

              {getAccountConnections(
                selectedAccount.id
              ).length === 0 && (
                <p className="text-gray-500">
                  No connections found.
                </p>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default FootprintGraph;