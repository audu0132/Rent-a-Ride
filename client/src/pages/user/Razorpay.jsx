// Razorpay.jsx
import { toast } from "sonner";
import { setLatestBooking, setisPaymentDone } from "../../redux/user/LatestBookingsSlice";
import { setIsSweetAlert, setPageLoading } from "../../redux/user/userSlice";
import API_BASE_URL from "../../config/api";

export function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Function to fetch latest bookings from db and update it to redux
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

// Function related to razorpay payment
export async function displayRazorpay(values, navigate, dispatch) {
  try {
    console.log("Razorpay opening. Loading script...");
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      toast.error("Razorpay SDK failed to load. Please check your internet connection.");
      return { success: false, message: "SDK load failure" };
    }

    let refreshToken = localStorage.getItem("refreshToken");
    let accessToken = localStorage.getItem("accessToken");

    console.log("Creating new order via backend...");
    const result = await fetch(`${API_BASE_URL}/api/user/razorpay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken},${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!result.ok) {
      const errorData = await result.json().catch(() => ({}));
      const msg = errorData?.message || `Order creation failed (Status ${result.status})`;
      toast.error(msg);
      return { success: false, message: msg };
    }

    const data = await result.json();

    if (data.ok === false) {
      toast.error(data.message || "Server rejected order creation");
      return { success: false, message: data.message };
    }

    const { amount, id, currency } = data;

    // Phase 2: Start Razorpay flow
    // Wrapped entirely in logic that will properly resolve back to the CheckoutPage await scope
    return await new Promise((resolve) => {
      try {
        console.log("Initializing Razorpay constructor...");
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount?.toString(),
          currency: currency || "INR",
          name: "Rent a Ride",
          description: "Secure Vehicle Rental Payment",
          order_id: id,
          
          handler: async function (response) {
            try {
              dispatch(setPageLoading(true)); // Keep loading true during processing
              
              const paymentData = {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              };

              console.log("Payment confirmed. Finalizing order in DB...");
              const dbData = { ...values, ...paymentData };
              
              const finalizeRes = await fetch(`${API_BASE_URL}/api/user/bookCar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dbData),
              });

              const successStatus = await finalizeRes.json();
              if (successStatus) {
                dispatch(setIsSweetAlert(true));
                await fetchLatestBooking(values.user_id, dispatch);
                navigate("/");
                resolve({ success: true, message: "Order processed successfully" });
              } else {
                toast.error("Payment processed, but backend sync failed.");
                resolve({ success: false, message: "Backend finalization discrepancy" });
              }
            } catch (err) {
              console.error("Razorpay DB finalization error:", err);
              toast.error("Error finalizing your booking.");
              resolve({ success: false, message: "Sync critical failure" });
            }
          },
          modal: {
            ondismiss: function() {
              console.log("User closed the Razorpay popup.");
              toast.error("Transaction was interrupted or cancelled.");
              resolve({ success: false, message: "Transaction interrupted by user" });
            }
          },
          prefill: {
            name: values.username || "User",
            email: values.email || "",
            contact: values.phoneNumber || "",
          },
          theme: {
            color: "#10b981", 
          },
        };

        const paymentObject = new window.Razorpay(options);
        
        // Listeners for deeper failures
        paymentObject.on('payment.failed', function (response) {
            console.error("Payment Object Emitted Fail Event:", response.error);
            toast.error(response.error.description || "Gateway payment failed");
            resolve({ success: false, message: "Gateway reported failure" });
        });

        console.log("Opening Gateway Modal...");
        paymentObject.open();

      } catch (innerError) {
        console.error("Razorpay runtime logic failed to begin:", innerError);
        toast.error("Checkout layout crashed. Please try again or refresh.");
        resolve({ success: false, message: "Environment script crash" });
      }
    });

  } catch (error) {
    console.error("Razorpay Full Function Catch Block:", error);
    const errorMsg = error.message === "Failed to fetch" 
      ? "Network error: Backend unreachable (CORS or offline)" 
      : error?.message || "Unknown execution error";
    
    toast.error(errorMsg);
    return { success: false, message: errorMsg };
  }
}

const Razorpay = () => {
  return <div></div>;
};

export default Razorpay;
