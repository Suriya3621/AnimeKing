const express = require("express");
const {
  createAnime,
  getAllAnime,
  getAnimeById,
  updateAnime,
  deleteAnime,
  addEpisodeBySeason,
  deleteEpisode,
  searchAnime, // Import the new search function
} = require("../controllers/AnimeControllers");

const router = express.Router();

router.post("/", createAnime);
router.get("/", getAllAnime);
router.get("/:id", getAnimeById);
router.put("/:id", updateAnime);
router.delete("/:id", deleteAnime);
router.post("/:id/season", addEpisodeBySeason);
router.delete("/:id/episode", deleteEpisode);

module.exports = router;