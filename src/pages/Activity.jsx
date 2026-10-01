import { activities } from "../data/securityData";

function Activity() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Security Activity
        </h1>

        <p className="text-gray-500 mt-2">
          Recent security events across your digital footprint.
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-4"
            >
              <div className="w-3 h-3 rounded-full bg-black mt-2" />

              <div className="flex-1">
                <div className="flex justify-between gap-4">
                  <h3 className="font-semibold">
                    {activity.title}
                  </h3>

                  <span className="text-sm text-gray-400">
                    {activity.time}
                  </span>
                </div>

                <p className="text-gray-500 mt-1">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Activity;