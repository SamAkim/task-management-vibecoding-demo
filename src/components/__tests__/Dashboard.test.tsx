import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../Dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  async function createTask(
    user: ReturnType<typeof userEvent.setup>,
    title: string,
    description = '',
    status?: string
  ) {
    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const submitButton = screen.getByRole('button', { name: /add task/i });

    await user.type(titleInput, title);

    if (description) {
      const descInput = screen.getByRole('textbox', { name: /description/i });
      await user.type(descInput, description);
    }

    if (status) {
      const statusSelect = screen.getByRole('combobox', { name: /status/i });
      await user.selectOptions(statusSelect, status);
    }

    await user.click(submitButton);
  }

  describe('creating a task', () => {
    it('adds a new task and displays it in the list', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'My New Task', 'A description');

      expect(screen.getByText('My New Task')).toBeInTheDocument();
      expect(screen.getByText('A description')).toBeInTheDocument();
      // Verify the status badge is present on the task card
      const taskCard = screen.getByText('My New Task').closest('article')!;
      expect(within(taskCard).getByText('To Do')).toBeInTheDocument();
    });

    it('clears the form after adding a task', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'Task to add');

      const titleInput = screen.getByRole('textbox', { name: /title/i });
      const descInput = screen.getByRole('textbox', { name: /description/i });
      expect(titleInput).toHaveValue('');
      expect(descInput).toHaveValue('');
    });
  });

  describe('editing a task', () => {
    it('updates a task with new values', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'Original Title', 'Original description');

      await user.click(screen.getByRole('button', { name: /edit original title/i }));

      const titleInput = screen.getByRole('textbox', { name: /title/i });
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');

      await user.click(screen.getByRole('button', { name: /update task/i }));

      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.queryByText('Original Title')).not.toBeInTheDocument();
    });
  });

  describe('deleting a task', () => {
    it('removes a task from the list', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'Task to Delete');
      expect(screen.getByText('Task to Delete')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /delete task to delete/i }));

      expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
    });
  });

  describe('filtering tasks by status', () => {
    it('shows only tasks matching the selected status filter', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'Todo Task');
      await createTask(user, 'Progress Task', '', 'In Progress');
      await createTask(user, 'Done Task', '', 'Completed');

      // Filter to In Progress using the filter button group
      const filterGroup = screen.getByRole('group', { name: /filter by status/i });
      await user.click(within(filterGroup).getByRole('button', { name: /in progress/i }));

      expect(screen.queryByText('Todo Task')).not.toBeInTheDocument();
      expect(screen.getByText('Progress Task')).toBeInTheDocument();
      expect(screen.queryByText('Done Task')).not.toBeInTheDocument();

      // Filter to All
      await user.click(within(filterGroup).getByRole('button', { name: /^all$/i }));

      expect(screen.getByText('Todo Task')).toBeInTheDocument();
      expect(screen.getByText('Progress Task')).toBeInTheDocument();
      expect(screen.getByText('Done Task')).toBeInTheDocument();
    });
  });

  describe('searching tasks by title', () => {
    it('filters tasks based on the search query', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'Buy groceries');
      await createTask(user, 'Write report');
      await createTask(user, 'Buy new shoes');

      await user.type(screen.getByPlaceholderText(/search by title/i), 'Buy');

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Buy new shoes')).toBeInTheDocument();
      expect(screen.queryByText('Write report')).not.toBeInTheDocument();
    });
  });

  describe('localStorage persistence', () => {
    it('saves tasks to localStorage when a task is created', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'Persisted Task');

      const stored = JSON.parse(localStorage.getItem('tasks')!);
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('Persisted Task');
    });

    it('loads tasks from localStorage on mount', () => {
      const existingTask = {
        id: 'pre-1',
        title: 'Pre-existing Task',
        description: 'Already in storage',
        status: 'in-progress',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };
      localStorage.setItem('tasks', JSON.stringify([existingTask]));

      render(<Dashboard />);

      expect(screen.getByText('Pre-existing Task')).toBeInTheDocument();
      expect(screen.getByText('Already in storage')).toBeInTheDocument();
      // Verify the status badge within the task card specifically
      const taskCard = screen.getByText('Pre-existing Task').closest('article')!;
      expect(within(taskCard).getByText('In Progress')).toBeInTheDocument();
    });
  });
});
