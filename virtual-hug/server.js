const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Add CORS headers for external access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Add request timeout handling
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds timeout
  res.setTimeout(30000);
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // Cache static files for 1 day
  etag: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API route to list carousel images/videos
app.get('/api/carousel-files', (req, res) => {
  const carouselDir = path.join(__dirname, 'public', 'images', 'carousel');
  fs.readdir(carouselDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read carousel directory.' });
    }
    // Filter for image/video files only
    const allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.mov'];
    const mediaFiles = files.filter(f => allowedExt.includes(path.extname(f).toLowerCase()));
    res.json(mediaFiles);
  });
});

// Fallback to index.html for SPA-like behavior
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://192.168.120.164:${PORT}`);
  console.log(`For mobile testing, use: http://192.168.120.164:${PORT}`);
  console.log(`Health check: http://192.168.120.164:${PORT}/health`);
  console.log('\n🔥 Server is ready for external connections!');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port:`);
    console.error(`PORT=3001 node server.js`);
  } else {
    console.error('Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
