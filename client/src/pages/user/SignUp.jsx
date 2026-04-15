import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiArrowRight } from "react-icons/hi";
import API_BASE_URL from "../../config/api";

const schema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
});

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(true);
        return;
      }

      setError(false);
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2083" 
          alt="Luxury Supercar" 
          className="h-full w-full object-cover"
        />
        <div className="absolute top-20 left-20 z-20 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8 h-20 w-20 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]"
          >
            <HiArrowRight className="text-white -rotate-45" size={40} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-heading text-6xl font-black leading-tight text-white"
          >
            Join the <br />
            <span className="text-emerald-500">Elite</span> Circle.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-lg text-slate-400 font-medium"
          >
            Sign up today and experience the future of luxury transportation.
          </motion.p>
        </div>
      </motion.div>

      {/* Right: Premium Auth Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md p-8 sm:p-12 rounded-[3rem] bg-slate-900 shadow-2xl border border-white/5 backdrop-blur-xl"
        >
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white font-heading">Get Started</h2>
            <p className="mt-2 text-slate-500 font-medium">Create your luxury account in seconds</p>
          </div>

          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-5"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Username</label>
              <div className="group relative flex items-center rounded-2xl border border-white/10 bg-white/5 p-4 transition-all focus-within:border-emerald-500/50 hover:border-white/20">
                <HiOutlineUser className="text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="JohnDoe"
                  className="ml-3 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="text-xs font-medium text-rose-500 ml-1">{errors.username.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="group relative flex items-center rounded-2xl border border-white/10 bg-white/5 p-4 transition-all focus-within:border-emerald-500/50 hover:border-white/20">
                <HiOutlineMail className="text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="ml-3 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-rose-500 ml-1">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
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
                <p className="text-xs font-medium text-rose-500 ml-1">{errors.password.message}</p>
              )}
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 mt-4 font-bold text-white shadow-lg transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>Create Account <HiArrowRight /></>
              )}
            </motion.button>

            {isError && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs font-semibold text-rose-500"
              >
                Something went wrong. Please try again.
              </motion.div>
            )}
          </motion.form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-white/5"></span>
              <span className="relative bg-slate-900 px-4 text-xs font-bold uppercase tracking-widest text-slate-600">Or sign up with</span>
            </div>
            <div className="mt-6">
              <OAuth />
            </div>
          </div>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default SignUp;
