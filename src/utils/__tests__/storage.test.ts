import { loadTasks, saveTasks } from '../storage';
import type { Task } from '../../types/Task';

const mockTask: Task = {
  id: '123',
  title: 'Test Task',
  description: 'Test description',
  status: 'todo',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadTasks', () => {
    it('returns an empty array when localStorage is empty', () => {
      const result = loadTasks();
      expect(result).toEqual([]);
    });

    it('parses and returns stored tasks correctly', () => {
      localStorage.setItem('tasks', JSON.stringify([mockTask]));
      const result = loadTasks();
      expect(result).toEqual([mockTask]);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Task');
    });

    it('returns an empty array when stored data is not an array', () => {
      localStorage.setItem('tasks', JSON.stringify({ not: 'an array' }));
      const result = loadTasks();
      expect(result).toEqual([]);
    });

    it('returns an empty array when stored data is corrupt JSON', () => {
      localStorage.setItem('tasks', '{invalid json!!!');
      const result = loadTasks();
      expect(result).toEqual([]);
    });
  });

  describe('saveTasks', () => {
    it('writes tasks to localStorage as JSON', () => {
      saveTasks([mockTask]);
      const stored = localStorage.getItem('tasks');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual([mockTask]);
    });

    it('writes an empty array when given no tasks', () => {
      saveTasks([]);
      const stored = localStorage.getItem('tasks');
      expect(JSON.parse(stored!)).toEqual([]);
    });
  });
});
