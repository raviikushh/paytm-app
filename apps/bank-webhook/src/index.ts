import express from "express"
import db from "@repo/db/client"
const app = express();

app.post("/hdfcwebhook", async(req, res) => {
  const paymentInformation  = {
    token: req.body.token,
    userId : req.body.user_identifier,
    amount: req.body.amount,
  }

await db.balance.update({
    where:{
        userId : paymentInformation.userId
    },
    data : {
        amount:{
            increment: paymentInformation.amount
        }
    }
})

await db.onRampTransaction.update({
    where:{
        token: paymentInformation.token
    },
    data:{
        status: "SUCCESS"
    }
})

res.status(200).json({ 
    message: "captured"
});

});


app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
