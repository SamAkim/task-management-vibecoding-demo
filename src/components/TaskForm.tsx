import { useState } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../types/Task';

interface TaskFormProps {
  onSubmit: (title: string, description: string, status: TaskStatus, priority: TaskPriority, dueDate: string) => void;
  onUpdate?: (id: string, updates: { title: string; description: string; status: TaskStatus; priority: TaskPriority; dueDate: string }) => void;
  taskToEdit?: Task | null;
  onCancelEdit?: () => void;
}

export function TaskForm({ onSubmit, onUpdate, taskToEdit, onCancelEdit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  // Derive form values from taskToEdit when in edit mode
  const isEditing = !!taskToEdit;
  const currentTitle = isEditing ? taskToEdit.title : title;
  const currentDescription = isEditing ? taskToEdit.description : description;
  const currentStatus = isEditing ? taskToEdit.status : status;
  const currentPriority = isEditing ? taskToEdit.priority : priority;
  const currentDueDate = isEditing ? taskToEdit.dueDate : dueDate;

  // For edit mode, we track local overrides via a separate key
  const [editOverrides, setEditOverrides] = useState<{
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    editId?: string;
  }>({});

  const editTitle = taskToEdit && editOverrides.editId === taskToEdit.id && editOverrides.title !== undefined
    ? editOverrides.title : currentTitle;
  const editDescription = taskToEdit && editOverrides.editId === taskToEdit.id && editOverrides.description !== undefined
    ? editOverrides.description : currentDescription;
  const editStatus = taskToEdit && editOverrides.editId === taskToEdit.id && editOverrides.status !== undefined
    ? editOverrides.status : currentStatus;
  const editPriority = taskToEdit && editOverrides.editId === taskToEdit.id && editOverrides.priority !== undefined
    ? editOverrides.priority : currentPriority;
  const editDueDate = taskToEdit && editOverrides.editId === taskToEdit.id && editOverrides.dueDate !== undefined
    ? editOverrides.dueDate : currentDueDate;

  const displayTitle = isEditing ? editTitle : title;
  const displayDescription = isEditing ? editDescription : description;
  const displayStatus = isEditing ? editStatus : status;
  const displayPriority = isEditing ? editPriority : priority;
  const displayDueDate = isEditing ? editDueDate : dueDate;

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

  const handleSubmit = (e: React.FormEvent) => {
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

  const handleTitleChange = (value: string) => {
    if (isEditing && taskToEdit) {
      setEditOverrides((prev) => ({ ...prev, title: value, editId: taskToEdit.id }));
    } else {
      setTitle(value);
    }
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, title: undefined }));
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

  const handlePriorityChange = (value: TaskPriority) => {
    if (isEditing && taskToEdit) {
      setEditOverrides((prev) => ({ ...prev, priority: value, editId: taskToEdit.id }));
    } else {
      setPriority(value);
    }
  };

  const handleDueDateChange = (value: string) => {
    if (isEditing && taskToEdit) {
      setEditOverrides((prev) => ({ ...prev, dueDate: value, editId: taskToEdit.id }));
    } else {
      setDueDate(value);
    }
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
