// @desc callback route Safaricom will post transaction status
// @method POST
// @route /stkPushCallback/:Order_ID
// @access public
export const stkPushCallback = async(req, res) => {
    try{

    //    order id
        const {Order_ID} = req.params

        //callback details

        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata
                 }   = req.body.Body.stkCallback

    //     get the meta data from the meta
        const meta = Object.values(await CallbackMetadata.Item)
        const PhoneNumber = meta.find(o => o.Name === 'PhoneNumber').Value.toString()
        const Amount = meta.find(o => o.Name === 'Amount').Value.toString()
        const MpesaReceiptNumber = meta.find(o => o.Name === 'MpesaReceiptNumber').Value.toString()
        const TransactionDate = meta.find(o => o.Name === 'TransactionDate').Value.toString()

        // do something with the data
        console.log("-".repeat(20)," OUTPUT IN THE CALLBACK ", "-".repeat(20))
        console.log(`
            Order_ID : ${Order_ID},
            MerchantRequestID : ${MerchantRequestID},
            CheckoutRequestID: ${CheckoutRequestID},
            ResultCode: ${ResultCode},
            ResultDesc: ${ResultDesc},
            PhoneNumber : ${PhoneNumber},
            Amount: ${Amount}, 
            MpesaReceiptNumber: ${MpesaReceiptNumber},
            TransactionDate : ${TransactionDate}
        `)

        res.json(true)

    }catch (e) {
        console.error("Error while trying to update LipaNaMpesa details from the callback",e)
        res.status(503).send({
            message:"Something went wrong with the callback",
            error : e.message
        })
    }
}