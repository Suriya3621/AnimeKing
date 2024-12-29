const express = require('express');
const router = express.Router();
const animeController = require('../controllers/AnimeControllers.js');

// Route to create a new anime
router.post('/', animeController.createAnime);

// Route to get all anime
router.get('/', animeController.getAllAnime);

// Route to get a specific anime by ID
router.get('/:id', animeController.getAnimeById);

// Route to update a specific anime by ID
router.put('/:id', animeController.updateAnime);

// Route to delete a specific anime by ID
router.delete('/:id', animeController.deleteAnime);

//Add episode by season
router.post('/:id/episode', animeController.addEpisodeBySeason);


router.delete('/:id/episode', animeController.deleteEpisode);

module.exports = router;