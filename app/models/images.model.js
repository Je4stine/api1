const mongoose = require("mongoose");

const Role = mongoose.model(
  "Images",
  new mongoose.Schema({
    image: String,
    username: String,
    originalName: String
  })
);

module.exports = Role;
