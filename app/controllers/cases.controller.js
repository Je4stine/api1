const Cases = require('../models/cases.model');

exports.addCase = async(req, res)=>{
    try{

        const newCase = new Cases({
            CaseNo: req.body.CaseNo,
            Offence: req.body.Offence,
            Time: req.body.Time,
            Location: req.body.Location,
            Phone: req.body.Phone,
            IdNo: req.body.IdNo,
            CourtDate: req.body.CourtDate,
            Status:'Unpaid',
            instant: req.body.instant,
            Amount: req.body.Amount
        });

        const result = await newCase.save();
        res.status(201).json({
            message: 'Post saved successfully!',
            data: result
          });
        

    } catch(error){
        console.log(error)
        res.status(500).json({
            message: error.message || "Some error occurred while creating the case."
        })
    }
};


exports.addCourtDate = async(req, res)=>{
    const id = req.params.id;

    try{
        await Cases.findByIdAndUpdate( id, req.body,{ useFindAndModify: false })
        .then( data=>{
          if(!data){
            res.status(404).send({
              message:'Not found'
            });
          } else res.send('Item Updated!');
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            message: error.message || "Some error occurred while creating the case."
        })
    }
};


exports.getUnpaid = async(req, res)=>{
    try{
        const result = await Cases.find({Status: 'Unpaid'});
        res.status(200).json({
            message: 'Cases fetched successfully!',
            data: result
          });

    }catch(error){
        res.status(500).json({
            message: error.message || "Some error occurred while getting the case."
        })
    }
};


exports.getPaid = async(req, res)=>{
    try{
        // const result = await Cases.find({Status: 'Paid'});
        const result = await Cases.find({ Status: 'Paid', instant: { $ne: true } });
        res.status(200).json({
            message: 'Cases fetched successfully!',
            data: result
          });
          
    }catch(error){
        res.status(500).json({
            message: error.message || "Some error occurred while getting the case."
        })
    
    }
};


exports.getOperation = async (req, res)=>{
    try{
        const result = await Cases.find({
            $or: [
                { Status: 'Informed' },
                { Status: 'Unpaid' }
              ]
            
          });

          res.status(200).json({
            message: 'Cases fetched successfully!',
            data: result
          });

    }catch(error){
        res.status(500).json({
            message: error.message || "Some error occurred while getting the case."
        })
    }
};

exports.getCourtDates = async(req, res)=>{
    try{
        const result = await Cases.find({ CourtDate: { $ne: "" } });
        res.status(200).json({
             result
          });
}
    catch(error){
        res.status(500).json({
            message: error.message || "Some error occurred while getting the case."
        })
    }
};

