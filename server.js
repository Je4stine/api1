const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const bodyparser = require("body-parser");
const axios = require("axios");
const Message = require('./app/models/messages.model');
const moment = require('moment');
const path = require('path');
const crypto = require('crypto');
const { Number } = require('util');
const Cases = require ('./app/models/cases.model');
const Rev = require ( './app/models/Reversal.model');

const app = express();

var allowedOrigins = [
  'http://localhost:3030', 'http://localhost:3000','https://www.dashboard.mopawa.co.ke'];

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(cors({
//   methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
// }));

// app.use(cors({
//   origin: ["http://localhost:3030", "http://localhost:3000","https://www.dashboard.mopawa.co.ke"],

//   methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(cors());

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect("mongodb+srv://Admin:Admin1234@cluster0.m316cov.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Server running" });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require('./app/routes/messages.routes')(app);
require('./app/routes/dataUser.routes')(app);
require('./app/routes/other.routes')(app);
require('./app/routes/images.routes')(app);
require('./app/routes/case.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}


const generateToken = async (req,res)=>{
  const secret = "vgKjvHcdRVwtZ6HO";
  const key = "0VYkTdGtuKkmPdDaYqXivgHLqW6FRxpQ";
;

  const auth = new Buffer.from(`${key}:${secret}`).toString("base64");
  
  let token = await axios.get(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",{
          headers:{
              Authorization:`Basic ${auth}`
            
          }
      }
  ).then(async (response)=>{
      console.log("Token: ",response.data.access_token)
      return response.data.access_token
      
  }).catch(err=>{
      let error = {}
      if(err.response){
          error.status=err.status||400
          error.message
          error.code=err.code||""
          error.url=err.config.url||""
      }
      res.status(400).json(error)
  })


  
await axios.post(
  "https://api.safaricom.co.ke/mpesa/c2b/v2/registerurl",
  {    
    "ShortCode": 732195,
    "ResponseType":"Completed",
    "ConfirmationURL":"https://dukes.mss.africa/result",
    "ValidationURL":"https://dukes.mss.africa/validation"    
   
 },
   {
      headers:{
          Authorization:`Bearer ${token}`
      }
   },
  );

  res.status(200)

}

app.post('/register', generateToken )


// app.post('/confirmation', (req, res)=>{
//   const result = req.body;
//   console.log(result)
// });

app.post('/result', async (req, res) => {
  try {
    const result = req.body;
    const formattedDate = moment(req.body.TransTime, 'YYYYMMDDHHmmss').format('MM/DD HH:mm');
    const SMS = new Message({
      TransID: req.body.TransID,
      TransTime: formattedDate,
      MSISDN: req.body.MSISDN,
      TransAmount: req.body.TransAmount,
      FirstName: req.body.FirstName,
      BillRefNumber: req.body.BillRefNumber,
      LastName: req.body.LastName,
      status: false
    });
    console.log(result);

    await SMS.save();

    const databaseValue = await Cases.findOne({ IdNo: req.body.BillRefNumber });
   
    // await Cases.updateOne({ IdNo: req.body.BillRefNumber }, { $set: { Status: 'Paid' } });
    // await Cases.updateOne({ IdNo: req.body.BillRefNumber }, { $set: { ConfirmationCode : req.body.TransID } });
    // await Cases.updateOne({ IdNo: req.body.BillRefNumber }, { $set: { Amount: req.body.TransAmount } });
 

  if (databaseValue && databaseValue.Amount === req.body.TransAmount) {
      await Cases.updateOne({ IdNo: req.body.BillRefNumber }, { 
          $set: { 
              Status: 'Paid',
              ConfirmationCode: req.body.TransID,
              Amount: req.body.TransAmount
          } 
      });
    } else {
      await Cases.updateOne({ IdNo: req.body.BillRefNumber }, { 
        $set: { 
            Status: 'Pending',
            ConfirmationCode: req.body.TransID,
            Paid: req.body.TransAmount
        } 
    })
    }


    const paymentDetails = {
      TransID: req.body.TransID,
      TransTime: formattedDate,
      MSISDN: req.body.MSISDN,
      TransAmount: req.body.TransAmount,
      FirstName: req.body.FirstName,
      BillRefNumber: req.body.BillRefNumber,
      LastName: req.body.LastName,
      status: false
    };

    const response = await axios.post('https://www.chapcash.mopawa.co.ke/paymentDetails', paymentDetails);
    console.log(response)

      

    res.status(201).json({
      message: 'Post saved successfully!'
    });

    console.log(SMS);
  } catch (error) {
    res.status(400).json({
      error: error
    });
    console.log(error);
  }
});




app.post('/validation', (req, res)=>{
  const result = req.body
  // console.log(req.body.Result.ResultParameters)
  console.log(result)
});




// Reversal API Starts here

const generateToken2 = async (req,res)=>{
  const amountString = req.body.amount; // Example value, replace with your desired value
  const amountNumber = parseFloat(amountString);
  const formattedAmount = amountNumber.toFixed(0);



  const secret = "T7UtN5s43loXCvJZ";
  const key = "hHOF9R2yX8fQlCsjDcGWGIcCBrF4eaSC";
  const initiator = 'test02';
  const password = 'Beibei*0726';
  // const code = "REN982JKP5";
  const amount = formattedAmount;
  const code = req.body.code;
  const Paybill = 4113239
  // const cert = require('./Utils/ProductionCertificate.cer');

  const fs = require('fs');
  const path = require('path');
  const cert = fs.readFileSync(path.join(__dirname, './Utils/ProductionCertificate.cer'), 'utf8');

  // parse it 
  const publicKey = crypto.createPublicKey({
    key: cert,
    format: 'pem',
    type: 'pkcs1'
  });


  const passwordBuffer = Buffer.from(password, 'utf8');
  const encryptedPasswordBuffer = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, passwordBuffer);
  const securityCredential = encryptedPasswordBuffer.toString('base64');
  console.log(securityCredential);
  const pass = securityCredential

    


  
  // const encrypted = crypto.publicEncrypt(cert, Buffer.from(password));
  // const pass = encrypted.toString('base64');
  // console.log(pass);

  const auth = new Buffer.from(`${key}:${secret}`).toString("base64");
  
  let token = await axios.get(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",{
          headers:{
              Authorization:`Basic ${auth}`
            
          }
      }
  ).then(async (response)=>{
      console.log("Token: ",response.data.access_token)
      return response.data.access_token
      
  }).catch(err=>{
      let error = {}
      if(err.response){
          error.status=err.status||400
          error.message=err.config.data||""
          error.code=err.code||""
          error.url=err.config.url||""
      }
      res.status(400).json(error)
  })


  
  try {
    await axios.post(
      "https://api.safaricom.co.ke/mpesa/reversal/v1/request",
      {    
        "Initiator": initiator,    
        "SecurityCredential": pass,    
        "CommandID": "TransactionReversal",    
        "TransactionID": code,    
        "Amount": amount,    
        "ReceiverParty": Paybill,    
        "RecieverIdentifierType": "11",    
        "ResultURL": "http://cb45-102-215-189-220.ngrok.io/reversalResults",    
        "QueueTimeOutURL": "http://cb45-102-215-189-220.ngrok.io/reversalTimeout",
        "Remarks": "Reversed",    
        "Occasion": ""
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
    );

    // Success response
    res.status(200).json({ message: "Reversal request sent successfully." });
  } catch (error) {
    // Error response
    let errorResponse = {};
    if (error.response) {
      errorResponse.status = error.status || 400;
      errorResponse.message = error.config.data || "";
      errorResponse.code = error.code || "";
      errorResponse.url = error.config.url || "";
    }
    res.status(400).json(errorResponse);
  }

}

app.post('/reverse', generateToken2);


app.post('/reversalResults',(req, res)=>{
    const reversal = req.body
    console.log(reversal)
} );

app.post('/reversalTimeout', (req, res)=>{
    const timeout = req.body
    console.log(timeout)
})