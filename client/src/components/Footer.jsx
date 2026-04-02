import { motion } from "framer-motion";
import { BsGithub, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

const socials = [
  { href: "https://www.linkedin.com/in/jeevan-joji-25b799275/", icon: BsLinkedin, label: "LinkedIn" },
  { href: "https://github.com/jeevan-aj", icon: BsGithub, label: "GitHub" },
  { href: "#", icon: BsInstagram, label: "Instagram" },
  { href: "#", icon: BsTwitter, label: "Twitter" },
];

const Footers = () => {
  return (
    <footer className="mx-auto mt-24 w-[95%] max-w-7xl pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-white/20 bg-slate-950 px-8 py-12 text-white shadow-[0_30px_90px_rgba(2,6,23,0.5)]"
      >
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold">Rent a Ride</h3>
            <p className="mt-3 text-sm text-slate-300">Premium rental experience with flexible pickups and modern comfort.</p>
          </div>
          <div>
            <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Product</h4>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>Vehicles</li><li>Enterprise</li><li>Bookings</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Company</h4>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>About</li><li>Privacy</li><li>Terms</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Social</h4>
            <div className="flex gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} aria-label={label} className="rounded-xl border border-white/20 p-3 text-slate-200 transition hover:-translate-y-1 hover:bg-white/10 hover:text-white">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-400">© {new Date().getFullYear()} Rent a Ride. All rights reserved.</div>
      </motion.div>
    </footer>
  );
};

export default Footers;
