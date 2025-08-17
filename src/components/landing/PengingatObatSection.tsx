import { useState, useMemo, useEffect, type ReactNode } from "react";
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
  Calendar,
  TrendingUp,
  History,
  Settings,
  Bell,
  Moon,
  Sun,
  BarChart3,
  Shield,
  Heart,
  Activity,
  Zap,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

// Enhanced types
type MedicineType =
  | "Beta-Blocker"
  | "Anticoagulant"
  | "Antiarrhythmic"
  | "Vitamin"
  | "ACE Inhibitor"
  | "Diuretic"
  | "Statin"
  | "Lainnya";
type Priority = "High" | "Medium" | "Low";
type Frequency = "Sekali" | "2x Sehari" | "3x Sehari" | "Sesuai Kebutuhan";

interface Medicine {
  id: number;
  name: string;
  dose: string;
  stock: number;
  taken: boolean;
  type: MedicineType;
  priority: Priority;
  frequency: Frequency;
  sideEffects: string[];
  notes: string;
  expiryDate: string;
  color: string;
  createdAt: string;
  lastTaken?: string;
  totalTaken: number;
  streakDays: number;
  reminderEnabled: boolean;
}

interface MedicineHistory {
  id: number;
  medicineId: number;
  medicineName: string;
  timestamp: string;
  action: "taken" | "skipped" | "added" | "removed";
  dose: string;
  notes?: string;
}

interface Statistics {
  totalMedicines: number;
  takenToday: number;
  adherenceRate: number;
  longestStreak: number;
  missedDoses: number;
  upcomingReminders: number;
}

// Theme context
const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDark ? "dark" : "light");
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDark]);

  return { isDark, setIsDark };
};

