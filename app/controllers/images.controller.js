const Images = require('../models/images.model');
const multer = require('multer');


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

    const imageUrl = req.protocol + '://' + req.get('host') + '/' + image; // Construct the image URL

    images.imageUrl = imageUrl; // Assign the URL to the imageUrl field
    await images.save(); // Save the updated document

    res.status(200).json({ imageUrl }); // Return the image URL in the response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving image');
  }
};


exports.getAll = async (req, res)=>{
  try{
      const data = await Images.find()
      res.json(data);
  } 
  catch(error){
      res.status(500).json({message: error.message})
  }
};


exports.getOne = async (req, res)=>{
  const theUser = req.body.username
  try{
      const data = await Images.find( {username: theUser})
      res.json(data);
  } 
  catch(error){
      res.status(500).json({message: error.message})
  }
};

