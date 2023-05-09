const Images = require('../models/images.model');
const User = require('../models/user.model')
const multer = require('multer');
const path = require('path');


exports.addImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No image provided');
    }

    const image = req.file.path;
    const { username } = req.body;

    const images = new Images({
      username,
      image,
      imageUrl: '', // Initially empty
      originalName: req.file.originalname,
    });

    await images.save();

    const imageUrl = 'https' + '://' + req.get('host') + '/' + image; // Construct the image URL

    images.imageUrl = imageUrl; // Assign the URL to the imageUrl field
    await images.save(); // Save the updated document

    res.status(200).json({ imageUrl }); // Return the image URL in the response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving image');
  }
};


// exports.getAll = async (req, res)=>{
//   try{
//       const data = await Images.find()
//       res.json(data);
//   } 
//   catch(error){
//       res.status(500).json({message: error.message})
//   }
// };


// exports.getOne = async (req, res)=>{
//   const theUser = req.body.username
//   try{
//       const data = await Images.findOne( {username: theUser})
//       res.json(data);
//   } 
//   catch(error){
//       res.status(500).json({message: error.message})
//   }
// };



exports.addImageByUsername = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image provided");
    }

    const image = req.file.path;
    const { username } = req.params; // Retrieve the username from the URL params

    const user = await User.findOne({ username }); // Find the user by username

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.image = image;
    user.imageUrl = ""; // Initially empty
    user.originalName = req.file.originalname;

    await user.save();

    const imageUrl = `https://${req.get("host")}/${image}`; // Construct the image URL

    user.imageUrl = imageUrl; // Assign the URL to the imageUrl field
    await user.save(); // Save the updated document

    res.status(200).json({ imageUrl }); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving image");
  }
};



exports.getUser = async (req, res)=>{
  const theUser = req.body.username
  try{
      const data = await User.findOne( {username: theUser})
      res.json(data);
  } 
  catch(error){
      res.status(500).json({message: error.message})
  }
};