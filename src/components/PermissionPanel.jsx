import { PERMISSION_CATALOG } from '../utils/accountMeta';

export default function PermissionPanel({ account, permissions: providedPermissions = [], onChange }) {
  const permissions = Array.isArray(providedPermissions) && providedPermissions.length
    ? providedPermissions
    : (account?.permissions ?? []);
  const selected = new Map(permissions.map((permission) => [permission.name, permission]));

  const togglePermission = (name, sensitivity) => {
    if (!onChange) return;

    const next = [...permissions];
    const index = next.findIndex((item) => item.name === name);

    if (index >= 0) {
      next.splice(index, 1);
    } else {
      next.push({ name, sensitivity });
    }

    onChange(next);
  };

  return (
    <div className="space-y-3">
      {PERMISSION_CATALOG.map((permission) => {
        const checked = selected.has(permission.name);
        return (
          <label key={permission.name} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <div className="font-medium text-slate-800">{permission.name}</div>
              <div className="text-xs text-slate-500">Sensitivity {permission.sensitivity}</div>
            </div>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => togglePermission(permission.name, permission.sensitivity)}
            />
          </label>
        );
      })}
    </div>
  );
}
