const express = require("express");
const {
  searchSuggestion,
  createAnime,
  getAllAnime,
  getAnimeById,
  updateAnime,
  deleteAnime,
  addEpisodeBySeason,
  deleteEpisode,
  searchAnime,
} = require("../controllers/AnimeControllers");

const router = express.Router();

// Place specific routes first
router.get('/search', searchAnime);

// Define other routes
router.get("/suggestion", searchSuggestion); // This should be separate and not conflict with other routes that use an ID
router.post("/", createAnime);
router.get("/", getAllAnime);
router.get("/:id", getAnimeById);
router.put("/:id", updateAnime);
router.delete("/:id", deleteAnime);
router.post("/:id/season", addEpisodeBySeason);
router.delete("/:id/episode", deleteEpisode);
module.exports = router;