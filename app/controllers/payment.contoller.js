const axios = require('axios');

const generateToken = async (req,res)=>{
    const secret = "Hv6P9pXWXBpshSmz";
    const consumer = "5AAItrZI8QaNtgHDsuWl2AuufV81kfNJ";

    const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
    // const{phone,amount}=req.body

    //generate token first
    let token = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",{
            headers:{
                authorization:`Basic ${auth}`
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
    "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
    { 
      "ShortCode": "601426",
      "ResponseType":"Completed",
      "ConfirmationURL":" http://0e23-102-215-189-220.ngrok.io/confirmation",
     },
     {
        headers:{
            Authorization:`Bearer ${token}`
        }
     },
    )

}


app.post('/confirmation', (req, res)=>{
    const result = req.body;
    console.log(result)
});
    

























// await axios.post(
//     "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
//     {    
//       "BusinessShortCode":"174379",    
//       "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3",    
//       "Timestamp":"20160216165627",    
//       "TransactionType": "CustomerPayBillOnline",    
//       "Amount":"1",    
//       "PartyA":"254748737342",    
//       "PartyB":"174379",    
//       "PhoneNumber":"254748737342",    
//       "CallBackURL":"http://mpesa.mopawa.co.ke/callback",    
//       "AccountReference":"Test",    
//       "TransactionDesc":"Test"
//      },
//      {
//         headers:{
//             Authorization:`Bearer ${token}`
//         }
//      },
// ).then((response)=>{
//     console.log(response)
//     res.status(200).json(response);
    
// }).catch(err=>{
//     let error = {}
//     if(err.response){
//         error.status=err.status||400
//         error.message=err.config.data||""
//         error.code=err.code||""
//         error.url=err.config.url||""
//     }
//     res.status(400).json(error)
// })