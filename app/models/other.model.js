const mongoose = require('mongoose');

const Other = mongoose.model(
    "Other",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        roles: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Role"
            }
          ],
        admin: String,
    })
);

module.exports = Other;