// Advanced Medicine Item Component
const AdvancedMedicineItem = ({
  medicine,
  onToggle,
  onDelete,
  onEdit,
  showDetails,
  onShowDetails,
}: {
  medicine: Medicine;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (medicine: Medicine) => void;
  showDetails: boolean;
  onShowDetails: () => void;
}) => {
  const priorityColors = {
    High: "border-red-500 bg-red-50 dark:bg-red-900/20",
    Medium: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    Low: "border-green-500 bg-green-50 dark:bg-green-900/20",
  };

  const isExpiringSoon =
    new Date(medicine.expiryDate) <=
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
      className={`group p-4 rounded-xl border-l-4 ${
        priorityColors[medicine.priority]
      } bg-white/80 dark:bg-black/40 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-2">
        <div
          onClick={onToggle}
          className="flex items-center gap-3 cursor-pointer flex-grow"
        >
          <div
            className={`p-2 rounded-full ${
              medicine.taken ? "bg-green-500" : medicine.color
            }`}
          >
            <Pill
              className={`h-4 w-4 ${
                medicine.taken ? "text-white" : "text-white"
              }`}
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <h4
                className={`font-semibold ${
                  medicine.taken
                    ? "line-through text-gray-500"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {medicine.name}
              </h4>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  priorityColors[medicine.priority]
                } font-medium`}
              >
                {medicine.priority}
              </span>
              {medicine.reminderEnabled && (
                <Bell className="h-3 w-3 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {medicine.dose} • {medicine.frequency}
            </p>
            {medicine.streakDays > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Zap className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  {medicine.streakDays} hari berturut-turut
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onShowDetails}
            className="p-1 rounded-full opacity-0 group-hover:opacity-100 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
          >
            {showDetails ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={() => onEdit(medicine)}
            className="p-1 rounded-full opacity-0 group-hover:opacity-100 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <Settings size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded-full opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t pt-3 mt-3 space-y-2"
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-blue-500" />
                <span>Tipe: {medicine.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-green-500" />
                <span>
                  Kedaluwarsa:{" "}
                  {new Date(medicine.expiryDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-purple-500" />
                <span>Total diminum: {medicine.totalTaken}x</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3 text-yellow-500" />
                <span>Stok: {medicine.stock}</span>
              </div>
            </div>

            {medicine.notes && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
                <strong>Catatan:</strong> {medicine.notes}
              </div>
            )}

            {medicine.sideEffects.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded text-xs">
                <strong>Efek samping:</strong> {medicine.sideEffects.join(", ")}
              </div>
            )}

            {medicine.lastTaken && (
              <div className="text-xs text-gray-500">
                Terakhir diminum:{" "}
                {new Date(medicine.lastTaken).toLocaleString()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(medicine.stock <= 3 || isExpiringSoon) && !medicine.taken && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 space-y-1"
          >
            {medicine.stock <= 3 && (
              <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 p-2 rounded-md">
                <AlertTriangle size={14} />
                Stok menipis! Tersisa {medicine.stock}.
              </div>
            )}
            {isExpiringSoon && (
              <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-2 rounded-md">
                <AlertTriangle size={14} />
                Akan kedaluwarsa dalam{" "}
                {Math.ceil(
                  (new Date(medicine.expiryDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                hari!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {medicine.taken && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 p-1 bg-green-500 rounded-full"
        >
          <Check className="h-3 w-3 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

// Statistics Dashboard
const StatsDashboard = ({ statistics }: { statistics: Statistics }) => {
  const stats = [
    {
      label: "Total Obat",
      value: statistics.totalMedicines,
      icon: Pill,
      color: "text-blue-500",
    },
    {
      label: "Diminum Hari Ini",
      value: statistics.takenToday,
      icon: Check,
      color: "text-green-500",
    },
    {
      label: "Tingkat Kepatuhan",
      value: `${statistics.adherenceRate}%`,
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      label: "Streak Terpanjang",
      value: `${statistics.longestStreak} hari`,
      icon: Award,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {stat.value}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// History Component
const HistoryComponent = ({ history }: { history: MedicineHistory[] }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [filteredHistory, setFilteredHistory] = useState(history);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (filter === "all") {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(history.filter((h) => h.action === filter));
    }
  }, [history, filter]);

  const actionIcons = {
    taken: <Check className="h-4 w-4 text-green-500" />,
    skipped: <X className="h-4 w-4 text-red-500" />,
    added: <Plus className="h-4 w-4 text-blue-500" />,
    removed: <Trash2 className="h-4 w-4 text-orange-500" />,
  };

  const actionLabels = {
    taken: "Diminum",
    skipped: "Dilewati",
    added: "Ditambahkan",
    removed: "Dihapus",
  };

  return (
    <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Riwayat Aktivitas
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs bg-white/70 dark:bg-black/30 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
          >
            <option value="all">Semua</option>
            <option value="taken">Diminum</option>
            <option value="skipped">Dilewati</option>
            <option value="added">Ditambahkan</option>
            <option value="removed">Dihapus</option>
          </select>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-h-64 overflow-y-auto space-y-2"
          >
            {filteredHistory.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Tidak ada riwayat untuk filter ini
              </p>
            ) : (
              filteredHistory.slice(0, 20).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  {actionIcons[item.action]}
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {actionLabels[item.action]} - {item.medicineName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Reminder Card
const EnhancedReminderCard = ({
  time,
  icon,
  bgColor,
  schedule,
}: {
  time: string;
  icon: ReactNode;
  bgColor: string;
  schedule: number;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [showDetails, setShowDetails] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "priority" | "stock">("name");

  const medStorageKey = `kardiologiku_meds_${time}`;
  const timeStorageKey = `kardiologiku_time_${time}`;
  const historyStorageKey = `kardiologiku_history_${time}`;

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    try {
      const savedMeds = localStorage.getItem(medStorageKey);
      return savedMeds ? JSON.parse(savedMeds) : [];
    } catch (error) {
      console.error(`Failed to load medicines for ${time}`, error);
      return [];
    }
  });

  const [history, setHistory] = useState<MedicineHistory[]>(() => {
    try {
      const savedHistory = localStorage.getItem(historyStorageKey);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error(`Failed to load history for ${time}`, error);
      return [];
    }
  });

  const [reminderTime, setReminderTime] = useState(() => {
    try {
      const savedTime = localStorage.getItem(timeStorageKey);
      return savedTime || `${String(schedule - 1).padStart(2, "0")}:00`;
    } catch (error) {
      console.error(`Failed to load time for ${time}`, error);
      return `${String(schedule - 1).padStart(2, "0")}:00`;
    }
  });

  const [newMed, setNewMed] = useState({
    name: "",
    dose: "",
    stock: 30,
    type: "Lainnya" as MedicineType,
    priority: "Medium" as Priority,
    frequency: "Sekali" as Frequency,
    sideEffects: [] as string[],
    notes: "",
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    color: "bg-blue-500",
    reminderEnabled: true,
  });

  const [currentTime, setCurrentTime] = useState(new Date().getHours());

  // Save medicines to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(medStorageKey, JSON.stringify(medicines));
    } catch (error) {
      console.error("Failed to save medicines:", error);
    }
  }, [medicines, medStorageKey]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(historyStorageKey, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  }, [history, historyStorageKey]);

  // Save reminder time to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(timeStorageKey, reminderTime);
    } catch (error) {
      console.error("Failed to save time:", error);
    }
  }, [reminderTime, timeStorageKey]);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTime(new Date().getHours()),
      60000
    );
    return () => clearInterval(interval);
  }, []);

  const addToHistory = (
    medicineId: number,
    medicineName: string,
    action: MedicineHistory["action"],
    dose: string = "",
    notes: string = ""
  ) => {
    const newHistoryItem: MedicineHistory = {
      id: Date.now(),
      medicineId,
      medicineName,
      timestamp: new Date().toISOString(),
      action,
      dose,
      notes,
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setNewMed({ ...newMed, [name]: checked });
    } else {
      setNewMed({ ...newMed, [name]: value });
    }
  };

  const handleSideEffectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const effects = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setNewMed({ ...newMed, sideEffects: effects });
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMed.name.trim() !== "" && newMed.dose.trim() !== "") {
      const medicine: Medicine = {
        ...newMed,
        id: Date.now(),
        stock: Number(newMed.stock),
        taken: false,
        createdAt: new Date().toISOString(),
        totalTaken: 0,
        streakDays: 0,
      };
      setMedicines((prev) => [...prev, medicine]);
      addToHistory(medicine.id, medicine.name, "added", medicine.dose);
      setNewMed({
        name: "",
        dose: "",
        stock: 30,
        type: "Lainnya",
        priority: "Medium",
        frequency: "Sekali",
        sideEffects: [],
        notes: "",
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        color: "bg-blue-500",
        reminderEnabled: true,
      });
      setShowAddForm(false);
    }
  };

  const handleEditMedicine = (updatedMedicine: Medicine) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === updatedMedicine.id ? updatedMedicine : med))
    );
    setEditingMedicine(null);
  };

  const toggleMedicine = (id: number) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const wasTaken = med.taken;
          const newTaken = !wasTaken;
          const newStock = wasTaken
            ? med.stock + 1
            : Math.max(0, med.stock - 1);
          const newTotalTaken = wasTaken
            ? med.totalTaken - 1
            : med.totalTaken + 1;
          const newStreakDays = newTaken ? med.streakDays + 1 : 0;

          addToHistory(id, med.name, newTaken ? "taken" : "skipped", med.dose);

          return {
            ...med,
            taken: newTaken,
            stock: newStock,
            totalTaken: newTotalTaken,
            streakDays: newStreakDays,
            lastTaken: newTaken ? new Date().toISOString() : med.lastTaken,
          };
        }
        return med;
      })
    );
  };

  const deleteMedicine = (id: number) => {
    const medicine = medicines.find((m) => m.id === id);
    if (medicine) {
      addToHistory(id, medicine.name, "removed", medicine.dose);
    }
    setMedicines((prev) => prev.filter((med) => med.id !== id));
  };

  const filteredAndSortedMedicines = medicines
    .filter(
      (med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "priority": {
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "stock":
          return a.stock - b.stock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const progress =
    medicines.length > 0
      ? (medicines.filter((m) => m.taken).length / medicines.length) * 100
      : 0;
  const remainingMedsCount =
    medicines.length - medicines.filter((m) => m.taken).length;
  const isMissed =
    currentTime > schedule && remainingMedsCount > 0 && medicines.length > 0;

  const statistics: Statistics = {
    totalMedicines: medicines.length,
    takenToday: medicines.filter((m) => m.taken).length,
    adherenceRate: Math.round(progress),
    longestStreak: Math.max(...medicines.map((m) => m.streakDays), 0),
    missedDoses: medicines.filter((m) => !m.taken).length,
    upcomingReminders: medicines.filter((m) => m.reminderEnabled && !m.taken)
      .length,
  };

  return (
    <div className="w-full min-h-[600px]" style={{ perspective: "1200px" }}>
      <AnimatePresence>
        {isMissed && !isFlipped && (
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.8 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-xl border-2 border-red-300"
          >
            <AlertTriangle size={16} className="animate-pulse" />
            JADWAL TERLEWAT!
            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative w-full min-h-[600px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Front Side */}
        <motion.div
          onClick={() => setIsFlipped(true)}
          className={`absolute w-full min-h-[600px] p-8 rounded-3xl flex flex-col justify-between cursor-pointer shadow-2xl bg-gradient-to-br ${bgColor} backdrop-blur-sm border border-white/20`}
          style={{ backfaceVisibility: "hidden" }}
          whileHover={{ scale: 1.02, rotateZ: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-start justify-between">
            <motion.div
              className="p-3 bg-black/20 dark:bg-white/20 rounded-2xl backdrop-blur-sm"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              {icon}
            </motion.div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold bg-black/20 dark:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Clock size={18} />
                <span>{reminderTime}</span>
              </div>
              {medicines.filter((m) => m.reminderEnabled && !m.taken).length >
                0 && (
                <motion.div
                  className="flex items-center gap-1 bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bell size={14} />
                  <span>
                    {
                      medicines.filter((m) => m.reminderEnabled && !m.taken)
                        .length
                    }{" "}
                    pengingat
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            <motion.h3
              className="text-6xl font-black text-gray-800 dark:text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {time}
            </motion.h3>
            <motion.p
              className="font-semibold text-gray-700 dark:text-gray-300 text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {medicines.length === 0
                ? "Belum ada jadwal obat"
                : remainingMedsCount > 0
                ? `${remainingMedsCount} obat belum diminum`
                : "🎉 Semua obat sudah diminum!"}
            </motion.p>
            {medicines.length > 0 && (
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>Kepatuhan: {Math.round(progress)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>
                    Streak: {Math.max(...medicines.map((m) => m.streakDays), 0)}{" "}
                    hari
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="w-full bg-black/20 dark:bg-white/20 rounded-full h-4 backdrop-blur-sm overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full shadow-lg"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-full"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Progress Hari Ini
              </span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {Math.round(progress)}% Selesai
              </span>
            </div>
          </div>
        </motion.div>

        {/* Back Side - Enhanced Management Interface */}
        <div
          className={`absolute w-full min-h-[600px] p-6 rounded-3xl shadow-2xl bg-gradient-to-br ${bgColor} backdrop-blur-sm border border-white/20`}
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/20 dark:bg-white/20 rounded-xl backdrop-blur-sm">
                {icon}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Kelola Obat {time}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {medicines.length} obat terdaftar
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-black/20 dark:bg-white/20 rounded-xl backdrop-blur-sm hover:bg-black/30 dark:hover:bg-white/30 transition-colors"
              onClick={() => setIsFlipped(false)}
            >
              <X className="text-gray-700 dark:text-gray-300" size={20} />
            </motion.button>
          </div>

          {/* Statistics Dashboard */}
          <StatsDashboard statistics={statistics} />

          {/* Time and Controls */}
          <div className="flex items-center justify-between mb-6 p-4 bg-white/60 dark:bg-black/40 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <label
                htmlFor={`time-${time}`}
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Waktu Pengingat:
              </label>
              <input
                type="time"
                id={`time-${time}`}
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-white/70 dark:bg-black/30 p-2 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none backdrop-blur-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus size={16} />
                Tambah Obat
              </motion.button>
            </div>
          </div>

          {/* Search and Filter */}
          {medicines.length > 0 && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-white/60 dark:bg-black/40 rounded-xl backdrop-blur-sm">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari obat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/70 dark:bg-black/30 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "name" | "priority" | "stock")
                }
                className="bg-white/70 dark:bg-black/30 p-2 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
              >
                <option value="name">Urutkan: Nama</option>
                <option value="priority">Urutkan: Prioritas</option>
                <option value="stock">Urutkan: Stok</option>
              </select>
            </div>
          )}

          {/* Medicine List */}
          <div className="flex-1 min-h-[200px]">
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-white/80 dark:bg-black/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-gray-800 dark:text-white">
                    Tambah Obat Baru
                  </h5>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleAddMedicine} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="name"
                      value={newMed.name}
                      onChange={handleInputChange}
                      placeholder="Nama obat..."
                      className="w-full bg-white/70 dark:bg-black/30 p-3 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="dose"
                      value={newMed.dose}
                      onChange={handleInputChange}
                      placeholder="Dosis (cth: 50mg)"
                      className="w-full bg-white/70 dark:bg-black/30 p-3 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="number"
                      name="stock"
                      value={newMed.stock}
                      onChange={handleInputChange}
                      placeholder="Stok"
                      min="1"
                      className="w-full bg-white/70 dark:bg-black/30 p-3 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
                    />
                    <select
                      name="priority"
                      value={newMed.priority}
                      onChange={handleInputChange}
                      className="bg-white/70 dark:bg-black/30 p-3 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
                    >
                      <option value="High">Prioritas Tinggi</option>
                      <option value="Medium">Prioritas Sedang</option>
                      <option value="Low">Prioritas Rendah</option>
                    </select>
                    <select
                      name="frequency"
                      value={newMed.frequency}
                      onChange={handleInputChange}
                      className="bg-white/70 dark:bg-black/30 p-3 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
                    >
                      <option value="Sekali">Sekali</option>
                      <option value="2x Sehari">2x Sehari</option>
                      <option value="3x Sehari">3x Sehari</option>
                      <option value="Sesuai Kebutuhan">Sesuai Kebutuhan</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      name="type"
                      value={newMed.type}
                      onChange={handleInputChange}
                      className="bg-white/70 dark:bg-black/30 p-3 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
                    >
                      {[
                        "Beta-Blocker",
                        "Anticoagulant",
                        "Antiarrhythmic",
                        "Vitamin",
                        "ACE Inhibitor",
                        "Diuretic",
                        "Statin",
                        "Lainnya",
                      ].map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      name="expiryDate"
                      value={newMed.expiryDate}
                      onChange={handleInputChange}
                      className="bg-white/70 dark:bg-black/30 p-3 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Efek samping (pisahkan dengan koma)"
                      value={newMed.sideEffects.join(", ")}
                      onChange={handleSideEffectsChange}
                      className="bg-white/70 dark:bg-black/30 p-3 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
                    />
                    <select
                      name="color"
                      value={newMed.color}
                      onChange={handleInputChange}
                      className="bg-white/70 dark:bg-black/30 p-3 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none"
                    >
                      <option value="bg-blue-500">Biru</option>
                      <option value="bg-green-500">Hijau</option>
                      <option value="bg-purple-500">Ungu</option>
                      <option value="bg-red-500">Merah</option>
                      <option value="bg-yellow-500">Kuning</option>
                      <option value="bg-pink-500">Pink</option>
                    </select>
                  </div>
                  <textarea
                    name="notes"
                    value={newMed.notes}
                    onChange={handleInputChange}
                    placeholder="Catatan tambahan..."
                    rows={2}
                    className="w-full bg-white/70 dark:bg-black/30 p-3 rounded-lg border-2 border-transparent focus:border-red-500 focus:outline-none resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="reminderEnabled"
                      checked={newMed.reminderEnabled}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      Aktifkan pengingat
                    </label>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full p-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Plus size={16} />
                    Tambah Obat
                  </motion.button>
                </form>
              </motion.div>
            )}

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredAndSortedMedicines.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-300 py-12">
                  <div className="mb-4">
                    <Pill size={48} className="mx-auto opacity-50" />
                  </div>
                  <p className="text-lg font-semibold mb-2">
                    {searchTerm
                      ? "Tidak ada obat yang cocok"
                      : "Belum ada obat"}
                  </p>
                  <p className="text-sm opacity-75">
                    {searchTerm
                      ? "Coba ubah kata kunci pencarian"
                      : "Silakan tambahkan obat pertama Anda"}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredAndSortedMedicines.map((med) => (
                    <AdvancedMedicineItem
                      key={med.id}
                      medicine={med}
                      onToggle={() => toggleMedicine(med.id)}
                      onDelete={() => deleteMedicine(med.id)}
                      onEdit={setEditingMedicine}
                      showDetails={showDetails[med.id] || false}
                      onShowDetails={() =>
                        setShowDetails((prev) => ({
                          ...prev,
                          [med.id]: !prev[med.id],
                        }))
                      }
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* History Component */}
          {history.length > 0 && (
            <div className="mt-6">
              <HistoryComponent history={history} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit Medicine Modal */}
      <AnimatePresence>
        {editingMedicine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingMedicine(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Edit Obat
                </h3>
                <button
                  onClick={() => setEditingMedicine(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditMedicine(editingMedicine);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Obat
                    </label>
                    <input
                      type="text"
                      value={editingMedicine.name}
                      onChange={(e) =>
                        setEditingMedicine({
                          ...editingMedicine,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dosis
                    </label>
                    <input
                      type="text"
                      value={editingMedicine.dose}
                      onChange={(e) =>
                        setEditingMedicine({
                          ...editingMedicine,
                          dose: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stok
                    </label>
                    <input
                      type="number"
                      value={editingMedicine.stock}
                      onChange={(e) =>
                        setEditingMedicine({
                          ...editingMedicine,
                          stock: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prioritas
                    </label>
                    <select
                      value={editingMedicine.priority}
                      onChange={(e) =>
                        setEditingMedicine({
                          ...editingMedicine,
                          priority: e.target.value as Priority,
                        })
                      }
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
                    >
                      <option value="High">Prioritas Tinggi</option>
                      <option value="Medium">Prioritas Sedang</option>
                      <option value="Low">Prioritas Rendah</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frekuensi
                    </label>
                    <select
                      value={editingMedicine.frequency}
                      onChange={(e) =>
                        setEditingMedicine({
                          ...editingMedicine,
                          frequency: e.target.value as Frequency,
                        })
                      }
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
                    >
                      <option value="Sekali">Sekali</option>
                      <option value="2x Sehari">2x Sehari</option>
                      <option value="3x Sehari">3x Sehari</option>
                      <option value="Sesuai Kebutuhan">Sesuai Kebutuhan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catatan
                  </label>
                  <textarea
                    value={editingMedicine.notes}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-red-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingMedicine.reminderEnabled}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        reminderEnabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Aktifkan pengingat
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Simpan Perubahan
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setEditingMedicine(null)}
                    className="px-6 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg font-semibold transition-all"
                  >
                    Batal
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Component
const AdvancedMedicineReminderSystem = () => {
  const { isDark, setIsDark } = useTheme();
  const [globalStats, setGlobalStats] = useState<Statistics>({
    totalMedicines: 0,
    takenToday: 0,
    adherenceRate: 0,
    longestStreak: 0,
    missedDoses: 0,
    upcomingReminders: 0,
  });

  const reminderConfig = useMemo(
    () => [
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
    ],
    [] // Empty dependency array karena config statis
  );

  // Update global stats
  useEffect(() => {
    const updateGlobalStats = () => {
      let totalMedicines = 0;
      let takenToday = 0;
      let longestStreak = 0;
      let missedDoses = 0;
      let upcomingReminders = 0;

      reminderConfig.forEach((config) => {
        try {
          const savedMeds = localStorage.getItem(
            `kardiologiku_meds_${config.time}`
          );
          if (savedMeds) {
            const medicines: Medicine[] = JSON.parse(savedMeds);
            totalMedicines += medicines.length;
            takenToday += medicines.filter((m) => m.taken).length;
            longestStreak = Math.max(
              longestStreak,
              ...medicines.map((m) => m.streakDays)
            );
            missedDoses += medicines.filter((m) => !m.taken).length;
            upcomingReminders += medicines.filter(
              (m) => m.reminderEnabled && !m.taken
            ).length;
          }
        } catch (error) {
          console.error(`Error loading stats for ${config.time}:`, error);
        }
      });

      const adherenceRate =
        totalMedicines > 0
          ? Math.round((takenToday / totalMedicines) * 100)
          : 0;

      setGlobalStats({
        totalMedicines,
        takenToday,
        adherenceRate,
        longestStreak,
        missedDoses,
        upcomingReminders,
      });
    };

    updateGlobalStats();
    const interval = setInterval(updateGlobalStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [reminderConfig]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "dark" : ""
      }`}
    >
      <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Theme Toggle */}
          <div className="flex items-center justify-between mb-12">
            <motion.div
              className="text-center flex-1"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <motion.div
                  className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-2xl"
                  whileHover={{ rotate: 10, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BellRing className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-5xl font-black text-gray-900 dark:text-white bg-gradient-to-r from-red-600 to-red-800 bg-clip-text ">
                    KardioloGiku
                  </h1>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wider">
                    ADVANCED MEDICINE REMINDER SYSTEM
                  </p>
                </div>
              </div>

              <motion.h2
                className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Pengingat Cerdas, Hidup Sehat & Tenang
              </motion.h2>

              <motion.p
                className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Kelola jadwal, dosis, dan stok obat dengan teknologi canggih.
                Pantau statistik kesehatan, riwayat konsumsi, dan dapatkan
                pengingat pintar untuk gaya hidup yang lebih sehat.
              </motion.p>
            </motion.div>

            <motion.button
              onClick={() => setIsDark(!isDark)}
              className="p-4 bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.05, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDark ? (
                <Sun className="h-6 w-6 text-yellow-500" />
              ) : (
                <Moon className="h-6 w-6 text-indigo-600" />
              )}
            </motion.button>
          </div>

          {/* Global Statistics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Dashboard Statistik Global
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ringkasan aktivitas obat Anda hari ini
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                {[
                  {
                    label: "Total Obat",
                    value: globalStats.totalMedicines,
                    icon: Pill,
                    color: "from-blue-500 to-blue-600",
                    bgColor: "bg-blue-50 dark:bg-blue-900/20",
                  },
                  {
                    label: "Diminum Hari Ini",
                    value: globalStats.takenToday,
                    icon: Check,
                    color: "from-green-500 to-green-600",
                    bgColor: "bg-green-50 dark:bg-green-900/20",
                  },
                  {
                    label: "Tingkat Kepatuhan",
                    value: `${globalStats.adherenceRate}%`,
                    icon: TrendingUp,
                    color: "from-purple-500 to-purple-600",
                    bgColor: "bg-purple-50 dark:bg-purple-900/20",
                  },
                  {
                    label: "Streak Terpanjang",
                    value: `${globalStats.longestStreak}`,
                    icon: Award,
                    color: "from-yellow-500 to-yellow-600",
                    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                  },
                  {
                    label: "Belum Diminum",
                    value: globalStats.missedDoses,
                    icon: AlertTriangle,
                    color: "from-red-500 to-red-600",
                    bgColor: "bg-red-50 dark:bg-red-900/20",
                  },
                  {
                    label: "Pengingat Aktif",
                    value: globalStats.upcomingReminders,
                    icon: Bell,
                    color: "from-indigo-500 to-indigo-600",
                    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`${stat.bgColor} rounded-2xl p-6 text-center relative overflow-hidden`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}
                    ></div>
                    <motion.div
                      className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="relative z-10">
                      <motion.p
                        className="text-3xl font-black text-gray-800 dark:text-white mb-2"
                        key={stat.value}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {stat.value}
                      </motion.p>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress Ring */}
              <div className="mt-8 flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg
                    className="w-32 h-32 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-gray-300 dark:text-gray-600"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <motion.path
                      className="text-gradient"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${globalStats.adherenceRate}, 100`}
                      stroke="url(#gradient)"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{
                        strokeDasharray: `${globalStats.adherenceRate}, 100`,
                      }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        className="text-2xl font-bold text-gray-800 dark:text-white"
                        key={globalStats.adherenceRate}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        {globalStats.adherenceRate}%
                      </motion.div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        Kepatuhan
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Reminder Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {reminderConfig.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8 + index * 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                {/* Floating notification indicator */}
                <AnimatePresence>
                  {(() => {
                    try {
                      const savedMeds = localStorage.getItem(
                        `kardiologiku_meds_${item.time}`
                      );
                      const medicines = savedMeds ? JSON.parse(savedMeds) : [];
                      const hasActiveReminders =
                        medicines.filter(
                          (m: Medicine) => m.reminderEnabled && !m.taken
                        ).length > 0;

                      if (hasActiveReminders) {
                        return (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-2 -right-2 z-10"
                          >
                            <div className="relative">
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg">
                                <span className="text-xs font-bold text-white">
                                  {
                                    medicines.filter(
                                      (m: Medicine) =>
                                        m.reminderEnabled && !m.taken
                                    ).length
                                  }
                                </span>
                              </div>
                              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"></div>
                            </div>
                          </motion.div>
                        );
                      }
                    } catch (error) {
                      console.error("Error checking reminders:", error);
                    }
                    return null;
                  })()}
                </AnimatePresence>

                <EnhancedReminderCard {...item} />
              </motion.div>
            ))}
          </div>

          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-16 bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Aksi Cepat & Fitur Lanjutan
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Kelola data obat dan akses fitur tambahan dengan mudah
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Download,
                  label: "Export Data",
                  desc: "Unduh data obat",
                  color: "from-blue-500 to-blue-600",
                  action: () => {
                    type ExportedData = {
                      medicines: Medicine[];
                      history: MedicineHistory[];
                    };

                    const allData: Record<string, ExportedData> = {};

                    reminderConfig.forEach((config) => {
                      try {
                        const savedMeds = localStorage.getItem(
                          `kardiologiku_meds_${config.time}`
                        );
                        const savedHistory = localStorage.getItem(
                          `kardiologiku_history_${config.time}`
                        );
                        if (savedMeds || savedHistory) {
                          allData[config.time] = {
                            medicines: savedMeds ? JSON.parse(savedMeds) : [],
                            history: savedHistory
                              ? JSON.parse(savedHistory)
                              : [],
                          };
                        }
                      } catch (error) {
                        console.error(`Error exporting ${config.time}:`, error);
                      }
                    });

                    const dataStr = JSON.stringify(allData, null, 2);
                    const dataUri =
                      "data:application/json;charset=utf-8," +
                      encodeURIComponent(dataStr);
                    const exportFileDefaultName = `kardiologiku-backup-${
                      new Date().toISOString().split("T")[0]
                    }.json`;

                    const linkElement = document.createElement("a");
                    linkElement.setAttribute("href", dataUri);
                    linkElement.setAttribute("download", exportFileDefaultName);
                    linkElement.click();
                  },
                },
                {
                  icon: Upload,
                  label: "Import Data",
                  desc: "Pulihkan data obat",
                  color: "from-green-500 to-green-600",
                  action: () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".json";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          try {
                            const data = JSON.parse(e.target?.result as string);
                            Object.keys(data).forEach((time) => {
                              if (data[time].medicines) {
                                localStorage.setItem(
                                  `kardiologiku_meds_${time}`,
                                  JSON.stringify(data[time].medicines)
                                );
                              }
                              if (data[time].history) {
                                localStorage.setItem(
                                  `kardiologiku_history_${time}`,
                                  JSON.stringify(data[time].history)
                                );
                              }
                            });
                            alert(
                              "Data berhasil diimport! Refresh halaman untuk melihat perubahan."
                            );
                          } catch (error) {
                            console.error(error);
                            alert("File tidak valid atau rusak.");
                          }
                        };
                        reader.readAsText(file);
                      }
                    };
                    input.click();
                  },
                },
                {
                  icon: RefreshCw,
                  label: "Reset Harian",
                  desc: "Reset status harian",
                  color: "from-purple-500 to-purple-600",
                  action: () => {
                    if (
                      confirm(
                        'Reset status "sudah diminum" untuk semua obat? Aksi ini tidak dapat dibatalkan.'
                      )
                    ) {
                      reminderConfig.forEach((config) => {
                        try {
                          const savedMeds = localStorage.getItem(
                            `kardiologiku_meds_${config.time}`
                          );
                          if (savedMeds) {
                            const medicines = JSON.parse(savedMeds);
                            const resetMedicines = medicines.map(
                              (med: Medicine) => ({ ...med, taken: false })
                            );
                            localStorage.setItem(
                              `kardiologiku_meds_${config.time}`,
                              JSON.stringify(resetMedicines)
                            );
                          }
                        } catch (error) {
                          console.error(
                            `Error resetting ${config.time}:`,
                            error
                          );
                        }
                      });
                      alert(
                        "Status harian berhasil direset! Refresh halaman untuk melihat perubahan."
                      );
                    }
                  },
                },
                {
                  icon: BarChart3,
                  label: "Laporan",
                  desc: "Lihat statistik detail",
                  color: "from-orange-500 to-orange-600",
                  action: () => {
                    let report = "📊 LAPORAN KARDIOLOGIKU\n";
                    report += "=" + "=".repeat(30) + "\n\n";

                    let totalGlobal = 0;
                    let takenGlobal = 0;

                    reminderConfig.forEach((config) => {
                      try {
                        const savedMeds = localStorage.getItem(
                          `kardiologiku_meds_${config.time}`
                        );
                        if (savedMeds) {
                          const medicines = JSON.parse(savedMeds);
                          const total = medicines.length;
                          const taken = medicines.filter(
                            (m: Medicine) => m.taken
                          ).length;
                          const progress =
                            total > 0 ? Math.round((taken / total) * 100) : 0;

                          totalGlobal += total;
                          takenGlobal += taken;

                          report += `⏰ ${config.time}:\n`;
                          report += `   Total: ${total} obat\n`;
                          report += `   Diminum: ${taken} obat\n`;
                          report += `   Progress: ${progress}%\n`;

                          if (medicines.length > 0) {
                            report += `   Daftar obat:\n`;
                            medicines.forEach((med: Medicine) => {
                              const status = med.taken ? "✅" : "⭕";
                              report += `   ${status} ${med.name} (${med.dose}) - Stok: ${med.stock}\n`;
                            });
                          }
                          report += "\n";
                        }
                      } catch (error) {
                        console.error(error);
                        report += `❌ Error loading data for ${config.time}\n\n`;
                      }
                    });

                    const globalProgress =
                      totalGlobal > 0
                        ? Math.round((takenGlobal / totalGlobal) * 100)
                        : 0;
                    report += `🎯 RINGKASAN GLOBAL:\n`;
                    report += `   Total obat: ${totalGlobal}\n`;
                    report += `   Diminum hari ini: ${takenGlobal}\n`;
                    report += `   Tingkat kepatuhan: ${globalProgress}%\n`;
                    report += `   Generated: ${new Date().toLocaleString()}\n`;

                    const reportWindow = window.open("", "_blank");
                    if (reportWindow) {
                      reportWindow.document.write(`
                        <html>
                          <head>
                            <title>Laporan KardioloGiku</title>
                            <style>
                              body { 
                                font-family: 'Courier New', monospace; 
                                margin: 20px; 
                                background: #f5f5f5; 
                                color: #333;
                                line-height: 1.6;
                              }
                              pre { 
                                background: white; 
                                padding: 20px; 
                                border-radius: 10px; 
                                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                                overflow-x: auto;
                              }
                              button {
                                background: #dc2626;
                                color: white;
                                border: none;
                                padding: 10px 20px;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 16px;
                                margin-bottom: 20px;
                              }
                              button:hover {
                                background: #b91c1c;
                              }
                            </style>
                          </head>
                          <body>
                            <button onclick="window.print()">🖨️ Print Laporan</button>
                            <pre>${report}</pre>
                          </body>
                        </html>
                      `);
                      reportWindow.document.close();
                    }
                  },
                },
              ].map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.action}
                  className={`group p-6 bg-gradient-to-br ${action.color} rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <motion.div
                      className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                      whileHover={{ rotate: 10 }}
                    >
                      <action.icon className="h-8 w-8" />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{action.label}</h4>
                      <p className="text-sm opacity-90">{action.desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-center mt-16 p-8"
          >
            <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm">
                Dibuat dengan cinta untuk kesehatan yang lebih baik
              </span>
              <Shield className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Data disimpan secara lokal di perangkat Anda untuk privasi
              maksimal
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AdvancedMedicineReminderSystem;
