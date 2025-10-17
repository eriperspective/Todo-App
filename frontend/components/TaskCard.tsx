export default function TaskCard({ task }: any) {
    return (
      <div className="bg-white border border-pink-200 p-4 rounded shadow-sm">
        <p className="font-bold text-lg text-pink-600">{task.title}</p>
        <p className="text-sm text-gray-600">
          Priority: {task.priority} — Due: {task.deadline}
        </p>
        <p className="text-sm">Assigned to: {task.assignee || "Unassigned"}</p>
      </div>
    );
  }
  