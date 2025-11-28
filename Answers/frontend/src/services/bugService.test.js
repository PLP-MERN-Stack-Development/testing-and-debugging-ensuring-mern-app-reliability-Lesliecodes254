import axios from 'axios';
import {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats
} from './bugService';

jest.mock('axios');

describe('Bug Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBugs', () => {
    test('fetches all bugs successfully', async () => {
      const mockBugs = {
        success: true,
        count: 2,
        data: [
          { id: '1', title: 'Bug 1', status: 'open' },
          { id: '2', title: 'Bug 2', status: 'resolved' }
        ]
      };

      axios.create.mockReturnThis();
      axios.get.mockResolvedValue({ data: mockBugs });

      const result = await getAllBugs();

      expect(result).toEqual(mockBugs);
    });

    test('fetches bugs with filters', async () => {
      const mockBugs = {
        success: true,
        count: 1,
        data: [{ id: '1', title: 'Bug 1', status: 'open', priority: 'high' }]
      };

      axios.create.mockReturnThis();
      axios.get.mockResolvedValue({ data: mockBugs });

      const filters = { status: 'open', priority: 'high' };
      const result = await getAllBugs(filters);

      expect(result).toEqual(mockBugs);
    });

    test('handles errors when fetching bugs', async () => {
      const errorMessage = 'Network error';
      axios.create.mockReturnThis();
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getAllBugs()).rejects.toThrow(errorMessage);
    });
  });

  describe('getBugById', () => {
    test('fetches bug by ID successfully', async () => {
      const mockBug = {
        success: true,
        data: { id: '1', title: 'Bug 1', status: 'open' }
      };

      axios.create.mockReturnThis();
      axios.get.mockResolvedValue({ data: mockBug });

      const result = await getBugById('1');

      expect(result).toEqual(mockBug);
    });

    test('handles errors when bug not found', async () => {
      axios.create.mockReturnThis();
      axios.get.mockRejectedValue({
        response: {
          data: { message: 'Bug not found' }
        }
      });

      await expect(getBugById('invalid-id')).rejects.toThrow('Bug not found');
    });
  });

  describe('createBug', () => {
    test('creates bug successfully', async () => {
      const bugData = {
        title: 'New Bug',
        description: 'Bug description',
        reporter: 'John Doe'
      };

      const mockResponse = {
        success: true,
        data: { id: '1', ...bugData, status: 'open' }
      };

      axios.create.mockReturnThis();
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await createBug(bugData);

      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith('/bugs', bugData);
    });

    test('handles validation errors', async () => {
      const bugData = { title: 'AB' };

      axios.create.mockReturnThis();
      axios.post.mockRejectedValue({
        response: {
          data: { message: 'Validation failed' }
        }
      });

      await expect(createBug(bugData)).rejects.toThrow('Validation failed');
    });
  });

  describe('updateBug', () => {
    test('updates bug successfully', async () => {
      const updates = { status: 'resolved' };
      const mockResponse = {
        success: true,
        data: { id: '1', title: 'Bug 1', status: 'resolved' }
      };

      axios.create.mockReturnThis();
      axios.put.mockResolvedValue({ data: mockResponse });

      const result = await updateBug('1', updates);

      expect(result).toEqual(mockResponse);
      expect(axios.put).toHaveBeenCalledWith('/bugs/1', updates);
    });

    test('handles update errors', async () => {
      axios.create.mockReturnThis();
      axios.put.mockRejectedValue({
        response: {
          data: { message: 'Update failed' }
        }
      });

      await expect(updateBug('1', {})).rejects.toThrow('Update failed');
    });
  });

  describe('deleteBug', () => {
    test('deletes bug successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Bug deleted successfully'
      };

      axios.create.mockReturnThis();
      axios.delete.mockResolvedValue({ data: mockResponse });

      const result = await deleteBug('1');

      expect(result).toEqual(mockResponse);
      expect(axios.delete).toHaveBeenCalledWith('/bugs/1');
    });

    test('handles delete errors', async () => {
      axios.create.mockReturnThis();
      axios.delete.mockRejectedValue({
        response: {
          data: { message: 'Delete failed' }
        }
      });

      await expect(deleteBug('1')).rejects.toThrow('Delete failed');
    });
  });

  describe('getBugStats', () => {
    test('fetches bug statistics successfully', async () => {
      const mockStats = {
        success: true,
        data: {
          byStatus: [
            { _id: 'open', count: 5 },
            { _id: 'resolved', count: 10 }
          ],
          byPriority: [
            { _id: 'high', count: 3 },
            { _id: 'low', count: 12 }
          ]
        }
      };

      axios.create.mockReturnThis();
      axios.get.mockResolvedValue({ data: mockStats });

      const result = await getBugStats();

      expect(result).toEqual(mockStats);
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      axios.create.mockReturnThis();
      axios.get.mockRejectedValue({
        request: {}
      });

      await expect(getAllBugs()).rejects.toThrow('No response from server');
    });

    test('handles unexpected errors', async () => {
      axios.create.mockReturnThis();
      axios.get.mockRejectedValue(new Error('Unexpected error'));

      await expect(getAllBugs()).rejects.toThrow('Unexpected error');
    });
  });
});
