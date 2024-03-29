const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    TransID: String,
    TransTime: String,
    MSISDN: String,
    TransAmount: String,
    FirstName: String,
    BillRefNumber: String,
    status: Boolean,
    confirmedBy: String,
    LastName:String,
    reversed: Boolean
  }, { timestamps: true }
  )
);

module.exports = Message;