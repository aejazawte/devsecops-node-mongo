const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const notesRouter = require('./routes/notes');


const app = express();
app.use(bodyParser.json());
app.use(cors());


const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo-0.mongo-svc.default.svc.cluster.local:27017/statefuldb';
const PORT = process.env.PORT || 3000;


// Connect with retry logic (useful in k8s when Mongo may not be ready yet)
const connectWithRetry = () => {
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => {
console.error('Mongo connection error:', err.message);
setTimeout(connectWithRetry, 3000);
});
};


connectWithRetry();


app.get('/', (req, res) => res.send('Stateful Node + MongoDB sample app. Use /api/notes'));
app.use('/api/notes', notesRouter);


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
