import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const styles = {
  idle: "bg-slate-100 border-slate-300 text-slate-800",
  source: "bg-red-600 border-red-600 text-white",
  affected: "bg-red-50 border-red-500 text-red-700",
  fixed: "bg-emerald-50 border-emerald-600 text-emerald-700",
};

function AccountNode({ data }) {
  const status = data?.status || "idle";

  return (
    <div
      className={`
        rounded-md
        border-2
        px-4
        py-2
        text-sm
        font-medium
        transition-colors
        duration-500
        ${styles[status] || styles.idle}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!opacity-0"
      />

      {data?.label || "Account"}

      <Handle
        type="source"
        position={Position.Right}
        className="!opacity-0"
      />
    </div>
  );
}

export default memo(AccountNode);