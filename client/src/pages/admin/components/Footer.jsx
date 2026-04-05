import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FaGithub, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt 
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { title: "Home", path: "/" },
      { title: "Vehicles", path: "/vehicles" },
      { title: "Enterprise", path: "/enterprise" },
      { title: "Contact", path: "/contact" },
    ],
    services: [
      { title: "Luxury Fleet", path: "#" },
      { title: "Airport Transfer", path: "#" },
      { title: "Corporate Rental", path: "#" },
      { title: "Wedding Cars", path: "#" },
    ],
    socials: [
      { icon: FaGithub, href: "https://github.com/jeevan-aj", color: "#f0f6fc" },
      { icon: FaLinkedinIn, href: "#", color: "#0077b5" },
      { icon: FaInstagram, href: "#", color: "#e4405f" },
      { icon: FaTwitter, href: "#", color: "#1da1f2" },
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-emerald-500/10 bg-slate-950/40 backdrop-blur-xl">
      {/* Subtle Gradient Border Accent */}
      <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Column 1: Brand & About */}
          <motion.div variants={itemVariants} className="flex flex-col space-y-6">
            <Link to="/" className="text-2xl font-bold font-heading">
              Rent<span className="text-emerald-500">a</span>Ride
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Premium car rental services for those who value luxury, 
              performance, and reliability. Experience the road like 
              never before with our curated fleet.
            </p>
            <div className="flex gap-4">
              {footerLinks.socials.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 8, color: "#10b981" }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:border-emerald-500/30 transition-all duration-300"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants} className="flex flex-col space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-500">
              Navigation
            </h4>
            <ul className="flex flex-col space-y-4">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.title}>
                  <Link 
                    to={link.path}
                    className="group relative flex w-fit items-center text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="text-sm font-medium">{link.title}</span>
                    <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Services */}
          <motion.div variants={itemVariants} className="flex flex-col space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-500">
              Our Services
            </h4>
            <ul className="flex flex-col space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.title}>
                  <Link 
                    to={link.path}
                    className="group relative flex w-fit items-center text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="text-sm font-medium">{link.title}</span>
                    <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact Info */}
          <motion.div variants={itemVariants} className="flex flex-col space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-500">
              Contact Us
            </h4>
            <ul className="flex flex-col space-y-5">
              <li className="flex items-center space-x-3 text-slate-400 group cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 group-hover:border-emerald-500/30 transition-all">
                  <FaPhoneAlt size={12} className="text-emerald-500" />
                </div>
                <span className="text-sm group-hover:text-white transition-colors">+1 (555) 000-RENT</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 group cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 group-hover:border-emerald-500/30 transition-all">
                  <FaEnvelope size={12} className="text-emerald-500" />
                </div>
                <span className="text-sm group-hover:text-white transition-colors">support@rentaride.com</span>
              </li>
              <li className="flex items-start space-x-3 text-slate-400 group cursor-pointer">
                <div className="flex h-8 w-8 mt-0.5 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 group-hover:border-emerald-500/30 transition-all">
                  <FaMapMarkerAlt size={12} className="text-emerald-500" />
                </div>
                <span className="text-sm group-hover:text-white transition-colors">
                  123 Luxury Drive<span className="block mt-1">Beverly Hills, CA 90210</span>
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col items-center justify-between border-t border-slate-800/50 pt-8 sm:flex-row"
        >
          <p className="text-xs text-slate-500">
            © {currentYear} Rent a Ride. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <Link to="#" className="text-xs text-slate-500 hover:text-emerald-500 transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-xs text-slate-500 hover:text-emerald-500 transition-colors">Terms of Service</Link>
            <Link to="#" className="text-xs text-slate-500 hover:text-emerald-500 transition-colors">Cookies Settings</Link>
          </div>
        </motion.div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/5 blur-[120px]"></div>
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/5 blur-[120px]"></div>
    </footer>
  );
};

export default Footer;
