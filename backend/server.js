const express = require("express")
require('dotenv').config()
const app = express();
const db = require('./config/db.js')
const cors = require('cors');
const animeRoutes = require("./routes/AnimeRoutes.js")
// Middleware to handle JSON requests
app.use(express.json());
db();
app.use(cors());
app.use("/api",animeRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});