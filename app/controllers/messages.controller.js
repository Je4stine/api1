const Message = require("../models/messages.model");

exports.getAll = async (req, res)=>{
    try{
        const data = await Message.find()
        res.json(data);
    } 
    catch(error){
        res.status(500).json({message: error.message})
    }
};


exports.Approve = async (req, res)=>{
    try {
        await Message.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        });
        // Send response in here
        res.send('Item Updated!');

      } catch(err) {
          console.error(err.message);
          res.send(400).send('Server Error');
      }
};


exports.addMessages = async (req, res)=>{
    const SMS = new Message({
        message:  req.body.message,
        status: req.body.status,
    });

   SMS.save(SMS)
   .then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
      console.log(SMS)
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error,
        
      });
      console.log(error)
    })
}