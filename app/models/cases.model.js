const mongoose = require("mongoose");

const Cases = mongoose.model(
  "Cases",
  new mongoose.Schema({
    CaseNo: String,
    Offence: String,
    Time: String,
    Location: String,
    Phone: String,
    IdNo: String,
    CourtDate: Boolean,
    Status:String
  }, { timestamps: true }
  )
);

module.exports = Cases;