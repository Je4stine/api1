const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const bodyparser = require("body-parser");

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
  const secret = "T7UtN5s43loXCvJZ";
  const key = "hHOF9R2yX8fQlCsjDcGWGIcCBrF4eaSC";
  const initiator = 'test02';
  const password = 'M&pawa#123';
  const code = "RDK4M2DGX8";
  const Paybill = 444333
  // const cert = require('./Utils/ProductionCertificate.cer');



    


  
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


  
await axios.post(
  "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl",
  {    
    "ShortCode": 4113239,
    "ResponseType":"Completed",
    "ConfirmationURL":"https://mss.mopawa.co.ke/result",
    "ValidationURL":"https://mss.mopawa.co.ke/validation"    
   
 },
   {
      headers:{
          Authorization:`Bearer ${token}`
      }
   },
  )

}

app.post('/register', generateToken )


// app.post('/confirmation', (req, res)=>{
//   const result = req.body;
//   console.log(result)
// });


app.post('/result', (req, res)=>{
  const result = req.body
  // console.log(req.body.Result.ResultParameters)
  console.log(result)
});

app.post('/validation', (req, res)=>{
  const result = req.body
  // console.log(req.body.Result.ResultParameters)
  console.log(result)
});

