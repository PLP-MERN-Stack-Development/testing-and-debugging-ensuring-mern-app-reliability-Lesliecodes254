const {
  isValidStatus,
  isValidPriority,
  sanitizeInput,
  isValidEmail,
  meetsMinLength,
  formatBugResponse
} = require('../../src/utils/validators');

describe('Validator Utility Functions', () => {
  
  describe('isValidStatus', () => {
    test('should return true for valid statuses', () => {
      expect(isValidStatus('open')).toBe(true);
      expect(isValidStatus('in-progress')).toBe(true);
      expect(isValidStatus('resolved')).toBe(true);
      expect(isValidStatus('closed')).toBe(true);
    });

    test('should return false for invalid statuses', () => {
      expect(isValidStatus('pending')).toBe(false);
      expect(isValidStatus('invalid')).toBe(false);
      expect(isValidStatus('')).toBe(false);
      expect(isValidStatus(null)).toBe(false);
    });
  });

  describe('isValidPriority', () => {
    test('should return true for valid priorities', () => {
      expect(isValidPriority('low')).toBe(true);
      expect(isValidPriority('medium')).toBe(true);
      expect(isValidPriority('high')).toBe(true);
      expect(isValidPriority('critical')).toBe(true);
    });

    test('should return false for invalid priorities', () => {
      expect(isValidPriority('urgent')).toBe(false);
      expect(isValidPriority('normal')).toBe(false);
      expect(isValidPriority('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    test('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    test('should remove < and > characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    test('should limit length to 1000 characters', () => {
      const longString = 'a'.repeat(1500);
      expect(sanitizeInput(longString).length).toBe(1000);
    });

    test('should handle non-string inputs', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
    });
  });

  describe('isValidEmail', () => {
    test('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('meetsMinLength', () => {
    test('should return true when string meets minimum length', () => {
      expect(meetsMinLength('hello', 3)).toBe(true);
      expect(meetsMinLength('test', 4)).toBe(true);
    });

    test('should return false when string is too short', () => {
      expect(meetsMinLength('hi', 3)).toBe(false);
      expect(meetsMinLength('', 1)).toBe(false);
    });

    test('should trim whitespace before checking', () => {
      expect(meetsMinLength('  hi  ', 2)).toBe(true);
      expect(meetsMinLength('  hi  ', 3)).toBe(false);
    });

    test('should return false for non-string inputs', () => {
      expect(meetsMinLength(123, 3)).toBe(false);
      expect(meetsMinLength(null, 1)).toBe(false);
    });
  });

  describe('formatBugResponse', () => {
    test('should format bug object correctly', () => {
      const mockBug = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Test Bug',
        description: 'Test Description',
        status: 'open',
        priority: 'high',
        reporter: 'John Doe',
        assignedTo: 'Jane Smith',
        tags: ['frontend', 'urgent'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02')
      };

      const formatted = formatBugResponse(mockBug);

      expect(formatted).toHaveProperty('id', mockBug._id);
      expect(formatted).toHaveProperty('title', mockBug.title);
      expect(formatted).toHaveProperty('description', mockBug.description);
      expect(formatted).toHaveProperty('status', mockBug.status);
      expect(formatted).toHaveProperty('priority', mockBug.priority);
      expect(formatted).toHaveProperty('reporter', mockBug.reporter);
      expect(formatted).toHaveProperty('assignedTo', mockBug.assignedTo);
      expect(formatted).toHaveProperty('tags', mockBug.tags);
      expect(formatted).toHaveProperty('createdAt', mockBug.createdAt);
      expect(formatted).toHaveProperty('updatedAt', mockBug.updatedAt);
      expect(formatted).not.toHaveProperty('_id');
    });
  });
});
