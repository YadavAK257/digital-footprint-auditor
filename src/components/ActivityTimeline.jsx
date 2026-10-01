import { useSecurity } from "../context/SecurityContext";

const dot = {
  red: "bg-red-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  info: "bg-slate-400",
};

const badge = {
  red: "bg-red-100 text-red-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-yellow-100 text-yellow-700",
  info: "bg-gray-100 text-gray-600",
};

function ActivityTimeline() {
  const { events } = useSecurity();

  const groupedEvents = events.reduce(
    (groups, event) => {
      const day = event.day || "Today";

      if (!groups[day]) {
        groups[day] = [];
      }

      groups[day].push(event);

      return groups;
    },
    {}
  );

  return (
    <div className="bg-white border rounded-xl p-6">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="font-semibold text-xl">
            Security Activity
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Recent changes and security events across your
            digital footprint.
          </p>
        </div>

        <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600">
          {events.length} events
        </span>

      </div>

      <div className="mt-6">

        {Object.entries(groupedEvents).map(
          ([day, items]) => (
            <section key={day}>

              <h3 className="mb-3 mt-5 border-b pb-2 text-sm font-semibold text-gray-600">
                {day}
              </h3>

              <ul className="space-y-4">

                {items.map((event) => (
                  <li
                    key={event.id}
                    className="flex gap-3"
                  >

                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-2 h-3 w-3 flex-none rounded-full ${
                          dot[event.level] || dot.info
                        }`}
                      />

                      <span className="w-px flex-1 bg-gray-200 mt-1" />
                    </div>

                    <div className="flex-1 pb-3">

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <p className="font-medium">
                            {event.text}
                          </p>

                          {event.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {event.description}
                            </p>
                          )}

                          <p className="text-sm text-gray-400 mt-1">
                            {event.time}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-2 py-1 rounded-full capitalize ${
                            badge[event.level] ||
                            badge.info
                          }`}
                        >
                          {event.level || "info"}
                        </span>

                      </div>

                    </div>

                  </li>
                ))}

              </ul>

            </section>
          )
        )}

      </div>
    </div>
  );
}

export default ActivityTimeline;