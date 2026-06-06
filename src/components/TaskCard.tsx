import type { Task } from '../types/Task';

const STATUS_LABELS: Record<string, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <article className="task-card" data-testid={`task-card-${task.id}`}>
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <span className={`task-card__badge task-card__badge--${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}
      <div className="task-card__meta">
        <time className="task-card__time" dateTime={task.createdAt}>
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </time>
      </div>
      <div className="task-card__actions">
        <button
          className="task-card__button task-card__button--edit"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
        >
          ✏️ Edit
        </button>
        <button
          className="task-card__button task-card__button--delete"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
        >
          🗑️ Delete
        </button>
      </div>
    </article>
  );
}
