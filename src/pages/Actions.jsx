import { useState } from "react";
import ActionCard from "../components/ActionCard";
import { securityActions } from "../data/securityData";

function Actions() {
  const [actions, setActions] = useState(securityActions);

  const completeAction = (id) => {
    setActions((currentActions) =>
      currentActions.map((action) =>
        action.id === id
          ? { ...action, completed: true }
          : action
      )
    );
  };

  const completed = actions.filter(
    (action) => action.completed
  ).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Security Action Center
        </h1>

        <p className="text-gray-500 mt-2">
          Take actions to improve the security of your digital footprint.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-5 mb-6">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-500">
              Security Progress
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {completed}/{actions.length}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-gray-500">
              Remaining
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {actions.length - completed}
            </h2>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-5">
          <div
            className="bg-black h-2 rounded-full"
            style={{
              width: `${(completed / actions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            onComplete={completeAction}
          />
        ))}
      </div>
    </div>
  );
}

export default Actions;