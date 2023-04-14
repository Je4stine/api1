const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const bodyparser = require("body-parser");
const axios = require('axios');
const { exec } = require('child_process');
const crypto = require('crypto');


const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
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
  const secret = "SXVyOH3MQ1M7esmI";
  const key = "k1vLib6tHtMYsWiLjLaA0uYvA1dYCAE3";
    // $shortcode = '444333';
    // $consumerkey = "k1vLib6tHtMYsWiLjLaA0uYvA1dYCAE3";
    // $consumersecret = "SXVyOH3MQ1M7esmI";
  const initiator = 'peterwanglei';
  const password = 'Beibei*0316';
  // const cert = require('./Utils/ProductionCertificate.cer');

  const fs = require('fs');
  const path = require('path');
  const cert = fs.readFileSync(path.join(__dirname, './Utils/ProductionCertificate.cer'), 'utf8');


  const encrypted = crypto.publicEncrypt(cert, Buffer.from(password));
  const pass = encrypted.toString('base64');
  console.log(pass)


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

  

  
await axios.post(
  "https://api.safaricom.co.ke/mpesa/reversal/v1/request",

  {    
    "Initiator":"Mopawa",    
    "SecurityCredential": pass,    
    "CommandID":"TransactionReversal",    
    "TransactionID": "RDC2YHDRLK",    
    "Amount":"999",    
    "ReceiverParty":"444333",    
    "RecieverIdentifierType":"11",    
    "ResultURL":"https://86dc-102-215-189-220.ngrok.io/result",    
    "QueueTimeOutURL":"https://86dc-102-215-189-220.ngrok.io/timeout",    
    "Remarks":"Reversed",    
    "Occasion":"work"
 },
   {
      headers:{
          Authorization:`Bearer ${token}`
      }
   },
  )

}

app.post('/reverse', generateToken )


// app.post('/confirmation', (req, res)=>{
//   const result = req.body;
//   console.log(result)
// });


app.post('/result', (req, res)=>{
  const result = req.body
  // console.log(result)
});

app.post('/timeout', (req, res)=>{
  const result2 = req.body
  // console.log(result2)
})











//STK TRIAL1


// const generateToken1 = async (req,res)=>{
//   const secret = "t4b9K5ZI9NwIc1gE";
//   const key = "IVzNZOObywCSm8E8Xu1RpqpjPjKhSope";
//   const initiator = 'peterwanglei';
//   const password = 'Beibei*0316';
//   const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
//   // const cert = require('')

//   // const pass = new Buffer.from(`${password}+${cert}`).toString("base64");

//   const auth = new Buffer.from(`${key}:${secret}`).toString("base64");
  
//   let token = await axios.get(
//       "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",{
//           headers:{
//               Authorization:`Basic ${auth}`
            
//           }
//       }
//   ).then(async (response)=>{
//       console.log("Token: ",response.data.access_token)
//       return response.data.access_token
      
//   }).catch(err=>{
//       let error = {}
//       if(err.response){
//           error.status=err.status||400
//           error.message=err.config.data||""
//           error.code=err.code||""
//           error.url=err.config.url||""
//       }
//       res.status(400).json(error)
//   })


//   function parseDate(val) {
//     return (val < 10) ? "0" + val : val;
//     }

//     const  getTimestamp = () => {

//         const dateString  = new Date().toLocaleString("en-us", {timeZone: "Africa/Nairobi"})
//         const dateObject = new Date(dateString);
//         const month  = parseDate(dateObject.getMonth() + 1);
//         const day  = parseDate(dateObject.getDate());
//         const hour = parseDate(dateObject.getHours());
//         const minute = parseDate(dateObject.getMinutes());
//         const second = parseDate(dateObject.getSeconds());
//         return dateObject.getFullYear() + "" + month + "" + day + "" +
//             hour + "" + minute + "" + second;
//     }


// const pwd = new Buffer.from(`4086903+${passkey}+${getTimestamp}`).toString("base64")
  
//   //Get the data next
//   await axios.post(
//       "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
//       {    
//         "BusinessShortCode":"4086903",    
//         "Password": pwd,    
//         "Timestamp":getTimestamp,    
//         "TransactionType": "CustomerPayBillOnline",    
//         "Amount":"1",    
//         "PartyA":"254748737342",    
//         "PartyB":"4086903",    
//         "PhoneNumber":"254748737342",    
//         "CallBackURL":"http://mpesa.mopawa.co.ke/callback",    
//         "AccountReference":"Test",    
//         "TransactionDesc":"Test"
//        },
//        {
//           headers:{
//               Authorization:`Bearer ${token}`
//           }
//        },
//   ).then((response)=>{
//       console.log(response)
//       res.status(200).json(response);
      
//   }).catch(err=>{
//       let error = {}
//       if(err.response){
//           error.status=err.status||400
//           error.message=err.config.data||""
//           error.code=err.code||""
//           error.url=err.config.url||""
//       }
//       res.status(400).json(error)
//   })
// }

// app.post ("/stk", generateToken1);

