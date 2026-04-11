"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useMediaQuery } from 'react-responsive';

const products = [
  {
    title: "",
    link: "https://userogue.com",
    thumbnail: "https://evmwheels.com/front-theme/images/Group%20316.png",
  },
  {
    title: "",
    link: "https://userogue.com",
    thumbnail: "https://img.freepik.com/premium-photo/luxury-car-rental-car-sale-social-media-instagram-post-template-design_1126722-2530.jpg",
  },
  {
    title: "",
    link: "https://userogue.com",
    thumbnail: "https://evmwheels.com/front-theme/images/Group%20316.png",
  },
  {
    title: "",
    link: "https://userogue.com",
    thumbnail: "https://evmwheels.com/front-theme/images/Group%20316.png",
  },
];

export const HeroParallax = () => {
  const firstRow = products.slice(0, 1);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
  const isMobile = useMediaQuery({ maxWidth: 500 });
  const isTablet = useMediaQuery({ minWidth: 510, maxWidth: 900 });

  const translateXReverseMobile = useTransform(scrollYProgress, [0, .3], [1000, 70]);
  const translateXTablet = useTransform(scrollYProgress, [0, .4], [1000, 300]);
  const translateXReverseDesktop = useTransform(scrollYProgress, [0, .4], [1000, 90]);

  const translateX = useSpring(
    isMobile ? translateXReverseMobile : isTablet ? translateXTablet : translateXReverseDesktop,
    springConfig
  );
 
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.150], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.350], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-800, 600]), springConfig);

  return (
    <div
      ref={ref}
      className="h-full py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
          scrollBehavior: 'smooth',
          transition: 'ease-in-out'
        }}
      >
        <motion.div className="flex flex-row-reverse mb-[200px]">
          {firstRow.map((product, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center lg:flex-row bg-slate-900/40 backdrop-blur-xl border border-white/5 max-w-full md:max-w-[800px] lg:max-w-[1300px] md:min-h-800px lg:min-h-[800px] gap-8 rounded-[3rem] py-16 px-8 md:p-24 mx-auto shadow-2xl relative overflow-hidden"
            >
              {/* Subtle Decorative Elements */}
              <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 h-96 w-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <h1 className="max-w-[250px] md:max-w-[600px] lg:max-w-[700px] text-3xl md:text-5xl lg:text-6xl font-black text-white capitalize font-heading leading-tight md:leading-normal tracking-tight text-center lg:text-left">
                  Find the perfect ride at <br/>
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">unbeatable prices.</span>
                </h1>
                <p className="mt-8 max-w-2xl text-slate-400 font-medium text-lg md:text-xl lg:text-2xl text-center lg:text-left italic">
                  Whether it's a weekend getaway or a long-term rental, we’ve got you covered with flexible plans and zero hidden fees. 
                </p>
                <div className="mt-12 flex justify-center lg:justify-start">
                   <div className="h-0.5 w-16 bg-gradient-to-r from-emerald-500 to-transparent" />
                </div>
              </div>

              <div className="mt-10 lg:mt-0 relative z-10 w-full lg:w-auto flex justify-center">
                <ProductCard
                  product={product}
                  translate={translateX}
                />
              </div>
            </div>
          ))}
        </motion.div>
        
        <motion.div className="flex h-[600px] flex-row-reverse space-x-reverse space-x-20" />
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="flex justify-between items-center max-w-7xl relative mx-auto py-20 z-20 md:py-32 px-6 w-full bg-transparent left-0 top-0 text-center lg:text-left">
      <div>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md"
        >
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Atmospheric Journey</span>
        </motion.div>

        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95]">
          The Ultimate <br /> 
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Car Rental For You
          </span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl lg:text-2xl mt-10 text-slate-300 font-medium leading-relaxed">
          We provide elite vehicles with absolute transparency. Our team of 
          professionals ensures your experience matches the standard of your ambition.
        </p>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        scale: 1.02
      }}
      key={product.title}
      className="group/product h-56 w-[60vh] md:h-[500px] md:w-[90vh] lg:w-[70vh] relative flex-shrink-0"
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl border border-white/5 transition-all group-hover/product:border-emerald-500/30">
        <img
          src={product.thumbnail}
          className="object-cover h-full w-full brightness-[0.8] group-hover/product:brightness-100 transition-all duration-700"
          alt={product.title}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute bottom-10 left-10 opacity-0 group-hover/product:opacity-100 transition-opacity">
           <h2 className="text-2xl font-black text-white lowercase tracking-tighter flex items-center gap-2">
              <span className="text-emerald-500">_</span> {product.title || "Experience Excellence"}
           </h2>
        </div>
      </div>
    </motion.div>
  );
};
