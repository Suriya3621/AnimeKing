const Anime = require('../models/AnimeModels.js');

// Create a new anime
exports.createAnime = async (req, res) => {
  try {
    const { title, description, thumbnail, video } = req.body;
    const newAnime = new Anime({
      title,
      description,
      thumbnail,
      video: video || {}, // Initialize video as an empty object if not provided
    });

    const savedAnime = await newAnime.save();
    res.status(201).json({
      success: true,
      message: "Anime created successfully",
      anime: savedAnime,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error creating anime",
      details: error.message,
    });
  }
};

// Get all anime
exports.getAllAnime = async (req, res) => {
  try {
    const animeList = await Anime.find();
    res.status(200).json({
      success: true,
      data: animeList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching anime list",
      details: error.message,
    });
  }
};

// Get a single anime by ID
exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: "Anime not found",
      });
    }
    res.status(200).json({
      success: true,
      data: anime
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching anime",
      details: error.message,
    });
  }
};

// Update an anime
exports.updateAnime = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, video } = req.body;

    const anime = await Anime.findById(id);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: "Anime not found",
      });
    }

    // Update fields if provided in the request body
    if (title) anime.title = title;
    if (description) anime.description = description;
    if (thumbnail) anime.thumbnail = thumbnail;

    // Update the video field (handling seasons and episodes)
    if (video) {
      for (const season in video) {
        if (!anime.video[season]) {
          // Create a new season if it doesn't exist
          anime.video[season] = {};
        }
        // Add new episodes while avoiding duplicates
        for (const episodeKey in video[season]) {
          if (!anime.video[season][episodeKey]) {
            anime.video[season][episodeKey] = video[season][episodeKey];
          }
        }
      }
    }

    const updatedAnime = await anime.save();
    res.status(200).json({
      success: true,
      message: "Anime updated successfully",
      anime: updatedAnime,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating anime",
      details: error.message,
    });
  }
};

// Delete an anime
exports.deleteAnime = async (req, res) => {
  try {
    const deletedAnime = await Anime.findByIdAndDelete(req.params.id);
    if (!deletedAnime) {
      return res.status(404).json({
        success: false,
        message: "Anime not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Anime deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting anime",
      details: error.message,
    });
  }
};

// Add an episode by season
exports.addEpisodeBySeason = async (req, res) => {
  try {
    const { id } = req.params;
    const { season, episodes } = req.body;

    // Validate input
    if (!season || !episodes || typeof episodes !== 'object' || Object.keys(episodes).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Season and a non-empty episodes object are required",
      });
    }

    // Prepare the update object
    const update = Object.keys(episodes).reduce((acc, episodeKey) => {
      acc[`video.${season}.${episodeKey}`] = episodes[episodeKey]; // episodeUrl
      return acc;
    }, {});

    // Update the anime document in MongoDB
    const updatedAnime = await Anime.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Episodes added successfully",
      video: updatedAnime.video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error adding episodes",
      details: error.message,
    });
  }
};

// Delete an episode by season and episodeKey
exports.deleteEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const { season, episodeKey } = req.body;

    if (!season || !episodeKey) {
      return res.status(400).json({
        success: false,
        message: "Season and episodeKey are required",
      });
    }

    const anime = await Anime.findById(id);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: "Anime not found",
      });
    }

    if (!anime.video[season] || !anime.video[season][episodeKey]) {
      return res.status(404).json({
        success: false,
        message: "Episode not found in the specified season",
      });
    }

    // Delete the episode
    delete anime.video[season][episodeKey];

    // If the season becomes empty, delete the season
    if (Object.keys(anime.video[season]).length === 0) {
      delete anime.video[season];
    }

    // Save the updated anime object to the database
    const updatedAnime = await anime.save();

    res.status(200).json({
      success: true,
      message: "Episode deleted successfully",
      video: updatedAnime.video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting episode",
      details: error.message,
    });
  }
};
