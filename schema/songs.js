const mongoose = require("mongoose");

const songschema = mongoose.Schema({
    song_name: String,
    song_image: String,
    song_artist: String,
    song_link: String
})

module.exports = mongoose.model("Song", songschema)