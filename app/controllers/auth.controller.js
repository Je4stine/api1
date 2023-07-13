const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;


var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

exports.getUsers = async (req, res)=>{
  try{
    const admins = await User.find({'roles':'644632633b06af5ff82af5f1'});
    // 

    res.json(admins);

  }catch(error){
    console.log(error);
    res.status(401)
  }
}


exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: (await bcrypt.hash(req.body.password,10)).toString(),
    name: req.body.name,
    shopName: req.body.shopName,
    location: req.body.location,
    phone: req.body.phone,
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
      Role.findOne({ name: "admin" }, (err, role) => {
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

  User.findOne({
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

      // Compare the hashed password with the user-entered password
      const passwordIsValid = bcrypt.compareSync(password, user.password);

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
        imageUrl: user.imageUrl,
        alias: user.alias,
        accessToken: token
      });
    });
};


exports.changePassword = (req, res) => {
  const userId = req.userId; // Assuming you have middleware to extract the authenticated user ID
  const { currentPassword, newPassword } = req.body;

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    // Compare the current password with the user-entered password
    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid current password!",
      });
    }

    // Generate a new hashed password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send({ message: "Password updated successfully!" });
    });
  });
};


exports.ChangeName = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { useFindAndModify: false });

    if (!updatedUser) {
      return res.status(404).send({
        message: 'User not found'
      });
    }

    res.send('Item Updated!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



exports.changePassword = (req, res) => {
  const userId = req.body._id; // Assuming you have middleware to extract the authenticated user ID
  const { currentPassword, newPassword } = req.body;

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    // Compare the current password with the user-entered password
    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid current password!",
      });
    }

    // Generate a new hashed password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send({ message: "Password updated successfully!" });
    });
  });
};