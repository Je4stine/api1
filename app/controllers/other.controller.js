const config = require("../config/auth.config");
const db = require("../models");
const Other = db.other;
const Role = db.role;


var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");


exports.signup = async (req, res) => {


  const user = new Other({
    username: req.body.username,
    email: req.body.email,
    password: (await bcrypt.hash(req.body.password,10)).toString(),
    admin: req.body.admin
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
 
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};



exports.signin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Hash the password that the user entered
  const hashedPassword = bcrypt.hash(password, 10).toString();

  // Find the user in the database
  Other.findOne({
    username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      // Compare the hashed passwords
      const passwordIsValid = bcrypt.compare(hashedPassword, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      // Send the JWT token to the user
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        accessToken: token
      });
    });
};