const express = require("express");
const {
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
router.post("/", createAnime);
router.get("/", getAllAnime);
router.get("/:id", getAnimeById);
router.put("/:id", updateAnime);
router.delete("/:id", deleteAnime);
router.post("/:id/season", addEpisodeBySeason);
router.delete("/:id/episode", deleteEpisode);

module.exports = router;