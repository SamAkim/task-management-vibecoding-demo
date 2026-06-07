import type { Task } from '../types/Task';

const STORAGE_KEY = 'tasks';

export function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    
    // Default missing priority and dueDate for backward compatibility
    const today = new Date().toISOString().split('T')[0];
    return (parsed as Partial<Task>[]).map((task) => ({
      ...task,
      priority: task.priority || 'medium',
      dueDate: task.dueDate || today,
    })) as Task[];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
