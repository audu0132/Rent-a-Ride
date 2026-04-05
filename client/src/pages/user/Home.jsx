import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setIsSweetAlert } from "../../redux/user/userSlice";

// Components
import CarSearch from "./CarSearch";
import { HeroParallax } from "../../components/ui/Paralax";
import { 
  HiArrowNarrowRight, 
  HiOutlineShieldCheck, 
  HiOutlineLightningBolt, 
  HiOutlineSparkles
} from "react-icons/hi";

const Home = () => {
  const searchRef = useRef(null);
  const { isSweetAlert } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Scroll animations for Hero
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    if (isSweetAlert) {
      Swal.fire({
        title: "Success!",
        text: "Vehicle Booked Successfully",
        icon: "success",
        background: "#0f172a",
        color: "#fff",
        showDenyButton: true,
        confirmButtonText: "Go to Home",
        confirmButtonColor: "#10b981",
        denyButtonColor: "#1e293b",
        denyButtonText: `See Orders`,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        } else if (result.isDenied) {
          navigate("/profile/orders");
        }
      });
      dispatch(setIsSweetAlert(false));
    }
  }, [isSweetAlert, dispatch, navigate]);

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="bg-slate-950 text-white selection:bg-emerald-500/30">
      {/* --- PREMIUM CINEMATIC HERO --- */}
      <section className="relative min-h-[110vh] w-full overflow-hidden flex items-center pt-20">
        {/* Background Image Layer */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          {/* Main Hero Image */}
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Car Perspective" 
            className="h-full w-full object-cover object-center brightness-[0.7]"
          />
          
          {/* Overlays for Depth & Cinema */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950/40 z-10 hidden lg:block" />
          <div className="absolute inset-0 radial-vignette z-10" style={{ 
            background: 'radial-gradient(circle, transparent 20%, rgba(2, 6, 23, 0.8) 100%)' 
          }} />
          
          {/* Background Glows */}
          <div className="absolute top-1/4 -left-20 h-[500px] w-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 -right-20 h-[500px] w-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        </motion.div>

        {/* Content Container */}
        <div className="relative z-20 w-full px-6 lg:px-24 flex flex-col items-center lg:items-start">
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md mb-6"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                  The Gold Standard of Car Rentals
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8"
              >
                Drive Your <br />
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                  Dream.
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-slate-300 max-w-xl mb-12 leading-relaxed font-medium"
              >
                Elevate your journey with our elite collection of luxury vehicles. 
                Experience unparalleled performance, style, and freedom at your fingertips.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-5 justify-center lg:justify-start"
              >
                <button 
                  onClick={scrollToSearch}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-emerald-500 px-8 py-5 font-black text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                >
                  Book Your Experience
                  <HiArrowNarrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button 
                  className="rounded-2xl border border-white/10 bg-white/5 px-8 py-5 font-bold backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/30"
                >
                  Explore Collections
                </button>
              </motion.div>
            </motion.div>

            {/* Floating Search Card */}
            <div ref={searchRef} className="w-full relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[2.2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
              <CarSearch />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 opacity-50"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-emerald-500" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-emerald-500">Scroll</span>
        </motion.div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="py-32 px-6 lg:px-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-10 md:grid-cols-3"
        >
          {[
            { 
              icon: HiOutlineShieldCheck, 
              title: "Prestige Security", 
              desc: "Every booking includes premium insurance coverage and 24/7 VIP road assistance." 
            },
            { 
              icon: HiOutlineLightningBolt, 
              title: "Seamless Access", 
              desc: "Instant digital verification. Go from mobile app to driver's seat in minutes." 
            },
            { 
              icon: HiOutlineSparkles, 
              title: "Perfect Fleet", 
              desc: "Our vehicles are detailed to perfection and undergo rigorous performance checks daily." 
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="glass-card group rounded-[2.5rem] p-12 transition-all duration-500 hover:border-emerald-500/40"
            >
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-500/10 transition-all duration-500 group-hover:bg-emerald-500 text-emerald-500 group-hover:text-slate-950 group-hover:scale-110 group-hover:rotate-6">
                <feature.icon size={32} />
              </div>
              <h3 className="mb-4 text-3xl font-bold font-heading">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- PARALLAX SHOWCASE --- */}
      <section className="bg-slate-900/10">
        <HeroParallax />
      </section>

      {/* --- START YOUR JOURNEY --- */}
      <section className="py-32 px-6 lg:px-24">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black font-heading md:text-6xl tracking-tight">Experience Excellence</h2>
          <p className="mt-6 text-slate-400 text-xl max-w-2xl mx-auto italic font-medium">Simple steps to get you behind the wheel of greatness</p>
        </div>

        <div className="grid gap-12 md:grid-cols-4">
          {[
            { step: "01", title: "Select", desc: "Browse our hand-picked elite fleet" },
            { step: "02", title: "Reserve", desc: "Choose your dates and destination" },
            { step: "03", title: "Verify", desc: "Quick identity & license check" },
            { step: "04", title: "Ignite", desc: "Start your engines and drive" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              <div className="mb-8 text-8xl font-black text-slate-900 group-hover:text-emerald-500/20 transition-all duration-700 italic select-none">
                {item.step}
              </div>
              <h4 className="mb-3 text-2xl font-bold tracking-tight">{item.title}</h4>
              <p className="text-slate-500 font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-24 px-6 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] -mr-300" />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[4rem] bg-emerald-600 px-6 py-24 text-center md:px-24"
        >
          {/* Animated decorative backgrounds */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-400 blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-slate-950 blur-[100px]" 
          />

          <h2 className="relative z-10 font-heading text-5xl font-black text-white md:text-7xl tracking-tighter leading-none mb-8">
            READY TO REDEFINE <br /> YOUR ROAD?
          </h2>
          <p className="relative z-10 mt-6 text-emerald-50/80 max-w-2xl mx-auto text-xl font-medium leading-relaxed mb-12">
            Join the elite community of Rent a Ride users. Your next adventure 
            deserves a vehicle that matches your ambition.
          </p>
          <div className="relative z-10 flex flex-wrap justify-center gap-6">
            <button className="rounded-2xl bg-slate-950 px-12 py-5 font-black text-white transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
              Get Started Now
            </button>
            <button className="rounded-2xl border-2 border-emerald-400/50 bg-transparent px-12 py-5 font-black text-white hover:bg-emerald-500 transition-all uppercase tracking-widest text-sm">
              View Fleet
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
