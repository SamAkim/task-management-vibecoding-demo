import type { Task } from '../types/Task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty" data-testid="empty-state">
        <div className="task-list__empty-icon">📋</div>
        <h3 className="task-list__empty-title">No tasks found</h3>
        <p className="task-list__empty-text">
          Create a new task or adjust your filters to see results.
        </p>
      </div>
    );
  }

  return (
    <div className="task-list" data-testid="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
