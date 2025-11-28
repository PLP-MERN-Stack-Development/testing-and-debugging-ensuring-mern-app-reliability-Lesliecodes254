# Debugging Exercises - Intentional Bugs Guide

This document provides intentional bugs you can introduce to practice debugging techniques.

## 🐛 Backend Debugging Exercises

### Exercise 1: Missing Await in Async Function

**Location**: `backend/src/controllers/bugController.js`

**Original Code** (Line in `createBug`):
```javascript
const bug = await Bug.create(bugData);
```

**Introduce Bug** (Remove await):
```javascript
const bug = Bug.create(bugData);
```

**Expected Issue**: Returns a Promise instead of the actual bug object

**Debugging Steps**:
1. Check console logs - bug._id will be undefined
2. Use Node.js debugger to inspect `bug` variable
3. Use `node --inspect-brk src/server.js`
4. Set breakpoint and check variable type

**Detection Method**:
```javascript
console.log('Bug type:', typeof bug);
console.log('Is Promise?', bug instanceof Promise);
```

---

### Exercise 2: Incorrect Status Validation

**Location**: `backend/src/utils/validators.js`

**Original Code**:
```javascript
const isValidStatus = (status) => {
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  return validStatuses.includes(status);
};
```

**Introduce Bug** (Typo in array):
```javascript
const isValidStatus = (status) => {
  const validStatuses = ['open', 'in-progres', 'resolved', 'closed']; // Missing 's'
  return validStatuses.includes(status);
};
```

**Expected Issue**: Valid 'in-progress' status rejected

**Debugging Steps**:
1. Write a test that fails: `expect(isValidStatus('in-progress')).toBe(true)`
2. Add console.log to see what's in the array
3. Use Chrome DevTools to step through function

---

### Exercise 3: Race Condition in Database

**Location**: `backend/src/controllers/bugController.js`

**Original Code** (in `getAllBugs`):
```javascript
const bugs = await Bug.find(query).sort(sortBy);
res.status(200).json({
  success: true,
  count: bugs.length,
  data: bugs.map(formatBugResponse)
});
```

**Introduce Bug**:
```javascript
Bug.find(query).sort(sortBy); // No await
res.status(200).json({
  success: true,
  count: bugs.length, // bugs is undefined
  data: bugs.map(formatBugResponse)
});
```

**Expected Issue**: TypeError: Cannot read property 'length' of undefined

**Debugging Steps**:
1. Check error stack trace
2. Add console.log before accessing bugs
3. Use `node --inspect` and add breakpoint
4. Check Network tab in DevTools for error response

---

### Exercise 4: Incorrect MongoDB Query

**Location**: `backend/src/controllers/bugController.js`

**Original Code** (in `getBugById`):
```javascript
const bug = await Bug.findById(req.params.id);
```

**Introduce Bug**:
```javascript
const bug = await Bug.findOne({ id: req.params.id }); // Wrong field
```

**Expected Issue**: Always returns null (MongoDB uses _id, not id)

**Debugging Steps**:
1. Console.log the query object
2. Check MongoDB logs
3. Use MongoDB Compass to inspect actual document structure
4. Add console.log for `req.params.id` vs actual document

---

### Exercise 5: Memory Leak in Event Listeners

**Location**: Create new file `backend/src/utils/bugNotifier.js`

**Introduce Bug**:
```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

const setupBugNotifications = () => {
  // This creates a new listener every time it's called
  // without removing old ones
  emitter.on('bug-created', (bug) => {
    console.log('New bug created:', bug.id);
  });
};

module.exports = { setupBugNotifications, emitter };
```

**Expected Issue**: Multiple listeners accumulate, memory increases

**Debugging Steps**:
1. Use `node --inspect` with Chrome DevTools
2. Take heap snapshots
3. Check listener count: `console.log(emitter.listenerCount('bug-created'))`
4. Use `process.memoryUsage()` to monitor

**Fix**:
```javascript
emitter.removeAllListeners('bug-created');
emitter.once('bug-created', callback); // or use once instead of on
```

---

## 🎨 Frontend Debugging Exercises

### Exercise 6: Infinite Loop in useEffect

**Location**: `frontend/src/App.js`

**Original Code**:
```javascript
useEffect(() => {
  fetchBugs();
}, [filter]);
```

**Introduce Bug**:
```javascript
useEffect(() => {
  fetchBugs();
  // Missing dependency array causes infinite loop
});
```

**Expected Issue**: Infinite re-renders, page freezes

**Debugging Steps**:
1. Open React DevTools > Profiler
2. Check browser console for warnings
3. Add console.log to see how many times it runs
4. Check Network tab for repeated requests

---

### Exercise 7: State Mutation

**Location**: `frontend/src/components/BugList.js` (in parent App.js)

**Original Code**:
```javascript
setBugs(prevBugs => [response.data, ...prevBugs]);
```

**Introduce Bug** (Mutating state directly):
```javascript
bugs.unshift(response.data); // Mutates original array
setBugs(bugs); // React won't detect change
```

