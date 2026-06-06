import { useState } from 'react';
import type { Task, TaskStatus } from '../types/Task';

interface TaskFormProps {
  onSubmit: (title: string, description: string, status: TaskStatus) => void;
  onUpdate?: (id: string, updates: { title: string; description: string; status: TaskStatus }) => void;
  taskToEdit?: Task | null;
  onCancelEdit?: () => void;
}

export function TaskForm({ onSubmit, onUpdate, taskToEdit, onCancelEdit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');

  // Derive form values from taskToEdit when in edit mode
  const isEditing = !!taskToEdit;
  const currentTitle = isEditing ? taskToEdit.title : title;
  const currentDescription = isEditing ? taskToEdit.description : description;
  const currentStatus = isEditing ? taskToEdit.status : status;

  // For edit mode, we track local overrides via a separate key
  const [editOverrides, setEditOverrides] = useState<{
    title?: string;
    description?: string;
    status?: TaskStatus;
    editId?: string;
  }>({});

  const editTitle = taskToEdit && editOverrides.editId === taskToEdit.id && editOverrides.title !== undefined
    ? editOverrides.title : currentTitle;
  const editDescription = taskToEdit && editOverrides.editId === taskToEdit.id && editOverrides.description !== undefined
    ? editOverrides.description : currentDescription;
  const editStatus = taskToEdit && editOverrides.editId === taskToEdit.id && editOverrides.status !== undefined
    ? editOverrides.status : currentStatus;

  const displayTitle = isEditing ? editTitle : title;
  const displayDescription = isEditing ? editDescription : description;
  const displayStatus = isEditing ? editStatus : status;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayTitle.trim()) return;

    if (taskToEdit && onUpdate) {
      onUpdate(taskToEdit.id, {
        title: displayTitle.trim(),
        description: displayDescription.trim(),
        status: displayStatus,
      });
      setEditOverrides({});
    } else {
      onSubmit(displayTitle.trim(), displayDescription.trim(), displayStatus);
    }

    setTitle('');
    setDescription('');
    setStatus('todo');
  };

  const handleTitleChange = (value: string) => {
    if (isEditing && taskToEdit) {
      setEditOverrides((prev) => ({ ...prev, title: value, editId: taskToEdit.id }));
    } else {
      setTitle(value);
    }
  };

  const handleDescriptionChange = (value: string) => {
    if (isEditing && taskToEdit) {
      setEditOverrides((prev) => ({ ...prev, description: value, editId: taskToEdit.id }));
    } else {
      setDescription(value);
    }
  };

  const handleStatusChange = (value: TaskStatus) => {
    if (isEditing && taskToEdit) {
      setEditOverrides((prev) => ({ ...prev, status: value, editId: taskToEdit.id }));
    } else {
      setStatus(value);
    }
  };

  const handleCancel = () => {
    setEditOverrides({});
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form__title">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h2>
      <div className="task-form__fields">
        <div className="task-form__field">
          <label htmlFor="task-title" className="task-form__label">Title</label>
          <input
            id="task-title"
            type="text"
            className="task-form__input"
            placeholder="Enter task title..."
            value={displayTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>
        <div className="task-form__field">
          <label htmlFor="task-description" className="task-form__label">Description</label>
          <textarea
            id="task-description"
            className="task-form__textarea"
            placeholder="Enter task description..."
            value={displayDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            rows={3}
          />
        </div>
        <div className="task-form__field">
          <label htmlFor="task-status" className="task-form__label">Status</label>
          <select
            id="task-status"
            className="task-form__select"
            value={displayStatus}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="task-form__actions">
        <button type="submit" className="task-form__button task-form__button--submit">
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="task-form__button task-form__button--cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
