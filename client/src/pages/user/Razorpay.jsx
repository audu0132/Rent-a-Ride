import { toast } from "sonner";
import { setLatestBooking, setisPaymentDone } from "../../redux/user/LatestBookingsSlice";
import { setIsSweetAlert, setPageLoading } from "../../redux/user/userSlice";
import API_BASE_URL from "../../config/api";

// Load Razorpay script
export function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Fetch latest booking and update redux
export const fetchLatestBooking = async (user_id, dispatch) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/latestbookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch latest booking");
    }

    const data = await response.json();
    dispatch(setLatestBooking(data));
    dispatch(setisPaymentDone(true));
    return data;
  } catch (error) {
    console.error("Error fetching latest booking:", error);
    return null;
  }
};

// Razorpay payment function
export const displayRazorpay = async (orderData, navigate, dispatch) => {
  try {
    console.log("Starting Razorpay...");

    const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load.");
      return { success: false, message: "Razorpay SDK failed to load" };
    }

    const response = await fetch(`${API_BASE_URL}/api/user/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Order API Error:", errorText);
      throw new Error("Failed to create Razorpay order");
    }

    const data = await response.json();
    console.log("Order API response:", data);

    if (!data || !data.id) {
      toast.error("Server error. Order not created.");
      return { success: false, message: "Order ID not received" };
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: "Rent A Ride",
      description: "Vehicle Booking",
      order_id: data.id,

      handler: async function (response) {
        try {
          console.log("Payment Success:", response);

          toast.success("Payment successful!");

          if (orderData.user_id) {
            await fetchLatestBooking(orderData.user_id, dispatch);
          }

          dispatch(setIsSweetAlert(true));
          dispatch(setisPaymentDone(true));

          navigate("/success");
        } catch (error) {
          console.error("Post-payment error:", error);
          toast.error("Payment done, but booking update failed.");
        }
      },

      prefill: {
        name: orderData.username || "",
        email: orderData.email || "",
        contact: orderData.phoneNumber || "",
      },

      theme: {
        color: "#10b981",
      },

      modal: {
        ondismiss: function () {
          console.log("Razorpay popup closed by user");
          toast.error("Payment popup closed.");
        },
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.on("payment.failed", function (response) {
      console.error("Payment Failed:", response.error);
      toast.error(response?.error?.description || "Payment failed");
    });

    paymentObject.open();

    return { success: true };
  } catch (error) {
    console.error("Razorpay Error:", error);
    toast.error(error.message || "Something went wrong during payment");
    return { success: false, message: error.message };
  } finally {
    dispatch(setPageLoading(false));
  }
};

const Razorpay = () => {
  return <div></div>;
};

export default Razorpay;