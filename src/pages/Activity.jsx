import ActivityTimeline from "../components/ActivityTimeline";
import Notifications from "../components/Notifications";

function Activity() {
  return (
    <div className="p-6">

      {/* Header */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Security Activity
        </h1>

        <p className="text-gray-500 mt-2">
          Review notifications and recent security events
          across your digital footprint.
        </p>

      </div>

      {/* Notifications */}

      <div className="mb-6">
        <Notifications />
      </div>

      {/* Activity Timeline */}

      <ActivityTimeline />

    </div>
  );
}

export default Activity;