/* Corrected client/src/components/VendorAuth.jsx */
import { GoogleAuthProvider, signInWithPopup, getAuth } from "@firebase/auth";
import { app } from "../firebase";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function VendorOAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVendorGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      
      // Attempt to sign in with Google Popup
      const result = await signInWithPopup(auth, provider);
      
      // If successful, send user data to your backend
      const res = await fetch("/api/vendor/vendorgoogle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/vendorDashboard");
      } else {
        // Handle backend-level errors (e.g., user not allowed as vendor)
        dispatch(signInFailure(data));
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      
      // Specifically handle the "popup-closed-by-user" error to avoid app crashes
      if (error.code === "auth/popup-closed-by-user") {
        dispatch(signInFailure({ message: "Login cancelled: popup was closed before finishing." }));
      } else {
        dispatch(signInFailure({ message: error.message || "Could not login with Google" }));
      }
    }
  };

  return (
    <div className="px-5">
      <button
        className="flex w-full gap-3 justify-center border py-3 rounded-md items-center border-black mb-4 hover:bg-slate-50 transition-all font-medium"
        type="button"
        onClick={handleVendorGoogleClick}
      >
        <span className="icon-[devicon--google]"></span>
        <span>Continue with Google</span>
      </button>
    </div>
  );
}

export default VendorOAuth;
