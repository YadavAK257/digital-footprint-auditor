function ActionCard({ action, onComplete }) {
  return (
    <div
      className={`bg-white border rounded-xl p-5 ${
        action.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">
              {action.title}
            </h3>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                action.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {action.priority}
            </span>
          </div>

          <p className="text-gray-500 mt-2">
            {action.description}
          </p>
        </div>

        <button
          onClick={() => onComplete(action.id)}
          disabled={action.completed}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:bg-gray-300"
        >
          {action.completed ? "Completed" : "Complete"}
        </button>
      </div>
    </div>
  );
}

export default ActionCard;