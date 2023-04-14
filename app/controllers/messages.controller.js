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



exports.getUserData = async (req, res)=>{
  try{
      const data = await Message.find({ status: false})
      res.json(data);
  } 
  catch(error){
      res.status(500).json({message: error.message})
  }
};


exports.getConfirmedData = async (req, res)=>{
  try{
      const data = await Message.find({ status: true})
      res.json(data);
  } 
  catch(error){
      res.status(500).json({message: error.message})
  }
};


exports.Approve = async (req, res)=>{

  const id =req.params.id;

    try {
        await Message.findByIdAndUpdate( id, req.body,{ useFindAndModify: false })
        .then( data=>{
          if(!data){
            res.status(404).send({
              message:'Not found'
            });
          } else res.send('Item Updated!');
        })

      } catch(err) {
          console.error(err.message);
          res.send(400).send('Server Error');
      }
};


exports.addMessages = async (req, res)=>{
    const SMS = new Message({
        message:  req.body.message,
        status: req.body.status,
        confirmed: req.body.cofirmed
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