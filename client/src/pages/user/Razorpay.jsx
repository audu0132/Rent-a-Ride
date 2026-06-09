import { toast } from "sonner";
import {
  setLatestBooking,
  setisPaymentDone,
} from "../../redux/user/LatestBookingsSlice";
import { setIsSweetAlert, setPageLoading } from "../../redux/user/userSlice";
import { API } from "../../constants";

export function loadScript(src) {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) return resolve(true);

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const fetchLatestBooking = async (user_id, dispatch) => {
  try {
    const response = await API.post("/user/latestbookings", { user_id });
    const data = response.data;
    dispatch(setLatestBooking(data));
    dispatch(setisPaymentDone(true));
    return data;
  } catch (error) {
    console.error("Error fetching latest booking:", error);
    return null;
  }
};

export const displayRazorpay = async (orderData, navigate, dispatch) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    console.log("Starting Razorpay...");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Login session expired. Please login again.");
      return { success: false, message: "Access token missing" };
    }

    const scriptLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load.");
      return { success: false, message: "Razorpay SDK failed to load" };
    }

    const response = await API.post("/user/razorpay", orderData, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = response.data;
    console.log("Order API response:", data);

    if (!data || !data.id) {
      toast.error("Server error. Order not created.");
      return { success: false, message: "Order ID not received" };
    }

    return await new Promise((resolve) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Rent A Ride",
        description: "Vehicle Booking",
        order_id: data.id,

        handler: async function (paymentResponse) {
          try {
            console.log("Payment Success:", paymentResponse);

            const bookingPayload = {
              ...orderData,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            };

            await API.post("/user/bookCar", bookingPayload);

            toast.success("Payment successful!");

            if (orderData.user_id) {
              await fetchLatestBooking(orderData.user_id, dispatch);
            }

            dispatch(setIsSweetAlert(true));
            dispatch(setisPaymentDone(true));
            navigate("/");

            resolve({ success: true, message: "Payment successful" });
          } catch (error) {
            console.error("Post-payment error:", error);
            const errorData = error.response?.data;
            const errorMsg = errorData?.message || error.message || "Payment done, but booking update failed.";
            toast.error(errorMsg);
            resolve({ success: false, message: errorMsg });
          } finally {
            dispatch(setPageLoading(false));
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
            toast.error("Payment popup closed.");
            dispatch(setPageLoading(false));
            resolve({ success: false, message: "Payment popup closed" });
          },
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (res) {
        console.error("Payment Failed:", res.error);
        toast.error(res?.error?.description || "Payment failed");
        dispatch(setPageLoading(false));
        resolve({ success: false, message: "Payment failed" });
      });

      paymentObject.open();
    });
  } catch (error) {
    clearTimeout(timeoutId);

    const errorData = error.response?.data;
    const msg =
      error.name === "AbortError"
        ? "Backend is taking too long. Please try again."
        : errorData?.message || error.message || "Something went wrong during payment";

    console.error("Razorpay Error:", error);
    toast.error(msg);
    return { success: false, message: msg };
  } finally {
    dispatch(setPageLoading(false));
  }
};

const Razorpay = () => null;

export default Razorpay;