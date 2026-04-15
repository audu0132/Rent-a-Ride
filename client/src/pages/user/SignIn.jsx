import { Link, useNavigate } from "react-router-dom";
import {
  loadingEnd,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlineLockClosed, HiArrowRight } from "react-icons/hi";
import API_BASE_URL from "../../config/api";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  password: z.string().min(1, { message: "Password is required" }),
});

function SignIn() {
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
      const res = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data?.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken)
      }

      if (data.succes === false || !res.ok) {
        dispatch(loadingEnd());
        dispatch(signInFailure(data));
        return;
      }
      
      dispatch(signInSuccess(data));
      dispatch(loadingEnd());
      
      if (data.isAdmin) {
        navigate("/adminDashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      dispatch(loadingEnd());
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 overflow-hidden">
      {/* Left: Cinematic Branding Panel (Desktop Only) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative hidden w-1/2 lg:block"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070" 
          alt="Luxury Car" 
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-20 left-20 z-20 max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-heading text-6xl font-black leading-tight text-white"
          >
            Drive <span className="text-emerald-500 underline decoration-emerald-500/30">Excellence</span> <br /> 
            Every Day.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-lg text-slate-400"
          >
            Access the world's most exclusive fleet with the touch of a button.
          </motion.p>
        </div>
      </motion.div>

      {/* Right: Premium Auth Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md p-8 sm:p-12 rounded-[2.5rem] bg-slate-900 shadow-2xl border border-white/5 backdrop-blur-xl"
        >
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white font-heading">Welcome Back</h2>
            <p className="mt-2 text-slate-500 font-medium">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="group relative flex items-center rounded-2xl border border-white/10 bg-white/5 p-4 transition-all focus-within:border-emerald-500/50 hover:border-white/20">
                <HiOutlineMail className="text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="ml-3 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-medium text-rose-500 ml-1">
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
                <Link to="/forgot-password text-[10px]" className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">
                   Forgot?
                </Link>
              </div>
              <div className="group relative flex items-center rounded-2xl border border-white/10 bg-white/5 p-4 transition-all focus-within:border-emerald-500/50 hover:border-white/20">
                <HiOutlineLockClosed className="text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="ml-3 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-medium text-rose-500 ml-1">
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>Sign In <HiArrowRight /></>
              )}
            </motion.button>

            {isError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs font-semibold text-rose-500"
              >
                {isError?.message || "Authentication failed. Please check your credentials."}
              </motion.div>
            )}
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-white/5"></span>
              <span className="relative bg-slate-900 px-4 text-xs font-bold uppercase tracking-widest text-slate-600">Or continue with</span>
            </div>
            <div className="mt-8">
              <OAuth />
            </div>
          </div>

          <p className="mt-10 text-center text-sm font-medium text-slate-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default SignIn;
