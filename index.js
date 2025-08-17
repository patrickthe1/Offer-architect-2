require('dotenv').config();

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend communication
app.use(cors({
  origin: 'http://localhost:8080', // Frontend dev server
  credentials: true
}));

app.use(express.json());

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});