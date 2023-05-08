const Images = require('../controllers/images.controller');
const multer = require('multer');

module.exports = function(app) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/'); // Specify the destination directory where files will be saved
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix); // Specify the filename for the uploaded file
        },
      });
      
      const upload = multer({ storage: storage });


    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    app.post('/api/addImage',upload.single('image'), Images.addImage);

    app.get('/api/getImages', Images.getAll);

    app.post('/api/getOne', Images.getOne);

};

 