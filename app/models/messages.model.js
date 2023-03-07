const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    message: String,
    status: Boolean
  })
);

module.exports = Message;