**Expected Issue**: UI doesn't update

**Debugging Steps**:
1. Use React DevTools to check state
2. Add console.log to verify state changes
3. Check if component re-renders with React DevTools Profiler
4. Compare object references: `console.log(bugs === prevBugs)`

---

### Exercise 8: Missing Error Handling in Promise

**Location**: `frontend/src/App.js`

**Original Code**:
```javascript
const handleDeleteBug = async (id) => {
  try {
    await deleteBug(id);
    setBugs(prevBugs => prevBugs.filter(bug => bug.id !== id));
  } catch (err) {
    console.error('Error:', err);
    alert('Failed to delete');
  }
};
```

**Introduce Bug**:
```javascript
const handleDeleteBug = (id) => {
  deleteBug(id); // No await, no catch
  setBugs(prevBugs => prevBugs.filter(bug => bug.id !== id));
};
```

**Expected Issue**: UI updates before server confirms, inconsistent state if delete fails

**Debugging Steps**:
1. Open Network tab, simulate server error
2. Check if UI and backend are in sync
3. Add console.logs to track execution order

---

### Exercise 9: Incorrect Dependency in useCallback

**Location**: Create in `frontend/src/App.js`

**Introduce Bug**:
```javascript
const handleFilterChange = useCallback((e) => {
  const { name, value } = e.target;
  setFilter(prev => ({
    ...prev,
    [name]: value
  }));
}, []); // Missing setFilter dependency
```

**Expected Issue**: Stale closure, might reference old filter values

**Debugging Steps**:
1. React DevTools will show warning
2. Add console.log inside callback to check captured values
3. Test rapid filter changes

---

### Exercise 10: XSS Vulnerability

**Location**: `frontend/src/components/BugItem.js`

**Original Code**:
```javascript
<p>{bug.description}</p>
```

**Introduce Bug**:
```javascript
<p dangerouslySetInnerHTML={{ __html: bug.description }} />
```

**Expected Issue**: If backend doesn't sanitize, XSS possible

**Debugging Steps**:
1. Try submitting: `<script>alert('XSS')</script>` as description
2. Check if script executes
3. Inspect DOM in DevTools
4. Review backend sanitization in validators.js

---

## 🔧 General Debugging Techniques to Practice

### 1. Using Chrome DevTools

```javascript
// Set strategic breakpoints
debugger; // Pauses execution

// Conditional breakpoints
if (bug.priority === 'critical') {
  debugger;
}

// Log objects properly
console.log('Bug:', JSON.stringify(bug, null, 2));
console.table(bugs); // For arrays
```

### 2. Network Request Debugging

```javascript
// In bugService.js
apiClient.interceptors.request.use(config => {
  console.group('API Request');
  console.log('URL:', config.url);
  console.log('Method:', config.method);
  console.log('Data:', config.data);
  console.groupEnd();
  return config;
});
```

### 3. Performance Debugging

```javascript
// Measure function execution time
console.time('fetchBugs');
await fetchBugs();
console.timeEnd('fetchBugs');

// Check render performance
const startTime = performance.now();
// ... component render
console.log(`Render took ${performance.now() - startTime}ms`);
```

### 4. Memory Leak Detection

```javascript
// Monitor memory usage
setInterval(() => {
  const used = process.memoryUsage();
  console.log('Memory:', {
    rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`
  });
}, 5000);
```

---

## 📝 Debugging Checklist

When you encounter a bug, follow this checklist:

### Backend
- [ ] Check server logs for errors
- [ ] Verify database connection
- [ ] Test API endpoint with Postman/curl
- [ ] Check request/response in Network tab
- [ ] Verify data validation
- [ ] Check MongoDB queries
- [ ] Review error handling middleware

### Frontend
- [ ] Check browser console for errors
- [ ] Inspect Network tab for failed requests
- [ ] Use React DevTools to check state/props
- [ ] Verify component rendering
- [ ] Check for infinite loops
- [ ] Review useEffect dependencies
- [ ] Test error boundaries

### Both
- [ ] Write a failing test
- [ ] Add strategic console.logs
- [ ] Use debugger statements
- [ ] Check for typos
- [ ] Verify async/await usage
- [ ] Review recent changes in git
- [ ] Check environment variables

---

## 🎯 Practice Exercises

### Easy Level
1. Fix the missing await bug (Exercise 1)
2. Fix the status validation typo (Exercise 2)
3. Add proper error handling (Exercise 8)

### Medium Level
4. Fix the infinite loop (Exercise 6)
5. Fix state mutation (Exercise 7)
6. Debug race condition (Exercise 3)

### Hard Level
7. Fix memory leak (Exercise 5)
8. Debug performance issues
9. Fix XSS vulnerability (Exercise 10)
10. Create and fix your own intentional bug

---

## 📚 Additional Resources

- [Chrome DevTools Documentation](https://developers.google.com/web/tools/chrome-devtools)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [MongoDB Performance Best Practices](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)

Remember: The best way to learn debugging is to practice. Try introducing these bugs one at a time and use the debugging techniques to find and fix them!
