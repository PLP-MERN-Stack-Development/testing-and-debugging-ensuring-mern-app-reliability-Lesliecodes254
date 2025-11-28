# MERN Bug Tracker - Testing & Debugging Project

A comprehensive bug tracking application built with the MERN stack, featuring extensive testing coverage, debugging techniques, and error handling best practices.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Debugging Techniques](#debugging-techniques)
- [Error Handling](#error-handling)
- [API Documentation](#api-documentation)
- [Testing Approach](#testing-approach)

## ✨ Features

- **Create, Read, Update, Delete (CRUD)** bug reports
- **Filter bugs** by status and priority
- **Real-time updates** with responsive UI
- **Comprehensive validation** on both frontend and backend
- **Error boundaries** for graceful error handling
- **Full test coverage** with unit and integration tests
- **Debugging tools integration** for both frontend and backend

## 🛠 Tech Stack

### Backend
- **Node.js** & **Express.js** - Server and API
- **MongoDB** & **Mongoose** - Database
- **Jest** & **Supertest** - Testing framework
- **Express Validator** - Input validation
- **Morgan** - HTTP request logger

### Frontend
- **React** - UI framework
- **Axios** - HTTP client
- **React Testing Library** - Component testing
- **Jest** - Test runner

## 📁 Project Structure

```
mern-bug-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # MongoDB connection
│   │   ├── controllers/
│   │   │   └── bugController.js    # Business logic
│   │   ├── models/
│   │   │   └── Bug.js              # Mongoose schema
│   │   ├── routes/
│   │   │   └── bugRoutes.js        # API routes
│   │   ├── middleware/
│   │   │   ├── errorHandler.js     # Error handling
│   │   │   └── validation.js       # Request validation
│   │   ├── utils/
│   │   │   └── validators.js       # Helper functions
│   │   └── server.js               # App entry point
│   ├── tests/
│   │   ├── unit/
│   │   │   └── validators.test.js  # Unit tests
│   │   └── integration/
│   │       └── bugRoutes.test.js   # Integration tests
│   ├── package.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.js    # Error boundary
│   │   │   ├── BugForm.js          # Bug creation form
│   │   │   ├── BugList.js          # Bug list display
│   │   │   └── BugItem.js          # Individual bug item
│   │   ├── services/
│   │   │   └── bugService.js       # API client
│   │   ├── App.js                  # Main component
│   │   └── index.js                # Entry point
│   ├── tests/
│   ├── package.json
│   └── jest.config.js
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bug-tracker
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EOL

# Start MongoDB (if not running)
mongod
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
REACT_APP_API_URL=http://localhost:5000/api
EOL
```

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

**Frontend:**
```bash
cd frontend
npm start
```
App runs on: http://localhost:3000

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the build folder with your preferred server
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run in watch mode
npm run test:watch
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:nowatch

# Run in watch mode
npm test
```

### Test Coverage Goals

The project maintains minimum coverage thresholds:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🐛 Debugging Techniques

### Backend Debugging

#### 1. Console Logging
Strategic console.log statements are placed throughout the code:
```javascript
console.log('Fetching bugs with query:', query);
console.log('Bug created successfully:', bug._id);
console.error('Database connection error:', error);
```

#### 2. Node.js Inspector
Debug server-side code with Chrome DevTools:
```bash
npm run debug
```
Then open `chrome://inspect` in Chrome.

#### 3. Morgan HTTP Logger
Monitor all HTTP requests in development:
```javascript
app.use(morgan('dev'));
```

#### 4. Error Stack Traces
Detailed error information in development mode:
```javascript
if (process.env.NODE_ENV === 'development') {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}
```

### Frontend Debugging

#### 1. Chrome DevTools
- **Network Tab**: Monitor API calls
- **Console**: View logs and errors
- **React DevTools**: Inspect component state and props
- **Sources Tab**: Set breakpoints in code

#### 2. Console Logging
API calls and state changes are logged:
```javascript
console.log('Fetching bugs with filters:', filter);
console.log('Bugs fetched successfully:', response.count);
```

#### 3. Error Boundary
Catches and displays React errors gracefully:
```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error);
  }
}
```

## 🛡️ Error Handling

### Backend Error Handling

#### 1. Custom Error Class
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

#### 2. Global Error Handler Middleware
```javascript
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  // Send appropriate response
});
```

#### 3. Validation Errors
Express-validator catches validation errors:
```javascript
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array(), 400));
  }
  next();
};
```

### Frontend Error Handling

#### 1. Error Boundary Component
Wraps the entire app to catch rendering errors:
```javascript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

#### 2. API Error Handling
Consistent error handling in API service:
```javascript
const handleApiError = (error) => {
  if (error.response) {
    return new Error(error.response.data.message);
  }
  return new Error('Network error');
};
```

#### 3. Form Validation
Client-side validation with user-friendly messages:
```javascript
if (!formData.title.trim()) {
  newErrors.title = 'Title is required';
}
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Get All Bugs
```
GET /bugs
Query Parameters:
  - status: open | in-progress | resolved | closed
  - priority: low | medium | high | critical
Response: { success: true, count: number, data: Bug[] }
```

#### Get Bug by ID
```
GET /bugs/:id
Response: { success: true, data: Bug }
```

#### Create Bug
```
POST /bugs
Body: {
  title: string (required, 3-200 chars),
  description: string (required, min 10 chars),
  priority?: 'low' | 'medium' | 'high' | 'critical',
  reporter: string (required),
  assignedTo?: string,
  tags?: string[]
}
Response: { success: true, data: Bug }
```

#### Update Bug
```
PUT /bugs/:id
Body: Partial<Bug>
Response: { success: true, data: Bug }
```

#### Delete Bug
```
DELETE /bugs/:id
Response: { success: true, message: string }
```

#### Get Statistics
```
GET /bugs/stats
Response: {
  success: true,
  data: {
    byStatus: Array<{ _id: string, count: number }>,
    byPriority: Array<{ _id: string, count: number }>
  }
}
```

## 📊 Testing Approach

### Backend Testing Strategy

#### Unit Tests
Focus on individual functions and helpers:
- **Validators**: Test input validation logic
- **Utilities**: Test helper functions
- **Coverage**: Test edge cases and error conditions

#### Integration Tests
Test complete request-response cycles:
- **API Routes**: Test all CRUD operations
- **Database Operations**: Use in-memory MongoDB
- **Validation**: Test request validation middleware
- **Error Handling**: Test error responses

**Key Testing Patterns:**
```javascript
// Mock database with MongoMemoryServer
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// Clean up after each test
afterEach(async () => {
  await Bug.deleteMany({});
});
```

### Frontend Testing Strategy

#### Component Tests
Test component rendering and behavior:
- **Rendering**: Verify correct UI display
- **User Interaction**: Test button clicks, form submission
- **State Changes**: Verify component state updates
- **Props**: Test prop handling

#### Service Tests
Mock API calls and test error handling:
- **Successful Calls**: Test happy path scenarios
- **Error Cases**: Test network errors, validation errors
- **Data Transformation**: Verify correct data formatting

**Key Testing Patterns:**
```javascript
// Mock axios
jest.mock('axios');

// Test component with user events
await userEvent.type(titleInput, 'Test Bug');
fireEvent.click(submitButton);

// Verify async behavior
await waitFor(() => {
  expect(mockOnSubmit).toHaveBeenCalled();
});
```

## 🎯 Best Practices Implemented

### Code Quality
- ✅ Consistent error handling
- ✅ Input validation and sanitization
- ✅ Modular and reusable code
- ✅ Comprehensive documentation

### Testing
- ✅ High test coverage (70%+)
- ✅ Unit and integration tests
- ✅ Edge case testing
- ✅ Mocking external dependencies

### Debugging
- ✅ Strategic logging
- ✅ Error boundaries
- ✅ Developer-friendly error messages
- ✅ Source maps for debugging

### Performance
- ✅ Database indexing
- ✅ Efficient queries
- ✅ Request validation
- ✅ Error-first callbacks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Built as a comprehensive testing and debugging demonstration for MERN stack development.

---

**Happy Debugging! 🐛**
