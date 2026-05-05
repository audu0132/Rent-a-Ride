import { toast } from "sonner";
import {
  setLatestBooking,
  setisPaymentDone,
} from "../../redux/user/LatestBookingsSlice";
import { setIsSweetAlert, setPageLoading } from "../../redux/user/userSlice";
import API_BASE_URL from "../../config/api";

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
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${API_BASE_URL}/api/user/latestbookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken || ""}`,
      },
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

    const response = await fetch(`${API_BASE_URL}/api/user/razorpay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg =
        errorData?.message || `Failed to create Razorpay order (${response.status})`;
      toast.error(msg);
      return { success: false, message: msg };
    }

    const data = await response.json();
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

            const bookRes = await fetch(`${API_BASE_URL}/api/user/bookCar`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(bookingPayload),
            });

            if (!bookRes.ok) {
              throw new Error("Payment done, but booking save failed.");
            }

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
            toast.error(error.message || "Payment done, but booking update failed.");
            resolve({ success: false, message: error.message });
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

      paymentObject.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        toast.error(response?.error?.description || "Payment failed");
        dispatch(setPageLoading(false));
        resolve({ success: false, message: "Payment failed" });
      });

      paymentObject.open();
    });
  } catch (error) {
    clearTimeout(timeoutId);

    const msg =
      error.name === "AbortError"
        ? "Backend is taking too long. Please try again."
        : error.message || "Something went wrong during payment";

    console.error("Razorpay Error:", error);
    toast.error(msg);
    return { success: false, message: msg };
  } finally {
    dispatch(setPageLoading(false));
  }
};

const Razorpay = () => null;

export default Razorpay;