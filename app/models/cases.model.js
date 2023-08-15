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
    CourtDate: String,
    Status:String,
    instant: Boolean,
    CourtLocation: String
  }, { timestamps: true }
  )
);

module.exports = Cases;