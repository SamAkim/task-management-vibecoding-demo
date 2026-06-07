import { render, screen, within, fireEvent } from '@testing-library/react';
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
    status?: string,
    priority?: string,
    dueDate = '2026-06-10'
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

    if (priority) {
      const prioritySelect = screen.getByRole('combobox', { name: /priority/i });
      await user.selectOptions(prioritySelect, priority);
    }

    if (dueDate) {
      const dueDateInput = screen.getByLabelText(/due date/i);
      fireEvent.change(dueDateInput, { target: { value: dueDate } });
    }

    await user.click(submitButton);
  }

  describe('creating a task', () => {
    it('adds a new task and displays it in the list', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'My New Task', 'A description', 'todo', 'high', '2026-06-12');

      expect(screen.getByText('My New Task')).toBeInTheDocument();
      expect(screen.getByText('A description')).toBeInTheDocument();
      
      const taskCard = screen.getByText('My New Task').closest('article')!;
      expect(within(taskCard).getByText('To Do')).toBeInTheDocument();
      expect(within(taskCard).getByText('High')).toBeInTheDocument();
      expect(within(taskCard).getByText(/Due: 2026-06-12/i)).toBeInTheDocument();
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

    it('shows validation errors when submitting invalid fields', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      // Verify validation errors are shown
      expect(screen.getByTestId('title-error')).toHaveTextContent('Title is required');
      expect(screen.getByTestId('due-date-error')).toHaveTextContent('Due date is required');

      // Type in title and check that title error disappears
      const titleInput = screen.getByRole('textbox', { name: /title/i });
      await user.type(titleInput, 'Valid Title');
      expect(screen.queryByTestId('title-error')).not.toBeInTheDocument();

      // Set due date and check that due-date error disappears
      const dueDateInput = screen.getByLabelText(/due date/i);
      fireEvent.change(dueDateInput, { target: { value: '2026-06-10' } });
      expect(screen.queryByTestId('due-date-error')).not.toBeInTheDocument();

      // Submit and verify task is added
      await user.click(submitButton);
      expect(screen.getByText('Valid Title')).toBeInTheDocument();
    });
  });

  describe('editing a task', () => {
    it('updates a task with new values', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'Original Title', 'Original description', 'todo', 'medium', '2026-06-10');

      await user.click(screen.getByRole('button', { name: /edit original title/i }));

      const titleInput = screen.getByRole('textbox', { name: /title/i });
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');

      // Change priority and due date during edit
      const prioritySelect = screen.getByRole('combobox', { name: /priority/i });
      await user.selectOptions(prioritySelect, 'high');
      
      const dueDateInput = screen.getByLabelText(/due date/i);
      fireEvent.change(dueDateInput, { target: { value: '2026-06-25' } });

      await user.click(screen.getByRole('button', { name: /update task/i }));

      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.queryByText('Original Title')).not.toBeInTheDocument();
      
      const taskCard = screen.getByText('Updated Title').closest('article')!;
      expect(within(taskCard).getByText('High')).toBeInTheDocument();
      expect(within(taskCard).getByText(/Due: 2026-06-25/i)).toBeInTheDocument();
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

      await createTask(user, 'Todo Task', '', 'todo');
      await createTask(user, 'Progress Task', '', 'in-progress');
      await createTask(user, 'Done Task', '', 'completed');

      const filterGroup = screen.getByRole('group', { name: /filter by status/i });
      await user.click(within(filterGroup).getByRole('button', { name: /in progress/i }));

      expect(screen.queryByText('Todo Task')).not.toBeInTheDocument();
      expect(screen.getByText('Progress Task')).toBeInTheDocument();
      expect(screen.queryByText('Done Task')).not.toBeInTheDocument();

      await user.click(within(filterGroup).getByRole('button', { name: /^all$/i }));

      expect(screen.getByText('Todo Task')).toBeInTheDocument();
      expect(screen.getByText('Progress Task')).toBeInTheDocument();
      expect(screen.getByText('Done Task')).toBeInTheDocument();
    });
  });

  describe('filtering tasks by priority', () => {
    it('shows only tasks matching the selected priority filter', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'High Priority Task', '', 'todo', 'high');
      await createTask(user, 'Medium Priority Task', '', 'todo', 'medium');
      await createTask(user, 'Low Priority Task', '', 'todo', 'low');

      const filterGroup = screen.getByRole('group', { name: /filter by priority/i });
      await user.click(within(filterGroup).getByRole('button', { name: /^high$/i }));

      expect(screen.getByText('High Priority Task')).toBeInTheDocument();
      expect(screen.queryByText('Medium Priority Task')).not.toBeInTheDocument();
      expect(screen.queryByText('Low Priority Task')).not.toBeInTheDocument();

      await user.click(within(filterGroup).getByRole('button', { name: /all priorities/i }));
      expect(screen.getByText('High Priority Task')).toBeInTheDocument();
      expect(screen.getByText('Medium Priority Task')).toBeInTheDocument();
      expect(screen.getByText('Low Priority Task')).toBeInTheDocument();
    });
  });

  describe('sorting tasks', () => {
    it('sorts tasks by priority (high to low)', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'Medium Task', '', 'todo', 'medium', '2026-06-10');
      await createTask(user, 'High Task', '', 'todo', 'high', '2026-06-10');
      await createTask(user, 'Low Task', '', 'todo', 'low', '2026-06-10');

      const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
      await user.selectOptions(sortSelect, 'priority');

      const taskCards = screen.getAllByRole('article');
      expect(taskCards).toHaveLength(3);
      expect(within(taskCards[0]).getByRole('heading')).toHaveTextContent('High Task');
      expect(within(taskCards[1]).getByRole('heading')).toHaveTextContent('Medium Task');
      expect(within(taskCards[2]).getByRole('heading')).toHaveTextContent('Low Task');
    });

    it('sorts tasks by due date (earliest first)', async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await createTask(user, 'Later Task', '', 'todo', 'medium', '2026-06-15');
      await createTask(user, 'Earlier Task', '', 'todo', 'medium', '2026-06-05');
      await createTask(user, 'Middle Task', '', 'todo', 'medium', '2026-06-10');

      const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
      await user.selectOptions(sortSelect, 'dueDate');

      const taskCards = screen.getAllByRole('article');
      expect(taskCards).toHaveLength(3);
      expect(within(taskCards[0]).getByRole('heading')).toHaveTextContent('Earlier Task');
      expect(within(taskCards[1]).getByRole('heading')).toHaveTextContent('Middle Task');
      expect(within(taskCards[2]).getByRole('heading')).toHaveTextContent('Later Task');
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
        priority: 'medium' as const,
        dueDate: '2026-06-10',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };
      localStorage.setItem('tasks', JSON.stringify([existingTask]));

      render(<Dashboard />);

      expect(screen.getByText('Pre-existing Task')).toBeInTheDocument();
      expect(screen.getByText('Already in storage')).toBeInTheDocument();
      
      const taskCard = screen.getByText('Pre-existing Task').closest('article')!;
      expect(within(taskCard).getByText('In Progress')).toBeInTheDocument();
      expect(within(taskCard).getByText('Medium')).toBeInTheDocument();
    });
  });
});
