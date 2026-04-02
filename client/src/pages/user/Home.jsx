import { useRef } from "react";
import Herocar from "../../Assets/homepage_car_copy.jpeg";
import CarSearch from "./CarSearch";
import { HeroParallax } from "../../components/ui/Paralax";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsSweetAlert } from "../../redux/user/userSlice";
import Footers from "../../components/Footer";
import { motion } from "framer-motion";
import { Car, ShieldCheck, Sparkle } from "lucide-react";
import PremiumButton from "../../components/ui/PremiumButton";
import { toast } from "sonner";

const highlights = [
  { title: "Curated Fleet", text: "Modern, clean and verified vehicles with transparent pricing.", icon: Car },
  { title: "Safety First", text: "Verified vendors, support coverage and peace-of-mind protection.", icon: ShieldCheck },
  { title: "Premium UX", text: "Fast booking flow with beautiful interactions across every device.", icon: Sparkle },
];

function Home() {
  const ref = useRef(null);
  const { isSweetAlert } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isSweetAlert) {
    toast.success("Vehicle booked successfully", {
      action: {
        label: "Orders",
        onClick: () => navigate("/profile/orders"),
      },
    });
    dispatch(setIsSweetAlert(false));
  }

  return (
    <>
      <section className="mx-auto mt-8 grid w-[95%] max-w-7xl gap-10 overflow-hidden rounded-3xl border border-white/40 bg-white/65 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-2 lg:p-12">
        <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          <p className="mb-4 inline-flex w-fit rounded-full bg-slate-900/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700">Plan your trip</p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 lg:text-6xl">
            Save <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">big</span> with seamless car rentals
          </h1>
          <p className="mt-5 max-w-xl text-sm text-slate-600 md:text-base">
            Experience premium mobility with intuitive booking, transparent pricing, and beautifully designed interactions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PremiumButton onClick={() => ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })}>Book Ride</PremiumButton>
            <PremiumButton variant="secondary" className="text-slate-900" onClick={() => ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })}>Learn More</PremiumButton>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} className="relative">
          <div className="absolute -inset-8 -z-10 rounded-full bg-cyan-300/25 blur-3xl" />
          <img src={Herocar} alt="Premium rental car" className="h-full max-h-[460px] w-full rounded-2xl object-cover shadow-2xl" />
        </motion.div>
      </section>

      <section className="mx-auto mt-8 grid w-[95%] max-w-7xl gap-4 md:grid-cols-3">
        {highlights.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -5 }}
            className="rounded-2xl border border-white/50 bg-white/80 p-5 backdrop-blur-xl"
          >
            <item.icon className="h-6 w-6 text-cyan-500" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </motion.article>
        ))}
      </section>

      <div ref={ref} className="mx-auto w-[95%] max-w-7xl">
        <CarSearch />
      </div>

      <HeroParallax />
      <Footers />
    </>
  );
}

export default Home;
