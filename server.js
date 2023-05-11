const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const bodyparser = require("body-parser");
const axios = require("axios");
const Message = require('./app/models/messages.model');
const moment = require('moment');
const path = require('path');

const app = express();

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

app.use(cors({
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
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


app.post('/result', (req, res)=>{
  const result = req.body
  const formattedDate = moment(req.body.TransTime, 'YYYYMMDDHHmmss').format('MM/DD HH:mm');
  const SMS = new Message({
    TransID: req.body.TransID,
    TransTime: formattedDate,
    MSISDN: req.body.MSISDN,
    TransAmount: req.body.TransAmount,
    FirstName: req.body.FirstName,
    BillRefNumber: req.body.BillRefNumber,
    status: false
  });
  console.log(result)

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
});



app.post('/validation', (req, res)=>{
  const result = req.body
  // console.log(req.body.Result.ResultParameters)
  console.log(result)
});

