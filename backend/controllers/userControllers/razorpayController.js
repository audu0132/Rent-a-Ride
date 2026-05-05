import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    console.log("✅ Razorpay route hit");
    console.log("Body:", req.body);
    console.log("User:", req.user);

    const { totalPrice } = req.body;

    if (!totalPrice || Number(totalPrice) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing totalPrice",
      });
    }

    const amount = Math.round(Number(totalPrice) * 100);

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Creating Razorpay order:", options);

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created:", order.id);

    return res.status(200).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("❌ Razorpay order error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};