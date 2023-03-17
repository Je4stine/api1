const mongoose = require("mongoose");

const DataUsers = mongoose.model(
  "dataUsers",
  new mongoose.Schema({
    status: Boolean,
    title: String
  })
);

module.exports = DataUsers;