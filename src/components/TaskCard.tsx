import type { Task } from '../types/Task';

const STATUS_LABELS: Record<string, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

const PRIORITY_LABELS: Record<string, string> = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
};

interface TaskCardProps {
  readonly task: Task;
  readonly onEdit: (task: Task) => void;
  readonly onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = task.status !== 'completed' && task.dueDate < today;

  return (
    <article className="task-card" data-testid={`task-card-${task.id}`}>
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <div className="task-card__badges">
          <span className={`task-card__badge task-card__badge--status task-card__badge--${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={`task-card__badge task-card__badge--priority task-card__badge--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
      </div>
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}
      <div className="task-card__meta">
        <time className={`task-card__due-date ${isOverdue ? 'task-card__due-date--overdue' : ''}`} dateTime={task.dueDate}>
          📅 Due: {task.dueDate} {isOverdue && <span className="task-card__overdue-label">(Overdue)</span>}
        </time>
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
