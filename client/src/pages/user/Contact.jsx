import Footers from "../../components/Footer";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiXCircle } from "react-icons/fi";
import emailjs from '@emailjs/browser';

const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const hoverEffect = {
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -8, 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const form = useRef();
  const [status, setStatus] = useState("idle");

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      )
      .then(
        (result) => {
          setStatus("success");
          form.current.reset();
          setTimeout(() => setStatus("idle"), 5000);
        },
        (error) => {
          console.error(error.text);
          setStatus("error");
          setTimeout(() => setStatus("idle"), 5000);
        }
      );
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-[#0B1120] pt-28 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
        
        {/* Animated Background Gradients & Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <motion.div 
            animate={{ 
              x: [0, 80, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 dark:bg-blue-600/20 blur-[120px]"
          />
          <motion.div 
            animate={{ 
              x: [0, -60, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1] 
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-indigo-500/20 dark:bg-purple-600/20 blur-[120px]"
          />
          <motion.div 
            animate={{ 
              x: [0, 30, 0],
              y: [0, -60, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute -bottom-[10%] left-[20%] w-[50%] h-[40%] rounded-full bg-cyan-400/20 dark:bg-teal-500/20 blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="inline-flex items-center space-x-2 bg-white/60 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 mb-6 shadow-sm"
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-300">Fast Response Within 2 Hours</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 mb-6 tracking-tight">
              Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-purple-500">Conversation</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Questions about our rentals? Looking for a long-term partnership? Drop us a line and let's get you on the road smoothly.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start"
          >
            {/* Contact Information Cards (Left side) */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              {[
                {
                  icon: FiMapPin,
                  color: "blue",
                  bgColor: "bg-blue-100 dark:bg-blue-500/10",
                  iconColor: "text-blue-600 dark:text-blue-400",
                  title: "Headquarters",
                  content: <p>123 Rent-a-Ride Avenue<br />Kohinoor Mall<br />Ahilyanagar, Maharashtra 414111</p>
                },
                {
                  icon: FiPhone,
                  color: "emerald",
                  bgColor: "bg-emerald-100 dark:bg-emerald-500/10",
                  iconColor: "text-emerald-600 dark:text-emerald-400",
                  title: "Direct Phone",
                  content: <>
                    <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">Available Mon-Fri, 8am - 6pm</p>
                    <a href="tel:+1(555)000-0000" className="text-lg font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">+91 9876543210</a>
                  </>
                },
                {
                  icon: FiMail,
                  color: "purple",
                  bgColor: "bg-purple-100 dark:bg-purple-500/10",
                  iconColor: "text-purple-600 dark:text-purple-400",
                  title: "Email Support",
                  content: <>
                    <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">We respond to every single email</p>
                    <a href="mailto:support@rentaride.com" className="text-lg font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">support@rentaride.com</a>
                  </>
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  className="group relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden transition-all duration-300"
                >
                  {/* Subtle hover gradient inside card */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative flex items-start space-x-6 z-10">
                    <motion.div 
                       variants={hoverEffect}
                       className={`flex-shrink-0 ${item.bgColor} p-4 rounded-2xl shadow-inner border border-white/50 dark:border-slate-700/50`}
                    >
                      <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                      <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.content}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Form (Right Side) */}
            <motion.div 
              variants={itemVariants} 
              className="lg:col-span-7 relative h-full flex flex-col"
            >
              {/* Outer glowing border effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-b from-blue-500/30 to-purple-500/30 rounded-[2rem] z-0 opacity-50 dark:opacity-100" />
              
              <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-12 rounded-[2rem] shadow-2xl relative z-10 border border-white/60 dark:border-slate-800/80">
                <div className="mb-10">
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Drop Us a Line</h2>
                  <p className="text-slate-600 dark:text-slate-400">Fill out the form below and our team will get back to you securely.</p>
                </div>
                
                <form ref={form} className="space-y-6" onSubmit={sendEmail}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">First Name</label>
                      <input 
                        type="text" 
                        name="first_name" 
                        id="firstName" 
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300 outline-none shadow-sm hover:border-slate-300 dark:hover:border-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                        placeholder="John" 
                        required 
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">Last Name</label>
                      <input 
                        type="text" 
                        name="last_name" 
                        id="lastName" 
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300 outline-none shadow-sm hover:border-slate-300 dark:hover:border-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                        placeholder="Doe" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">Email Address</label>
                    <input 
                      type="email" 
                      name="user_email" 
                      id="email" 
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300 outline-none shadow-sm hover:border-slate-300 dark:hover:border-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                      placeholder="hello@world.com" 
                      required 
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">Your Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="5" 
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300 outline-none resize-none shadow-sm hover:border-slate-300 dark:hover:border-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                      placeholder="Tell us exactly what you need..." 
                      required
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <motion.button 
                      whileHover={{ scale: 1.015, boxShadow: "0px 15px 35px -5px rgba(59, 130, 246, 0.4)" }}
                      whileTap={{ scale: 0.985 }}
                      disabled={status === "sending"}
                      className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(59,130,246,0.6)] disabled:opacity-75 disabled:cursor-not-allowed border border-blue-500/30 relative overflow-hidden group"
                    >
                      {/* Shine effect on hover */}
                      <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                      
                      <span className="relative z-10 flex items-center space-x-2">
                         <AnimatePresence mode="wait">
                           {status === "idle" && (
                             <motion.div key="idle" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="flex items-center space-x-2">
                               <span>Send Message</span>
                               <FiSend className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                             </motion.div>
                           )}
                           {status === "sending" && (
                             <motion.div key="sending" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="flex items-center space-x-2">
                               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                               </svg>
                               <span>Sending...</span>
                             </motion.div>
                           )}
                           {status === "success" && (
                             <motion.div key="success" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="flex items-center space-x-2">
                               <span>Message Sent Successfully!</span>
                               <FiCheckCircle className="w-5 h-5" />
                             </motion.div>
                           )}
                           {status === "error" && (
                             <motion.div key="error" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="flex items-center space-x-2 text-red-100">
                               <span>Failed to Send</span>
                               <FiXCircle className="w-5 h-5" />
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
      <Footers />
    </>
  );
};

export default Contact;
