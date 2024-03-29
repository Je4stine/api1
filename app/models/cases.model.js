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
    CourtLocation: String,
    ConfirmationCode: String,
    Amount: String,
    Paid: String
  }, { timestamps: true }
  )
);

module.exports = Cases;