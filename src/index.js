const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});