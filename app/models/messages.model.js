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
    status: Boolean
  })
);

module.exports = Message;