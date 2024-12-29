const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, // URL to the thumbnail image
      required: true,
    },
    video: {
      type: Object, // Object structure for seasons and episodes
      default: {},  // Initialize as an empty object
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Anime", animeSchema);