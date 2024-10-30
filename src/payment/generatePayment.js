// import { sendEmail } from '../utils/RetriveEmail.js';
// import { stripe } from '../constants/keys.js';
// import PaymentSession from '../models/paymentSessions.js';


// export default async function generatePayment(req, res) {
//     const { title, description, amount, image, clientName, clientNum, clientEmail } = req.body;

//   const requiredFields = ['title', 'description', 'amount', 'image', 'clientName', 'clientEmail'];

// for (const field of requiredFields) {
//   if (!req.body[field]) {
//     return res.status(400).json({
//       success: false,
//       message: `Field '${field}' is required`
//     });
//   }
// }

//     try {
//         const customer = await stripe.customers.create({
//             name: clientName,
//             email: clientEmail,
//             phone: clientNum,
//         });


//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount,
//             currency: 'usd',
//             payment_method_types: ['card', 'cashapp'],
//             customer: customer.id,
//             metadata: { product_title: title, product_description: description, product_image: image },
//         });

//         const sessionId = paymentIntent.id;

//         const newSession = new PaymentSession({
//             sessionId: sessionId,
//             status: 'pending',
//             amount: amount / 100,
//             // productDetails: { title, description, image },
//             clientDetails: { clientName, clientNum, clientEmail },
//         });

//         const savedSession = await newSession.save()

//         // sendEmail({ customerEmail: clientEmail, customerName: clientName, message: description })
//         if (!savedSession) {
//             return res.status(500).json({ success: false, message: "Failed to save session" });
//         }


//         // const sentEmail = await sendEmail({ customerEmail: clientEmail, customerName: clientName, message: description, sessionId: savedSession._doc.sessionId, logo: image })
//         //     .then(() => {
//         //         console.log("Email sent successfully");
//         //     })
//         //     .catch((error) => {
//         //         console.error("Error sending email:", error.message);
//         //         res.status(500).json({ success: false, message: "Failed to send email" });
//         //     });

//         let response = {}

//         response.emailSent = true;
//         response.data = savedSession;
//         // response.emailgaya = sentEmail?.message || "Ruko ajayega";

//         return res.status(200).json({ success: true, status: 200, data: response });

//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// };


import { sendEmail } from '../utils/RetriveEmail.js';
import { stripe } from '../constants/keys.js';
import PaymentSession from '../models/paymentSessions.js';


export default async function generatePayment(req, res) {
    const { title, description, amount, image, clientName, clientNum, clientEmail } = req.body;

  const requiredFields = ['title', 'description', 'amount', 'image', 'clientName', 'clientEmail'];

for (const field of requiredFields) {
  if (!req.body[field]) {
    return res.status(400).json({
      success: false,
      message: `Field '${field}' is required`
    });
  }
}

    try {
        const customer = await stripe.customers.create({
            name: clientName,
            email: clientEmail,
            phone: clientNum,
        });


        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card', 'cashapp'],
            customer: customer.id,
            metadata: { product_title: title, product_description: description, product_image: image },
        });

        const sessionId = paymentIntent.id;

        const newSession = new PaymentSession({
            sessionId: sessionId,
            status: 'pending',
            amount: amount / 100,
            productDetails: { title, description, image },
            clientDetails: { clientName, clientNum, clientEmail },
        });

        const savedSession = await newSession.save()

        sendEmail({ customerEmail: clientEmail, customerName: clientName, message: description })
        if (!savedSession) {
            return res.status(500).json({ success: false, message: "Failed to save session" });
        }


        const sentEmail = await sendEmail({ customerEmail: clientEmail, customerName: clientName, message: description, sessionId: savedSession._doc.sessionId, logo: image })
            .then(() => {
                console.log("Email sent successfully");
            })
            .catch((error) => {
                console.error("Error sending email:", error.message);
                res.status(500).json({ success: false, message: "Failed to send email" });
            });

        let response = {}

        response.emailSent = sendEmail;
        response.data = savedSession;
        // response.emailgaya = sentEmail?.message || "Ruko ajayega";

        return res.status(200).json({ success: true, status: 200, data: response });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
