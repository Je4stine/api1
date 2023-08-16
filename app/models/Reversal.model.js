const mongoose = require("mongoose");

const Reversal= mongoose.model(
  "Reversal",
  new mongoose.Schema({
    Status: String,
    
  }, { timestamps: true }
  )
);

module.exports = Reversal;