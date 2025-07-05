import { useState, useEffect, type ReactNode } from "react"; // FIX: Mengimpor ReactNode untuk tipe
import { motion, AnimatePresence } from "framer-motion";
import {
  BellRing,
  Check,
  Pill,
  Plus,
  Sunrise,
  Sunset,
  MoonStar,
  Trash2,
  X,
  AlertTriangle,
  Clock,
} from "lucide-react";

// Tipe data yang lebih kompleks
type MedicineType =
  | "Beta-Blocker"
  | "Anticoagulant"
  | "Antiarrhythmic"
  | "Vitamin"
  | "Lainnya";
interface Medicine {
  id: number;
  name: string;
  dose: string;
  stock: number;
  taken: boolean;
  type: MedicineType;
}

// Komponen untuk satu item obat (dengan dosis & stok)
const MedicineItem = ({
  medicine,
  onToggle,
  onDelete,
}: {
  medicine: Medicine;
  onToggle: () => void;
  onDelete: () => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
    className="group flex flex-col p-3 bg-white/60 dark:bg-black/20 rounded-lg gap-2"
  >
    <div className="flex items-center justify-between">
      <div
        onClick={onToggle}
        className="flex items-center gap-3 cursor-pointer flex-grow"
      >
        <Pill
          className={`h-5 w-5 transition-colors ${
            medicine.taken ? "text-green-500" : "text-gray-500"
          }`}
        />
        <div>
          <p
            className={`transition-all ${
              medicine.taken
                ? "line-through text-gray-500"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {medicine.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {medicine.dose}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        {medicine.taken && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="p-1 bg-green-500 rounded-full mr-2"
          >
            <Check className="h-4 w-4 text-white" />
          </motion.div>
        )}
        <motion.button
          onClick={onDelete}
          className="p-1 rounded-full opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
          whileTap={{ scale: 0.8 }}
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
    </div>
    <AnimatePresence>
      {medicine.stock <= 3 && !medicine.taken && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 p-1.5 rounded-md"
        >
          <AlertTriangle size={14} />
          Stok menipis! Tersisa {medicine.stock}.
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Tipe untuk props ReminderCard
interface ReminderCardProps {
  time: string;
  icon: ReactNode; // FIX: Menggunakan tipe ReactNode yang sudah diimpor
  bgColor: string;
  schedule: number;
  currentTime: number;
}

// Komponen Kartu yang bisa di-flip
const ReminderCard = ({
  time,
  icon,
  bgColor,
  schedule,
  currentTime,
}: ReminderCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newMed, setNewMed] = useState({
    name: "",
    dose: "",
    stock: 30,
    type: "Lainnya" as MedicineType,
  });
  const [reminderTime, setReminderTime] = useState(
    `${String(schedule - 1).padStart(2, "0")}:00`
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewMed({ ...newMed, [e.target.name]: e.target.value });
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMed.name.trim() !== "" && newMed.dose.trim() !== "") {
      setMedicines([
        ...medicines,
        {
          ...newMed,
          id: Date.now(),
          stock: Number(newMed.stock),
          taken: false,
        },
      ]);
      setNewMed({ name: "", dose: "", stock: 30, type: "Lainnya" });
    }
  };

  const toggleMedicine = (id: number) => {
    setMedicines(
      medicines.map((med) => {
        if (med.id === id && !med.taken) {
          return { ...med, taken: true, stock: Math.max(0, med.stock - 1) };
        } else if (med.id === id && med.taken) {
          return { ...med, taken: false, stock: med.stock + 1 };
        }
        return med;
      })
    );
  };

  const deleteMedicine = (id: number) =>
    setMedicines(medicines.filter((med) => med.id !== id));
  const remainingMedsCount = medicines.filter((m) => !m.taken).length;

  // FIX: Logika Jadwal Terlewat yang lebih cerdas
  const isMissed =
    currentTime > schedule && remainingMedsCount > 0 && medicines.length > 0;

  return (
    <div className="w-full h-[500px]" style={{ perspective: "1200px" }}>
      <AnimatePresence>
        {isMissed && !isFlipped && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg"
          >
            <AlertTriangle size={14} /> JADWAL TERLEWAT
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {/* Sisi Depan Kartu */}
        <div
          onClick={() => setIsFlipped(true)}
          className={`absolute w-full h-full p-6 rounded-2xl flex flex-col justify-center items-center gap-4 cursor-pointer shadow-xl ${bgColor}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {icon}
          <h3 className="text-4xl font-bold text-gray-800 dark:text-white">
            {time}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
            <Clock size={18} />
            <span>Jadwal: {reminderTime}</span>
          </div>
          <p className="font-semibold text-gray-600 dark:text-gray-300">
            {medicines.length === 0
              ? "Belum ada jadwal"
              : remainingMedsCount > 0
              ? `${remainingMedsCount} obat belum diminum`
              : "Semua obat sudah diminum!"}
          </p>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="mt-2 px-4 py-2 bg-black/10 dark:bg-white/10 rounded-full text-sm text-gray-700 dark:text-gray-200"
          >
            Ketuk untuk kelola
          </motion.div>
        </div>

        {/* Sisi Belakang Kartu */}
        <div
          className={`absolute w-full h-full p-6 rounded-2xl flex flex-col shadow-xl ${bgColor}`}
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-gray-800 dark:text-white">
              Kelola Obat {time}
            </h4>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-1"
              onClick={() => setIsFlipped(false)}
            >
              <X className="text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <label
              htmlFor={`time-${time}`}
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Jam Minum:
            </label>
            <input
              type="time"
              id={`time-${time}`}
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="bg-white/70 dark:bg-black/30 p-1 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {medicines.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-300 h-full flex flex-col justify-center items-center">
                <Pill size={40} className="mb-4" />
                <p>Belum ada obat.</p>
              </div>
            ) : (
              <AnimatePresence>
                {medicines.map((med) => (
                  <MedicineItem
                    key={med.id}
                    medicine={med}
                    onToggle={() => toggleMedicine(med.id)}
                    onDelete={() => deleteMedicine(med.id)}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          <form
            onSubmit={handleAddMedicine}
            className="flex flex-col gap-2 mt-4"
          >
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="name"
                value={newMed.name}
                onChange={handleInputChange}
                placeholder="Nama obat..."
                className="w-full bg-white/70 dark:bg-black/30 p-2 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
              />
              <input
                type="text"
                name="dose"
                value={newMed.dose}
                onChange={handleInputChange}
                placeholder="Dosis (cth: 50mg)"
                className="w-full bg-white/70 dark:bg-black/30 p-2 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="stock"
                value={newMed.stock}
                onChange={handleInputChange}
                placeholder="Stok"
                className="w-full bg-white/70 dark:bg-black/30 p-2 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
              />
              <select
                name="type"
                value={newMed.type}
                onChange={handleInputChange}
                className="bg-white/70 dark:bg-black/30 p-2 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
              >
                {[
                  "Beta-Blocker",
                  "Anticoagulant",
                  "Antiarrhythmic",
                  "Vitamin",
                  "Lainnya",
                ].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
            >
              <Plus size={16} /> Tambah Obat
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Komponen Utama Section
const PengingatObatSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date().getHours());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const reminderConfig = [
    {
      time: "Pagi",
      icon: <Sunrise className="h-8 w-8 text-yellow-500" />,
      bgColor:
        "from-yellow-100 to-amber-200 dark:from-yellow-900/50 dark:to-amber-800/50",
      schedule: 11,
    },
    {
      time: "Siang",
      icon: <Sunset className="h-8 w-8 text-orange-500" />,
      bgColor:
        "from-orange-100 to-red-200 dark:from-orange-900/50 dark:to-red-800/50",
      schedule: 17,
    },
    {
      time: "Malam",
      icon: <MoonStar className="h-8 w-8 text-indigo-500" />,
      bgColor:
        "from-indigo-100 to-purple-200 dark:from-indigo-900/50 dark:to-purple-800/50",
      schedule: 23,
    },
  ];
  return (
    <section
      id="pengingat-obat"
      className="py-24 sm:py-32 bg-gray-50 dark:bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <BellRing className="h-12 w-12 mx-auto text-red-600 mb-4" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Pengingat Cerdas, Hidup Tenang
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Kelola jadwal, dosis, dan stok obat Anda. Sistem akan memberi tahu
            jika ada jadwal yang terlewat.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reminderConfig.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ReminderCard {...item} currentTime={currentTime} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PengingatObatSection;
