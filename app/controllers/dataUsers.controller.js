const dataUser = require("../models/dataUser");
const users = require ("./../models/other.model");
const mainUsers = require ('../models/user.model');



// find users for admin panel
exports.getAdminUsers = async (req, res) => {
  try {
    const username = req.body.username; // get the admin name from the route parameters

    const user = await mainUsers.find({ username: { $regex: `.*${username}.*` } }) 
    .sort({ username: 1 }); 

    const filteredUser = user.filter(u => u.username !== username);

    res.json(filteredUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//find users by admin 


exports.getUsers = async (req, res) => {
  try {
    const adminData = req.body.username; // get the admin name from the route parameters

    const user = await users.find({ admin: adminData}); // query user data based on the admin name

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getAll = async (req, res)=>{
    try{
        const data = await dataUser.find()
        res.json(data);
    } 
    catch(error){
        res.status(500).json({message: error.message})
    }
};


// Add users
exports.addUser = async (req, res)=>{
  
    const USER = new dataUser({
        title:  req.body.title,
        status: req.body.status,
    });

   USER.save(USER)
   .then(
    () => {
      res.status(201).json({
        message: 'User saved successfully!'
      });
      console.log(USER)
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error,
        
      });
      console.log(error)
    })
}