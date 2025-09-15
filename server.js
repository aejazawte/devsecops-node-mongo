const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection (example – update with your k8s service name if needed)
mongoose.connect('mongodb://mongo-0.mongo,mongo-1.mongo,mongo-2.mongo:27017/mydb?replicaSet=rs0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const notesRoute = require('./routes/notes');
app.use('/api/notes', notesRoute);

// Serve static frontend build
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for SPA routing (if needed)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
