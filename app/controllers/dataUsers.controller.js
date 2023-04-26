const dataUser = require("../models/dataUser");

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