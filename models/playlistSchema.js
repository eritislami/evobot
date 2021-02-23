const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
};
const reqArray = {
  type: Array,
  required: true
};

const playlistSchema = new mongoose.Schema({
  username: String,
  userID: reqString,
  playlistName: reqString,
  playlistArray: reqArray
});

module.exports = mongoose.model("playlists", playlistSchema);
