import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugForm from './BugForm';

describe('BugForm Component', () => {
  let mockOnSubmit;
  let mockOnCancel;

  beforeEach(() => {
    mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    mockOnCancel = jest.fn();
  });

  test('renders form with all fields', () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assigned to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  test('shows validation errors for required fields', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('shows validation error when title is too short', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.type(titleInput, 'AB');

    const submitButton = screen.getByRole('button', { name: /submit bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  test('shows validation error when description is too short', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const descInput = screen.getByLabelText(/description/i);
    await userEvent.type(descInput, 'Short');

    const submitButton = screen.getByRole('button', { name: /submit bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descInput = screen.getByLabelText(/description/i);
    const reporterInput = screen.getByLabelText(/reporter/i);

    await userEvent.type(titleInput, 'Login button broken');
    await userEvent.type(descInput, 'The login button does not respond to clicks');
    await userEvent.type(reporterInput, 'John Doe');

    const submitButton = screen.getByRole('button', { name: /submit bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Login button broken',
          description: 'The login button does not respond to clicks',
          reporter: 'John Doe',
          priority: 'medium',
          tags: []
        })
      );
    });
  });

  test('clears validation errors when user types', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.type(titleInput, 'New Title');

    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
  });

  test('processes tags correctly', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descInput = screen.getByLabelText(/description/i);
    const reporterInput = screen.getByLabelText(/reporter/i);
    const tagsInput = screen.getByLabelText(/tags/i);

    await userEvent.type(titleInput, 'Test Bug');
    await userEvent.type(descInput, 'This is a test bug description');
    await userEvent.type(reporterInput, 'John Doe');
    await userEvent.type(tagsInput, 'frontend, ui, critical');

    const submitButton = screen.getByRole('button', { name: /submit bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['frontend', 'ui', 'critical']
        })
      );
    });
  });

  test('handles submission errors gracefully', async () => {
    const errorMessage = 'Network error';
    mockOnSubmit = jest.fn().mockRejectedValue(new Error(errorMessage));

    render(<BugForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descInput = screen.getByLabelText(/description/i);
    const reporterInput = screen.getByLabelText(/reporter/i);

    await userEvent.type(titleInput, 'Test Bug');
    await userEvent.type(descInput, 'Test Description');
    await userEvent.type(reporterInput, 'John Doe');

    const submitButton = screen.getByRole('button', { name: /submit bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('disables submit button while submitting', async () => {
    mockOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<BugForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descInput = screen.getByLabelText(/description/i);
    const reporterInput = screen.getByLabelText(/reporter/i);

    await userEvent.type(titleInput, 'Test Bug');
    await userEvent.type(descInput, 'Test Description');
    await userEvent.type(reporterInput, 'John Doe');

    const submitButton = screen.getByRole('button', { name: /submit bug/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/submitting/i);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('populates form with initial data when editing', () => {
    const initialData = {
      title: 'Existing Bug',
      description: 'Existing description',
      priority: 'high',
      reporter: 'Jane Doe',
      assignedTo: 'John Smith',
      tags: ['backend', 'api']
    };

    render(<BugForm onSubmit={mockOnSubmit} initialData={initialData} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Bug');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Existing description');
    expect(screen.getByLabelText(/priority/i)).toHaveValue('high');
    expect(screen.getByLabelText(/reporter/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/assigned to/i)).toHaveValue('John Smith');
    expect(screen.getByLabelText(/tags/i)).toHaveValue('backend, api');
  });
});
