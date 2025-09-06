// import express from "express";
// import db from "@repo/db/client";
// const app = express();

// app.use(express.json())

// app.post("/hdfcWebhook", async (req, res) => {
//     //TODO: Add zod validation here?
//     //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
//     const paymentInformation: {
//         token: string;
//         userId: string;
//         amount: string
//     } = {
//         token: req.body.token,
//         userId: req.body.user_identifier,
//         amount: req.body.amount
//     };

//     try {
//         await db.$transaction([
//             db.balance.updateMany({
//                 where: {
//                     userId: Number(paymentInformation.userId)
//                 },
//                 data: {
//                     amount: {
//                         increment: Number(paymentInformation.amount)
//                     }
//                 }
//             }),
//             db.onRampTransaction.updateMany({
//                 where: {
//                     token: paymentInformation.token
//                 }, 
//                 data: {
//                     status: "Success",
//                 }
//             })
//         ]);
//         console.log("Processed webhook for user", paymentInformation.userId);
//         res.json({
//             message: "Captured"
//         })
//     } catch(e) {
//         console.error(e);
//         res.status(411).json({
//             message: "Error while processing webhook"
//         })
//     }

// })

// app.listen(3003, () => {
//     console.log("Server is running on http://localhost:3003");
// });

import express from "express";
import db from "@repo/db/client";
import { z } from "zod";

const app = express();
app.use(express.json());

const paymentSchema = z.object({
  token: z.string(),
  user_identifier: z.coerce.number(), // auto convert
  amount: z.coerce.number(),
});

app.post("/hdfcWebhook", async (req, res) => {
    //  console.log("📥 Raw request body:", req.body);  
  const parseResult = paymentSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid request payload",
      errors: parseResult.error.message,
    });
  }

  const { token, user_identifier, amount } = parseResult.data;

  try {
    await db.$transaction(async (tx) => {
      await tx.balance.upsert({
        where: { userId: user_identifier },
        update: { amount: { increment: amount } },
        create: {
          userId: user_identifier,
          amount: amount,
          locked: 0,
        },
      });

      await tx.onRampTransaction.updateMany({
        where: { token },
        data: { status: "Success" },
      });
    });

    // console.log("✅ Processed webhook for user", user_identifier);
    return res.json({ message: "Captured" });
  } catch (e) {
    console.error("❌ Error while processing webhook:", e);
    return res.status(500).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003, () => {
  console.log("🚀 Server is running on http://localhost:3003");
});
