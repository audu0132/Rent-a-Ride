import { GoogleAuthProvider, signInWithPopup, getAuth } from "@firebase/auth";
import { app } from "../firebase";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_BASE_URL from "../config/api";

function VendorOAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVendorGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch(`${API_BASE_URL}/api/vendor/vendorgoogle`, {
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
        dispatch(signInFailure(data));
      }
    } catch (error) {
      console.error("Google authentication error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        dispatch(signInFailure({ message: "Sign-in cancelled. Please keep the window open to log in." }));
      } else if (error.code === "auth/cancelled-popup-request") {
        return;
      } else {
        dispatch(signInFailure({ message: error.message || "Could not login with Google." }));
      }
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full gap-3 justify-center items-center py-3 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-200 transition-all font-medium shadow-inner"
      type="button"
      onClick={handleVendorGoogleClick}
    >
      <span className="icon-[devicon--google] text-lg"></span>
      <span className="text-sm">Google</span>
    </motion.button>
  );
}

export default VendorOAuth;
