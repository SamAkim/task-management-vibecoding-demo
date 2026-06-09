import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../types/Task';

interface TaskFormProps {
  readonly onSubmit: (title: string, description: string, status: TaskStatus, priority: TaskPriority, dueDate: string) => void;
  readonly onUpdate?: (id: string, updates: { title: string; description: string; status: TaskStatus; priority: TaskPriority; dueDate: string }) => void;
  readonly taskToEdit?: Task | null;
  readonly onCancelEdit?: () => void;
}

interface EditOverrides {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  editId?: string;
}

// Pure helper function declared outside the component to reduce cognitive complexity
function getFieldValue<T>(
  field: keyof EditOverrides,
  localVal: T,
  taskVal: T | undefined,
  isEditing: boolean,
  editOverrides: EditOverrides,
  taskToEditId: string | undefined
): T {
  if (isEditing && editOverrides.editId === taskToEditId && editOverrides[field] !== undefined) {
    return editOverrides[field] as unknown as T;
  }
  return (isEditing ? taskVal : localVal) as T;
}

export function TaskForm({ onSubmit, onUpdate, taskToEdit, onCancelEdit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  const isEditing = !!taskToEdit;
  const [editOverrides, setEditOverrides] = useState<EditOverrides>({});

  const displayTitle = getFieldValue('title', title, taskToEdit?.title, isEditing, editOverrides, taskToEdit?.id) ?? '';
  const displayDescription = getFieldValue('description', description, taskToEdit?.description, isEditing, editOverrides, taskToEdit?.id) ?? '';
  const displayStatus = getFieldValue('status', status, taskToEdit?.status, isEditing, editOverrides, taskToEdit?.id) ?? 'todo';
  const displayPriority = getFieldValue('priority', priority, taskToEdit?.priority, isEditing, editOverrides, taskToEdit?.id) ?? 'medium';
  const displayDueDate = getFieldValue('dueDate', dueDate, taskToEdit?.dueDate, isEditing, editOverrides, taskToEdit?.id) ?? '';

  const validate = (): boolean => {
    const newErrors: { title?: string; dueDate?: string } = {};
    if (!displayTitle.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!displayDueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    if (taskToEdit && onUpdate) {
      onUpdate(taskToEdit.id, {
        title: displayTitle.trim(),
        description: displayDescription.trim(),
        status: displayStatus,
        priority: displayPriority,
        dueDate: displayDueDate,
      });
      setEditOverrides({});
    } else {
      onSubmit(
        displayTitle.trim(),
        displayDescription.trim(),
        displayStatus,
        displayPriority,
        displayDueDate
      );
    }

    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setDueDate('');
    setErrors({});
  };

  // Reusable helper to update a form field under editing or normal modes
  const updateField = <K extends keyof EditOverrides, V>(
    field: K,
    value: EditOverrides[K] & V,
    setter: (val: V) => void
  ) => {
    if (isEditing && taskToEdit) {
      setEditOverrides((prev) => ({ ...prev, [field]: value, editId: taskToEdit.id }));
    } else {
      setter(value);
    }
  };

  const handleTitleChange = (value: string) => {
    updateField('title', value, setTitle);
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleDescriptionChange = (value: string) => updateField('description', value, setDescription);
  const handleStatusChange = (value: TaskStatus) => updateField('status', value, setStatus);
  const handlePriorityChange = (value: TaskPriority) => updateField('priority', value, setPriority);

  const handleDueDateChange = (value: string) => {
    updateField('dueDate', value, setDueDate);
    if (value) {
      setErrors((prev) => ({ ...prev, dueDate: undefined }));
    }
  };

  const handleCancel = () => {
    setEditOverrides({});
    setErrors({});
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__title">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h2>
      <div className="task-form__fields">
        <div className="task-form__field">
          <label htmlFor="task-title" className="task-form__label">Title</label>
          <input
            id="task-title"
            type="text"
            className={`task-form__input ${errors.title ? 'task-form__input--error' : ''}`}
            placeholder="Enter task title..."
            value={displayTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          {errors.title && (
            <span className="task-form__error-message" data-testid="title-error">
              {errors.title}
            </span>
          )}
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
        
        <div className="task-form__field-group">
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
          
          <div className="task-form__field">
            <label htmlFor="task-priority" className="task-form__label">Priority</label>
            <select
              id="task-priority"
              className="task-form__select"
              value={displayPriority}
              onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="task-form__field">
            <label htmlFor="task-due-date" className="task-form__label">Due Date</label>
            <input
              id="task-due-date"
              type="date"
              className={`task-form__input ${errors.dueDate ? 'task-form__input--error' : ''}`}
              value={displayDueDate}
              onChange={(e) => handleDueDateChange(e.target.value)}
            />
            {errors.dueDate && (
              <span className="task-form__error-message" data-testid="due-date-error">
                {errors.dueDate}
              </span>
            )}
          </div>
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
