const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const currencyRoutes = require('./currency/routes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/v1', currencyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});