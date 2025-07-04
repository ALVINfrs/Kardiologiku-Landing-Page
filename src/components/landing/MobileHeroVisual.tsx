import type { ReactNode } from "react"; // <-- TAMBAHKAN BARIS INI
import { Heart, Activity, Thermometer, Droplets } from "lucide-react";
import { motion } from "framer-motion";

const StatItem = (
  { icon, label, value }: { icon: ReactNode; label: string; value: string } // <-- UBAH TIPE DARI JSX.Element ke ReactNode
) => (
  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm p-2 rounded-lg">
    <div className="p-2 bg-white/30 rounded-full">{icon}</div>
    <div>
      <p className="text-xs font-semibold text-rose-100">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  </div>
);

const MobileHeroVisual = () => {
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-red-500 to-rose-600 p-4 flex flex-col justify-between">
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="font-bold text-lg text-white">Live Monitor</h1>
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </motion.div>

      <motion.div
        className="relative flex justify-center items-center my-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", delay: 0.4 }}
      >
        <div className="absolute w-24 h-24 bg-white/20 rounded-full blur-lg"></div>
        <Heart className="h-20 w-20 text-white fill-white/30" />
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatItem
            icon={<Activity size={18} className="text-white" />}
            label="BPM"
            value="82"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatItem
            icon={<Droplets size={18} className="text-white" />}
            label="SpO2"
            value="98%"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatItem
            icon={<Thermometer size={18} className="text-white" />}
            label="Suhu"
            value="36.5°C"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatItem
            icon={<Heart size={18} className="text-white" />}
            label="Status"
            value="Stabil"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MobileHeroVisual;
