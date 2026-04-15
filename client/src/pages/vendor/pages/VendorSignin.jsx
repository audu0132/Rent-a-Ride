import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../../../redux/user/userSlice";
import VendorOAuth from "../../../components/VendorAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { X, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import API_BASE_URL from "../../../config/api";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  password: z.string().min(1, { message: "Password required" }),
});

function VendorSignin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { isLoading, isError } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${API_BASE_URL}/api/vendor/vendorsignin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false || res.status >= 400) {
        dispatch(signInFailure(data));
        return;
      }
      if (data.isVendor) {
        dispatch(signInSuccess(data));
        navigate("/vendorDashboard");
      } else {
        dispatch(signInFailure({ message: "Not authorized as vendor." }));
      }
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b14] relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden shadow-emerald-500/5">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 flex justify-between items-start border-b border-slate-800/50">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Vendor <span className="text-emerald-400">Portal</span>
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Access your dashboard and manage your fleet.
              </p>
            </div>
            <Link to="/">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors group">
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 space-y-6">
            
            {/* Error Alert Box */}
            {isError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-500 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{isError.message || "Failed to log in. Please check your credentials."}</p>
              </motion.div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  id="email"
                  className="w-full bg-[#0b111a] border border-slate-800 text-slate-200 placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner"
                  placeholder="name@company.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" /> {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  id="password"
                  className="w-full bg-[#0b111a] border border-slate-800 text-slate-200 placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner"
                  placeholder="Password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" /> {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-emerald-500/20 border border-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Links */}
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <Link to="/vendorsignup" className="hover:text-emerald-400 transition-colors">
                Apply for vendor account
              </Link>
              <button type="button" className="hover:text-emerald-400 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-slate-900/60 text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <VendorOAuth />
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default VendorSignin;
