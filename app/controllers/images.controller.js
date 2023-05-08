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
};;


