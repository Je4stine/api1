const mongoose = require("mongoose");

const Role = mongoose.model(
  "Images",
  new mongoose.Schema({
    url: String,
    username: String,
    originalName: String
  })
);

module.exports = Role;
