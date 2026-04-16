import { toast } from "sonner";
import {
  setLatestBooking,
  setisPaymentDone,
} from "../../redux/user/LatestBookingsSlice";
import { setIsSweetAlert, setPageLoading } from "../../redux/user/userSlice";
import API_BASE_URL from "../../config/api";

export function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// Function to fetch latest bookings from db and update it to redux
export const fetchLatestBooking = async (user_id, dispatch) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/latestbookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

// Function related to razorpay payment
export async function displayRazorpay(values, navigate, dispatch) {
  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load. Please check your internet connection.");
      return { success: false, message: "SDK failed to load" };
    }

    let refreshToken = localStorage.getItem("refreshToken");
    let accessToken = localStorage.getItem("accessToken");

    // Phase 1: Creating a new order on the backend
    const result = await fetch(`${API_BASE_URL}/api/user/razorpay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken},${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    // Handle non-OK responses (including 400, 404, 500, and CORS failures)
    if (!result.ok) {
        const errorData = await result.json().catch(() => ({}));
        const msg = errorData?.message || `Order creation failed (Status ${result.status})`;
        toast.error(msg);
        return { success: false, message: msg };
    }

    const data = await result.json();

    // Support both direct data return or data.ok success key
    if (data.ok === false) {
      toast.error(data.message || "Server rejected order creation");
      return { success: false, message: data.message };
    }

    // Phase 2: Open Razorpay Gateway
    const { amount, id, currency } = data;

    return new Promise((resolve) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Rent a Ride",
        description: "Secure Vehicle Rental Payment",
        order_id: id,
        handler: async function (response) {
          try {
            dispatch(setPageLoading(true)); // Start loading for the db sync
            const paymentData = {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            const dbData = { ...values, ...paymentData };
            const finalizeRes = await fetch(`${API_BASE_URL}/api/user/bookCar`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dbData),
            });

            const successStatus = await finalizeRes.json();
            if (successStatus) {
              dispatch(setIsSweetAlert(true));
              await fetchLatestBooking(values.user_id, dispatch);
              navigate("/");
              resolve({ success: true });
            } else {
              toast.error("Payment recorded but order finalization failed.");
              resolve({ success: false, message: "DB sync failed" });
            }
          } catch (err) {
            console.error(err);
            toast.error("Error finalizing your booking.");
            resolve({ success: false, message: "Finalization error" });
          } finally {
            dispatch(setPageLoading(false));
          }
        },
        modal: {
            ondismiss: function() {
                dispatch(setPageLoading(false));
                resolve({ success: false, message: "Payment cancelled by user" });
            }
        },
        prefill: {
          name: values.username || "User",
          email: values.email || "",
          contact: values.phoneNumber || "",
        },
        theme: {
          color: "#10b981", // Matching emerald theme
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    });

  } catch (error) {
    console.error("Razorpay Error:", error);
    const errorMsg = error.message === "Failed to fetch" ? "Network error: Backend unreachable (CORS or Server Down)" : error.message;
    toast.error(errorMsg);
    return { success: false, message: errorMsg };
  } finally {
    // Only set loading to false here if we didn't open the modal yet, 
    // or if the flow was synchronous. For the gateway, handler handles its own loading.
    dispatch(setPageLoading(false));
  }
}

const Razorpay = () => {
  return <div></div>;
};

export default Razorpay;
