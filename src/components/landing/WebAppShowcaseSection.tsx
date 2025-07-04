import { motion, type Variants } from "framer-motion";
import HeroVisual from "./HeroVisual";
import MobileHeroVisual from "./MobileHeroVisual";

// --- Komponen Keyboard Detail ---
const Keyboard = () => {
  const keys = [
    [...Array(12)], // F-keys
    [...Array(13)], // Number row
    [...Array(13)], // QWERTY row
    [...Array(12)], // ASDF row
    [...Array(11)], // ZXCV row
    [...Array(1)], // Spacebar
  ];

  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[95%] p-[2%] bg-[#2a2a2d] rounded-t-lg"
      style={{ transformOrigin: "bottom", transform: "rotateX(75deg)" }}
    >
      <div className="w-full h-full space-y-[2%]">
        {/* Keyboard keys */}
        {keys.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex h-[14%] w-full justify-center items-center gap-[1%]"
          >
            {row.map((_, keyIndex) => (
              <div
                key={keyIndex}
                className="bg-[#1a1a1d] h-full rounded-[8%]"
                style={{ flexBasis: `${100 / (row.length + 1)}%` }}
              ></div>
            ))}
          </div>
        ))}
        {/* Trackpad */}
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[35%] h-[40%] bg-[#1f1f22] rounded-md"></div>
      </div>
    </div>
  );
};

// --- Komponen Mockup MacBook Pro ---
const MacbookMockup = () => (
  <div className="w-full">
    {/* Screen part */}
    <div className="relative z-10 w-full aspect-video bg-[#0c0c0c] rounded-t-xl p-1.5 sm:p-2.5 border-2 border-b-0 border-gray-600">
      <div className="w-full h-full bg-black overflow-hidden rounded-md">
        <HeroVisual />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[15%] h-4 sm:h-5 bg-[#0c0c0c] rounded-b-lg"></div>
    </div>
    {/* Base part */}
    <div
      className="relative w-[110%] -translate-x-[4.5%] h-2 sm:h-3 bg-[#4a4a4d] rounded-b-md"
      style={{ perspective: "150px" }}
    >
      <Keyboard />
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[15%] h-1 bg-black/20 rounded-t-sm"></div>
    </div>
  </div>
);

// --- Komponen Mockup iPhone 15 Pro ---
const IphoneMockup = () => (
  <div className="w-full aspect-[9/19.5] bg-gray-900 rounded-[44px] sm:rounded-[54px] p-1 border-2 border-gray-700 shadow-2xl">
    <div className="w-full h-full bg-black rounded-[40px] sm:rounded-[50px] overflow-hidden relative">
      <MobileHeroVisual />
      <div className="absolute top-[18px] left-1/2 -translate-x-1/2 h-5 w-[110px] bg-black rounded-full"></div>
    </div>
  </div>
);

// --- Komponen Utama dengan Animasi ---
const WebAppShowcaseSection = () => {
  const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.5,
      },
    },
  };

  const macbookVariant: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: -20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20, duration: 1 },
    },
  };

  const iphoneVariant: Variants = {
    hidden: { opacity: 0, y: 50, x: -30, rotateY: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  return (
    <section
      id="webapp-showcase"
      className="py-24 sm:py-32 bg-gray-50 dark:bg-[#09090b] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:text-5xl">
            Aplikasi Anda, di Mana Saja
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Akses dashboard kesehatan jantung Anda dengan mudah melalui laptop
            di rumah atau ponsel saat bepergian.
          </p>
        </motion.div>

        <motion.div
          className="relative h-[500px] sm:h-[600px] md:h-[700px] w-full"
          style={{ perspective: "2000px" }}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* MacBook Mockup */}
          <motion.div
            className="absolute w-[80%] sm:w-[75%] md:w-[70%] lg:w-[65%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            variants={macbookVariant}
          >
            <MacbookMockup />
          </motion.div>

          {/* iPhone Mockup */}
          <motion.div
            className="absolute w-[30%] sm:w-[25%] md:w-[20%] max-w-[220px] bottom-0 left-[5%] md:left-[10%]"
            variants={iphoneVariant}
          >
            <IphoneMockup />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WebAppShowcaseSection;
