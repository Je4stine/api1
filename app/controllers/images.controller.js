const Images = require('../models/images.model');
const multer = require('multer');


exports.addImage = async (req, res)=>{
    try {
        if (!req.file) {
          return res.status(400).send('No image provided');
        }
    
        const image = req.file.path;
        const { username } = req.body;
    
        const images = new Images({
          username,
          image,
          originalName: req.file.originalname,
        });
    
        await images.save();
    
        res.status(200).send('Image uploaded successfully');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error saving image');
      }
};


