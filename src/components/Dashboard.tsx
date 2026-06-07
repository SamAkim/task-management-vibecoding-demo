import { useState } from 'react';
import type { Task } from '../types/Task';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { SearchBar } from './SearchBar';
import { StatusFilter } from './StatusFilter';
import { PriorityFilter } from './PriorityFilter';
import { SortControl } from './SortControl';

export function Dashboard() {
  const {
    filteredTasks,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = (
    id: string,
    updates: {
      title: string;
      description: string;
      status: Task['status'];
      priority: Task['priority'];
      dueDate: string;
    }
  ) => {
    updateTask(id, updates);
    setTaskToEdit(null);
  };

  const handleCancelEdit = () => {
    setTaskToEdit(null);
  };

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <h1 className="dashboard__title">Task Manager</h1>
          <p className="dashboard__subtitle">Organize your work, amplify your productivity</p>
        </div>
      </header>

      <main className="dashboard__main">
        <section className="dashboard__form-section" aria-label="Task form">
          <TaskForm
            key={taskToEdit ? taskToEdit.id : 'new-task'}
            onSubmit={addTask}
            onUpdate={handleUpdate}
            taskToEdit={taskToEdit}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        <section className="dashboard__controls" aria-label="Task filters">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="dashboard__filters-group">
            <StatusFilter value={statusFilter} onChange={setStatusFilter} />
            <PriorityFilter value={priorityFilter} onChange={setPriorityFilter} />
            <SortControl value={sortBy} onChange={setSortBy} />
          </div>
        </section>

        <section className="dashboard__tasks" aria-label="Task list">
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        </section>
      </main>
    </div>
  );
}
