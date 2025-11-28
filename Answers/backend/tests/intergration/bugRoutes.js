const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/server');
const Bug = require('../../src/models/Bug');

let mongoServer;

// Setup: Connect to in-memory database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Cleanup: Clear database after each test
afterEach(async () => {
  await Bug.deleteMany({});
});

// Teardown: Disconnect and stop server
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Bug API Integration Tests', () => {
  
  describe('POST /api/bugs', () => {
    test('should create a new bug with valid data', async () => {
      const bugData = {
        title: 'Login button not working',
        description: 'Users cannot click the login button on mobile devices',
        priority: 'high',
        reporter: 'John Doe'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(bugData.title);
      expect(response.body.data.status).toBe('open'); // Default status
    });

    test('should return 400 for missing required fields', async () => {
      const invalidData = {
        title: 'Bug'
        // Missing description and reporter
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBeFalsy();
    });

    test('should return 400 for title that is too short', async () => {
      const invalidData = {
        title: 'AB', // Too short
        description: 'This is a valid description',
        reporter: 'John Doe'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBeFalsy();
    });

    test('should sanitize input and remove dangerous characters', async () => {
      const bugData = {
        title: '<script>alert("xss")</script>Test Bug',
        description: 'Description with <script> tags should be sanitized',
        reporter: 'John Doe'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(201);

      expect(response.body.data.title).not.toContain('<');
      expect(response.body.data.title).not.toContain('>');
    });
  });

  describe('GET /api/bugs', () => {
    test('should return all bugs', async () => {
      // Create test bugs
      await Bug.create([
        {
          title: 'Bug 1',
          description: 'First bug description',
          reporter: 'User 1'
        },
        {
          title: 'Bug 2',
          description: 'Second bug description',
          reporter: 'User 2'
        }
      ]);

      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });

    test('should filter bugs by status', async () => {
      await Bug.create([
        {
          title: 'Open Bug',
          description: 'This bug is open',
          status: 'open',
          reporter: 'User 1'
        },
        {
          title: 'Resolved Bug',
          description: 'This bug is resolved',
          status: 'resolved',
          reporter: 'User 2'
        }
      ]);

      const response = await request(app)
        .get('/api/bugs?status=open')
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].status).toBe('open');
    });

    test('should return empty array when no bugs exist', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/bugs/:id', () => {
    test('should return a single bug by ID', async () => {
      const bug = await Bug.create({
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'John Doe'
      });

      const response = await request(app)
        .get(`/api/bugs/${bug._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(bug.title);
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBeFalsy();
    });

    test('should return 400 for invalid ID format', async () => {
      await request(app)
        .get('/api/bugs/invalid-id')
        .expect(400);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    test('should update bug with valid data', async () => {
      const bug = await Bug.create({
        title: 'Original Title',
        description: 'Original description',
        status: 'open',
        reporter: 'John Doe'
      });

      const updateData = {
        title: 'Updated Title',
        status: 'in-progress'
      };

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
    });

    test('should return 404 for updating non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send({ title: 'Updated' })
        .expect(404);
    });

    test('should validate status values on update', async () => {
      const bug = await Bug.create({
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'John Doe'
      });

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.success).toBeFalsy();
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    test('should delete a bug', async () => {
      const bug = await Bug.create({
        title: 'Bug to Delete',
        description: 'This bug will be deleted',
        reporter: 'John Doe'
      });

      await request(app)
        .delete(`/api/bugs/${bug._id}`)
        .expect(200);

      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });

    test('should return 404 when deleting non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);
    });
  });

  describe('GET /api/bugs/stats', () => {
    test('should return bug statistics', async () => {
      await Bug.create([
        {
          title: 'Bug 1',
          description: 'Description 1',
          status: 'open',
          priority: 'high',
          reporter: 'User 1'
        },
        {
          title: 'Bug 2',
          description: 'Description 2',
          status: 'open',
          priority: 'low',
          reporter: 'User 2'
        },
        {
          title: 'Bug 3',
          description: 'Description 3',
          status: 'resolved',
          priority: 'high',
          reporter: 'User 3'
        }
      ]);

      const response = await request(app)
        .get('/api/bugs/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('byStatus');
      expect(response.body.data).toHaveProperty('byPriority');
    });
  });
});
