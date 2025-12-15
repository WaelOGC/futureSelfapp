// Dev dashboard routes (development only)

const express = require('express');
const router = express.Router();
const { renderDevDashboard, runDevAiTask, listDevTools, runDevTool } = require('../controllers/dev.controller');

// Guard: only enable in development
if (process.env.NODE_ENV !== 'production') {
  // GET /dev - serve dev dashboard
  router.get('/', renderDevDashboard);
  
  // POST /dev/run - execute AI task
  router.post('/run', runDevAiTask);
  
  // GET /dev/tools - list all available tools
  router.get('/tools', listDevTools);
  
  // POST /dev/tools/run - execute a tool
  router.post('/tools/run', runDevTool);
} else {
  // Production: return 404
  router.get('/', (req, res) => res.status(404).json({ error: 'Not found' }));
  router.post('/run', (req, res) => res.status(404).json({ error: 'Not found' }));
  router.get('/tools', (req, res) => res.status(404).json({ error: 'Not found' }));
  router.post('/tools/run', (req, res) => res.status(404).json({ error: 'Not found' }));
}

module.exports = router;
