import { useMemo, useState } from "react";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import { useAccounts } from "../context/AccountsContext";
import "@xyflow/react/dist/style.css";

function FootprintGraph() {
  const { accounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const liveAccounts = useMemo(
    () => accounts.filter((account) => !account.deleted),
    [accounts]
  );

  const edges = useMemo(() => {
    const seen = new Set();
    const graphEdges = [];

    liveAccounts.forEach((account) => {
      if (account.recoveryEmailId) {
        const targetId = account.recoveryEmailId;
        const edgeId = [account.id, targetId, "recovery"].sort().join("-");

        if (!seen.has(edgeId)) {
          seen.add(edgeId);
          graphEdges.push({
            id: edgeId,
            source: account.id,
            target: targetId,
            label: "recovery email",
            type: "smoothstep",
          });
        }
      }

      if (account.ssoProviderId) {
        const targetId = account.ssoProviderId;
        const edgeId = [account.id, targetId, "sso"].sort().join("-");

        if (!seen.has(edgeId)) {
          seen.add(edgeId);
          graphEdges.push({
            id: edgeId,
            source: account.id,
            target: targetId,
            label: "SSO",
            type: "smoothstep",
          });
        }
      }
    });

    return graphEdges;
  }, [liveAccounts]);

  const nodes = useMemo(() => {
    const centerX = 260;
    const centerY = 240;
    const radius = 190;

    return liveAccounts.map((account, index) => {
      const angle = (index / Math.max(liveAccounts.length, 1)) * (Math.PI * 2);

      return {
        id: account.id,
        position: {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        },
        data: {
          label: account.name,
        },
        style: {
          background: account.breach ? "#fef2f2" : account.twoFactor !== "none" ? "#ecfeff" : "#f8fafc",
          border: account.breach ? "1px solid #fca5a5" : "1px solid #cbd5e1",
          borderRadius: "14px",
          color: "#0f172a",
          padding: "10px 16px",
          fontWeight: 600,
          width: 150,
        },
      };
    });
  }, [liveAccounts]);

  const selectedAccount = liveAccounts.find((account) => account.id === selectedAccountId) || null;

  const getAccountConnections = (accountId) => {
    return edges.filter(
      (edge) => edge.source === accountId || edge.target === accountId
    );
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "600px",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          background: "linear-gradient(180deg, #f8fafc 0%, #eef6ff 100%)",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges.map((edge) => ({
            ...edge,
            animated: true,
            style: { stroke: edge.label === "SSO" ? "#0ea5e9" : "#a78bfa" },
            labelStyle: { fill: "#334155", fontSize: 10 },
          }))}
          fitView
          onNodeClick={(_, node) => setSelectedAccountId(node.id)}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {selectedAccount && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Selected account</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{selectedAccount.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{selectedAccount.category}</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedAccountId(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Risk level</p>
              <p className={`mt-2 font-semibold ${selectedAccount.breach ? "text-red-600" : selectedAccount.value > 0.7 ? "text-amber-600" : "text-emerald-600"}`}>
                {selectedAccount.breach ? "High" : selectedAccount.value > 0.7 ? "Medium" : "Low"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">2FA</p>
              <p className="mt-2 font-semibold text-slate-900">
                {selectedAccount.twoFactor && selectedAccount.twoFactor !== "none" ? "Enabled" : "Disabled"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Sign-in type</p>
              <p className="mt-2 font-semibold text-slate-900">{selectedAccount.signIn}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900">Account connections</h3>

            <div className="mt-3 space-y-2">
              {getAccountConnections(selectedAccount.id).map((connection) => {
                const otherAccountId =
                  connection.source === selectedAccount.id
                    ? connection.target
                    : connection.source;
                const otherAccount = liveAccounts.find((account) => account.id === otherAccountId);

                return (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{otherAccount?.name || otherAccountId}</p>
                      <p className="text-sm text-slate-500">{connection.label}</p>
                    </div>
                    <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                      Connected
                    </span>
                  </div>
                );
              })}

              {getAccountConnections(selectedAccount.id).length === 0 && (
                <p className="text-slate-500">No connections recorded for this account yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FootprintGraph;