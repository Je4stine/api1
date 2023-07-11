const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    image: String,
    originalName: String,
    imageUrl: String,
    alias: String,
    shopName:String,
    location: String,
    phone:String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;  
