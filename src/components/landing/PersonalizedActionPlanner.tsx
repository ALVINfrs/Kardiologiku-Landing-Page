import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  Line,
  LineChart,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  Wind,
  Droplets,
  Footprints,
  Cigarette,
  Coffee,
  HeartPulse,
  BrainCircuit,
  Shield,
  Moon,
  HelpCircle,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- TIPE DATA & STRUKTUR YANG LEBIH KOMPLEKS ---
type ArrhythmiaProfile =
  | "healthy"
  | "pvc_prone"
  | "afib_prone"
  | "brady_prone"
  | "tachy_prone";
type Goal =
  | "reduce_triggers"
  | "increase_activity"
  | "improve_diet"
  | "reduce_stress"
  | "monitor_symptoms"
  | "manage_sleep"
  | "quit_vices"
  | "control_bp_cholesterol";
type ActionStatus = "todo" | "done" | "missed";
interface ActionItem {
  id: string;
  text: string;
  category: Goal;
  points: number;
  status: ActionStatus;
  description: string; // Edukasi deskripsi
  source: string; // Sumber info
}
interface UserProfile {
  arrhythmiaType: ArrhythmiaProfile;
  goals: Goal[];
  points: number;
  level: number;
  badges: string[];
  streak: number;
  dailyLog: { date: string; completed: number; total: number }[];
}
interface HealthProjection {
  week: number;
  currentPath: number; // Risk score on current path
  healthyPath: number; // Risk score on ideal path
  worstPath: number; // Risk if no changes
}
interface RiskMetric {
  name: string;
  value: number;
  trend: "up" | "down" | "stable";
}

// --- DATABASE REKOMENDASI AKSI YANG LEBIH LUAS & EDUKATIF (BERDASARKAN GUIDELINES) ---
const actionDatabase: Omit<ActionItem, "status">[] = [
  {
    id: "trigger_1",
    text: "Hindari minum kopi atau minuman berkafein hari ini",
    category: "reduce_triggers",
    points: 20,
    description:
      "Kafein dapat memicu PVC atau AFib pada individu rentan dengan meningkatkan adrenalin.",
    source:
      "American Heart Association: Lifestyle Strategies for Atrial Fibrillation",
  },
  {
    id: "trigger_2",
    text: "Batasi alkohol maksimal 1 gelas standar",
    category: "reduce_triggers",
    points: 15,
    description:
      "Alkohol berlebih dapat menyebabkan 'holiday heart syndrome' dan memicu AFib.",
    source: "Mayo Clinic: Diet and atrial fibrillation",
  },
  {
    id: "activity_1",
    text: "Lakukan jalan kaki cepat 30 menit",
    category: "increase_activity",
    points: 25,
    description:
      "Aktivitas aerobik reguler membantu mengurangi risiko aritmia dengan meningkatkan kesehatan kardiovaskular.",
    source: "AHA: Be More Active (Life's Essential 8)",
  },
  {
    id: "activity_2",
    text: "Coba yoga atau tai chi selama 20 menit",
    category: "increase_activity",
    points: 20,
    description:
      "Latihan ringan seperti yoga dapat mengurangi stres dan meningkatkan variabilitas detak jantung.",
    source:
      "NIH: Lifestyle and risk factor modification in atrial fibrillation",
  },
  {
    id: "diet_1",
    text: "Konsumsi makanan kaya omega-3 (ikan salmon atau kacang)",
    category: "improve_diet",
    points: 15,
    description: "Omega-3 memiliki efek anti-aritmia dan mengurangi inflamasi.",
    source: "Mayo Clinic: Heart arrhythmia - Diagnosis and treatment",
  },
  {
    id: "diet_2",
    text: "Kurangi garam intake menjadi &lt;2g/hari",
    category: "improve_diet",
    points: 15,
    description:
      "Diet rendah garam membantu mengontrol tekanan darah, faktor risiko utama aritmia.",
    source: "AHA Diet and Lifestyle Recommendations",
  },
  {
    id: "stress_1",
    text: "Praktik meditasi mindfulness 10 menit",
    category: "reduce_stress",
    points: 15,
    description:
      "Manajemen stres mengurangi aktivasi simpatis yang dapat memicu aritmia.",
    source: "Mayo Clinic: Diet and atrial fibrillation",
  },
  {
    id: "stress_2",
    text: "Lakukan teknik pernapasan dalam 5 menit dua kali sehari",
    category: "reduce_stress",
    points: 10,
    description:
      "Pernapasan dalam mengaktifkan sistem parasimpatis, menstabilkan irama jantung.",
    source: "AHA: Manage Stress",
  },
  {
    id: "monitor_1",
    text: "Catat detak jantung 3 kali hari ini menggunakan app",
    category: "monitor_symptoms",
    points: 10,
    description: "Pemantauan reguler membantu mendeteksi pola aritmia dini.",
    source: "AHA: Understand Your Risk for Arrhythmia",
  },
  {
    id: "monitor_2",
    text: "Catat gejala seperti palpitasi atau pusing jika terjadi",
    category: "monitor_symptoms",
    points: 10,
    description: "Logging gejala membantu dokter menyesuaikan pengobatan.",
    source: "Mayo Clinic: Heart arrhythmia",
  },
  {
    id: "sleep_1",
    text: "Tidur minimal 7-9 jam malam ini",
    category: "manage_sleep",
    points: 20,
    description:
      "Tidur cukup penting untuk ritme sirkadian dan pencegahan aritmia.",
    source: "AHA: Get Healthy Sleep (Life's Essential 8)",
  },
  {
    id: "sleep_2",
    text: "Hindari layar 1 jam sebelum tidur",
    category: "manage_sleep",
    points: 15,
    description:
      "Cahaya biru mengganggu melatonin, memengaruhi kualitas tidur dan kesehatan jantung.",
    source: "NIH: Lifestyle changes for heart failure",
  },
  {
    id: "vice_1",
    text: "Hindari merokok atau paparan asap rokok hari ini",
    category: "quit_vices",
    points: 25,
    description:
      "Merokok meningkatkan risiko aritmia dengan merusak pembuluh darah dan meningkatkan tekanan darah.",
    source: "AHA: Quit Tobacco",
  },
  {
    id: "vice_2",
    text: "Kurangi konsumsi gula tambahan &lt;25g/hari",
    category: "quit_vices",
    points: 15,
    description:
      "Gula berlebih berkontribusi pada obesitas dan diabetes, faktor risiko aritmia.",
    source: "AHA: Manage Blood Sugar",
  },
  {
    id: "control_1",
    text: "Ukur tekanan darah dan catat hasilnya",
    category: "control_bp_cholesterol",
    points: 10,
    description: "Kontrol BP mengurangi strain pada jantung, mencegah aritmia.",
    source: "AHA: Manage Blood Pressure",
  },
  {
    id: "control_2",
    text: "Konsumsi makanan rendah kolesterol (sayur hijau)",
    category: "control_bp_cholesterol",
    points: 15,
    description:
      "Diet rendah kolesterol membantu mencegah plak arteri yang dapat memicu aritmia.",
    source: "AHA: Control Cholesterol",
  },
];

// --- SUB-KOMPONEN VISUAL YANG LEBIH ADVANCED ---
const HeartHealthTree: React.FC<{
  progress: number;
  profile: ArrhythmiaProfile;
}> = ({ progress, profile }) => {
  const treeColor = useMemo(() => {
    if (progress > 80) return "#22c55e"; // Green
    if (progress > 50) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  }, [progress]);

  const arrhythmiaEffect = profile === "afib_prone" ? "animate-pulse" : "";

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <motion.svg
        viewBox="0 0 100 120"
        className={`w-48 h-48 ${arrhythmiaEffect}`}
      >
        {/* Batang Pohon */}
        <motion.path
          d="M 50 110 V 60"
          stroke="#8B572A"
          strokeWidth="5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Cabang Utama */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: progress / 100, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
            delay: 0.5,
          }}
          style={{ originX: "50px", originY: "60px" }}
        >
          <path
            d="M 50 60 Q 30 40 20 20"
            stroke={treeColor}
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 50 60 Q 70 40 80 20"
            stroke={treeColor}
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 50 80 Q 40 85 30 90"
            stroke={treeColor}
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 50 80 Q 60 85 70 90"
            stroke={treeColor}
            strokeWidth="3"
            fill="none"
          />
          {/* Cabang Sekunder & Daun */}
          {[20, 80, 30, 70, 25, 75, 35, 65].map((x, i) => (
            <g key={i}>
              <path
                d={`M ${x} ${20 + i * 10} Q ${x - 10} ${10 + i * 10} ${
                  x - 15
                } ${i * 10}`}
                stroke={treeColor}
                strokeWidth="2"
                fill="none"
              />
              {progress > (i + 1) * 10 && (
                <circle
                  cx={x - 15}
                  cy={i * 10}
                  r={Math.min(4, progress / 20)}
                  fill={treeColor}
                />
              )}
            </g>
          ))}
        </motion.g>
        {/* Heart Icon at Base */}
        <HeartPulse x={45} y={105} className="w-10 h-10 text-red-500" />
      </motion.svg>
    </div>
  );
};

// --- KOMPONEN UTAMA YANG SUPER KOMPLEKS, INTERAKTIF & EDUKATIF ---
const PersonalizedActionPlanner: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    arrhythmiaType: "healthy",
    goals: [],
    points: 0,
    level: 1,
    badges: [],
    streak: 0,
    dailyLog: [],
  });
  const [actionList, setActionList] = useState<ActionItem[]>([]);
  const [adherenceLevel, setAdherenceLevel] = useState(50); // 0-100
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([
    { name: "Trigger Exposure", value: 50, trend: "stable" },
    { name: "Activity Level", value: 40, trend: "down" },
    { name: "Diet Quality", value: 60, trend: "up" },
    { name: "Stress Index", value: 70, trend: "up" },
    { name: "Sleep Score", value: 50, trend: "stable" },
  ]);

  const handleProfileChange = (type: ArrhythmiaProfile) => {
    setProfile((prev) => ({ ...prev, arrhythmiaType: type }));
  };

  const toggleGoal = (goal: Goal) => {
    setProfile((prev) => {
      const newGoals = prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal].slice(0, 4); // Max 4 goals
      return { ...prev, goals: newGoals };
    });
  };

  const generateActionPlan = useCallback(() => {
    let recommendedActions: Omit<ActionItem, "status">[] = [];
    if (profile.goals.length === 0) {
      recommendedActions = actionDatabase.slice(0, 5);
    } else {
      profile.goals.forEach((goal) => {
        const actionsForGoal = actionDatabase.filter(
          (a) => a.category === goal
        );
        const numToPick = Math.min(2, actionsForGoal.length);
        for (let i = 0; i < numToPick; i++) {
          const randomAction =
            actionsForGoal[Math.floor(Math.random() * actionsForGoal.length)];
          if (!recommendedActions.some((a) => a.id === randomAction.id)) {
            recommendedActions.push(randomAction);
          }
        }
      });
    }
    setActionList(recommendedActions.map((a) => ({ ...a, status: "todo" })));
  }, [profile.goals]);

  useEffect(() => {
    generateActionPlan();
  }, [profile.goals, generateActionPlan]);

  const handleActionCheck = (id: string, checked: boolean) => {
    setActionList((prev) =>
      prev.map((action) => {
        if (action.id === id) {
          const newStatus = checked ? "done" : "todo";
          const pointChange = checked ? action.points : -action.points;
          setProfile((p) => {
            const newPoints = Math.max(0, p.points + pointChange);
            const newLevel = Math.floor(newPoints / 100) + 1;
            const newBadges = [...p.badges];
            if (newPoints >= 200 && !newBadges.includes("Arrhythmia Warrior")) {
              newBadges.push("Arrhythmia Warrior");
            }
            return {
              ...p,
              points: newPoints,
              level: newLevel,
              badges: newBadges,
            };
          });
          // Update risk metrics based on category
          setRiskMetrics((metrics) =>
            metrics.map((m) => {
              if (
                m.name.toLowerCase().includes(action.category.split("_")[0])
              ) {
                return {
                  ...m,
                  value: checked ? m.value - 10 : m.value + 10,
                  trend: checked ? "down" : "up",
                };
              }
              return m;
            })
          );
          return { ...action, status: newStatus };
        }
        return action;
      })
    );
  };

  const healthProgress = useMemo(() => {
    const totalPossiblePoints = actionList.reduce(
      (sum, a) => sum + a.points,
      0
    );
    if (totalPossiblePoints === 0) return 50;
    const currentPoints = actionList
      .filter((a) => a.status === "done")
      .reduce((sum, a) => sum + a.points, 0);
    return (currentPoints / totalPossiblePoints) * 100;
  }, [actionList]);

  const projectionData = useMemo<HealthProjection[]>(() => {
    const data: HealthProjection[] = [];
    let currentRisk = 50;
    const adherenceFactor = ((healthProgress / 100) * adherenceLevel) / 50;
    for (let i = 0; i <= 52; i++) {
      // 1 year projection
      currentRisk -= adherenceFactor * 0.8 + (Math.random() - 0.5) * 1;
      currentRisk = Math.max(5, Math.min(95, currentRisk));
      data.push({
        week: i,
        currentPath: currentRisk,
        healthyPath: 50 - i * 0.8,
        worstPath: 50 + i * 0.5,
      });
    }
    return data;
  }, [healthProgress, adherenceLevel]);

  const logDailyProgress = () => {
    const today = new Date().toISOString().split("T")[0];
    if (profile.dailyLog.some((log) => log.date === today)) return;
    const completed = actionList.filter((a) => a.status === "done").length;
    const total = actionList.length;
    const newStreak =
      profile.dailyLog.length > 0 &&
      profile.dailyLog[profile.dailyLog.length - 1].date ===
        new Date(Date.now() - 86400000).toISOString().split("T")[0]
        ? profile.streak + 1
        : 1;
    setProfile((prev) => ({
      ...prev,
      dailyLog: [...prev.dailyLog, { date: today, completed, total }],
      streak: newStreak,
    }));
    if (newStreak >= 7 && !profile.badges.includes("7-Day Streak")) {
      setProfile((prev) => ({
        ...prev,
        badges: [...prev.badges, "7-Day Streak"],
      }));
    }
  };

  return (
    <section
      id="action-planner"
      className="py-24 sm:py-32 bg-gray-100 dark:bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <HeartPulse className="h-12 w-12 mx-auto text-red-500 mb-4 animate-pulse" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Perencana Aksi Personal Anti-Aritmia
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Transformasi wawasan menjadi aksi nyata untuk mengelola aritmia.
            Pilih profil, tetapkan tujuan berdasarkan guidelines terkini, lacak
            progres, dan pelajari dampaknya melalui visualisasi interaktif.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KIRI: Pengaturan Profil, Tujuan & Rencana Aksi */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="text-blue-400" />
                  Pilih Profil Aritmia Anda
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleProfileChange("healthy")}
                  variant={
                    profile.arrhythmiaType === "healthy" ? "default" : "outline"
                  }
                >
                  Sehat
                </Button>
                <Button
                  onClick={() => handleProfileChange("pvc_prone")}
                  variant={
                    profile.arrhythmiaType === "pvc_prone"
                      ? "default"
                      : "outline"
                  }
                >
                  Rentan PVC
                </Button>
                <Button
                  onClick={() => handleProfileChange("afib_prone")}
                  variant={
                    profile.arrhythmiaType === "afib_prone"
                      ? "default"
                      : "outline"
                  }
                >
                  Cenderung AFib
                </Button>
                <Button
                  onClick={() => handleProfileChange("brady_prone")}
                  variant={
                    profile.arrhythmiaType === "brady_prone"
                      ? "default"
                      : "outline"
                  }
                >
                  Rentan Bradikardia
                </Button>
                <Button
                  onClick={() => handleProfileChange("tachy_prone")}
                  variant={
                    profile.arrhythmiaType === "tachy_prone"
                      ? "default"
                      : "outline"
                  }
                >
                  Rentan Takikardia
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Langkah 1: Tetapkan Tujuan Mingguan</CardTitle>
                <CardDescription>
                  Pilih hingga 4 tujuan berdasarkan guidelines AHA/Mayo Clinic
                  2025.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => toggleGoal("reduce_triggers")}
                  variant={
                    profile.goals.includes("reduce_triggers")
                      ? "default"
                      : "outline"
                  }
                  className="h-auto py-3 flex-col gap-1"
                >
                  <Coffee className="h-5 w-5" /> Kurangi Trigger
                </Button>
                <Button
                  onClick={() => toggleGoal("increase_activity")}
                  variant={
                    profile.goals.includes("increase_activity")
                      ? "default"
                      : "outline"
                  }
                  className="h-auto py-3 flex-col gap-1"
                >
                  <Footprints className="h-5 w-5" /> Tingkatkan Aktivitas
                </Button>
                <Button
                  onClick={() => toggleGoal("improve_diet")}
                  variant={
                    profile.goals.includes("improve_diet")
                      ? "default"
                      : "outline"
                  }
                  className="h-auto py-3 flex-col gap-1"
                >
                  <Droplets className="h-5 w-5" /> Perbaiki Diet
                </Button>
                <Button
                  onClick={() => toggleGoal("reduce_stress")}
                  variant={
                    profile.goals.includes("reduce_stress")
                      ? "default"
                      : "outline"
                  }
                  className="h-auto py-3 flex-col gap-1"
                >
                  <Wind className="h-5 w-5" /> Kelola Stres
                </Button>
                <Button
                  onClick={() => toggleGoal("monitor_symptoms")}
                  variant={
                    profile.goals.includes("monitor_symptoms")
                      ? "default"
                      : "outline"
                  }
                  className="h-auto py-3 flex-col gap-1"
                >
                  <HeartPulse className="h-5 w-5" /> Pantau Gejala
                </Button>
                <Button
                  onClick={() => toggleGoal("manage_sleep")}
                  variant={
                    profile.goals.includes("manage_sleep")
                      ? "default"
                      : "outline"
                  }
                  className="h-auto py-3 flex-col gap-1"
                >
                  <Moon className="h-5 w-5" /> Atur Tidur
                </Button>
                <Button
                  onClick={() => toggleGoal("quit_vices")}
                  variant={
                    profile.goals.includes("quit_vices") ? "default" : "outline"
                  }
                  className="h-auto py-3 flex-col gap-1"
                >
                  <Cigarette className="h-5 w-5" /> Berhenti Kebiasaan Buruk
                </Button>
                <Button
                  onClick={() => toggleGoal("control_bp_cholesterol")}
                  variant={
                    profile.goals.includes("control_bp_cholesterol")
                      ? "default"
                      : "outline"
                  }
                  className="h-auto py-3 flex-col gap-1"
                >
                  <Shield className="h-5 w-5" /> Kontrol BP & Kolesterol
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>
                  Langkah 2: Rencana Aksi Harian Personalisasi
                </CardTitle>
                <CardDescription>
                  Rekomendasi AI berdasarkan profil & tujuan Anda. Selesaikan
                  untuk naik level!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {actionList.map((action, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                        action.status === "done"
                          ? "bg-green-50 dark:bg-green-900/30"
                          : "bg-gray-50 dark:bg-gray-900/50"
                      )}
                    >
                      <Checkbox
                        id={action.id}
                        checked={action.status === "done"}
                        onCheckedChange={(checked) =>
                          handleActionCheck(action.id, !!checked)
                        }
                      />
                      <label
                        htmlFor={action.id}
                        className={cn(
                          "flex-grow cursor-pointer",
                          action.status === "done" &&
                            "line-through text-gray-500"
                        )}
                      >
                        {action.text}
                      </label>
                      <Badge variant="secondary">+{action.points} XP</Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Info Edukasi: {action.text}
                            </DialogTitle>
                          </DialogHeader>
                          <p>{action.description}</p>
                          <p className="text-sm text-gray-500">
                            Sumber: {action.source}
                          </p>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button onClick={logDailyProgress} className="w-full mt-4">
                  Log Progres Hari Ini
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="text-purple-400" />
                  Tingkat Kepatuhan Anda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Slider
                  value={[adherenceLevel]}
                  onValueChange={(v) => setAdherenceLevel(v[0])}
                  max={100}
                  step={1}
                />
                <p className="text-center mt-2">{adherenceLevel}% Kepatuhan</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* TENGAH & KANAN: Visualisasi Progres & Edukasi */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>
                  Progres Anda: Pohon Kesehatan Anti-Aritmia
                </CardTitle>
                <CardDescription>
                  Pohon tumbuh seiring kepatuhan; animasi merefleksikan profil
                  aritmia Anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HeartHealthTree
                  progress={healthProgress}
                  profile={profile.arrhythmiaType}
                />
                <div className="text-center space-y-2">
                  <Badge variant="secondary">
                    Level: {profile.level} | Poin: {profile.points}
                  </Badge>
                  <Badge variant="outline">Streak: {profile.streak} Hari</Badge>
                  <div className="flex flex-wrap justify-center gap-2">
                    {profile.badges.map((badge) => (
                      <Badge key={badge} variant="default">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Proyeksi Risiko Aritmia (1 Tahun)</CardTitle>
                <CardDescription>
                  Simulasi berdasarkan kepatuhan & data AHA 2025.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient
                        id="colorHealthy"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorCurrent"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorWorst"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tickFormatter={(w) => `W${w}`} />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="healthyPath"
                      name="Jalur Ideal"
                      stroke="#22c55e"
                      fill="url(#colorHealthy)"
                    />
                    <Area
                      type="monotone"
                      dataKey="currentPath"
                      name="Proyeksi Anda"
                      stroke="#3b82f6"
                      fill="url(#colorCurrent)"
                    />
                    <Area
                      type="monotone"
                      dataKey="worstPath"
                      name="Tanpa Perubahan"
                      stroke="#ef4444"
                      fill="url(#colorWorst)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Metrik Risiko Aritmia</CardTitle>
                <CardDescription>
                  Update real-time berdasarkan aksi Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {riskMetrics.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.value > 70
                              ? "#ef4444"
                              : entry.value > 40
                              ? "#f59e0b"
                              : "#22c55e"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Log Harian & Tren</CardTitle>
                <CardDescription>
                  Lihat kemajuan Anda dari waktu ke waktu.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profile.dailyLog}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#8884d8"
                      name="Aksi Selesai"
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#82ca9d"
                      name="Total Aksi"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700 text-gray-900 dark:text-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <BrainCircuit /> Pusat Edukasi Aritmia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <HelpCircle /> Jelajahi Guidelines & Tips
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        Edukasi Manajemen Aritmia (Berdasarkan AHA/Mayo
                        Clinic/NIH 2025)
                      </DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="overview">
                      <TabsList>
                        <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
                        <TabsTrigger value="triggers">
                          Trigger & Risiko
                        </TabsTrigger>
                        <TabsTrigger value="lifestyle">
                          Perubahan Gaya Hidup
                        </TabsTrigger>
                        <TabsTrigger value="monitoring">
                          Pemantauan & Pencegahan
                        </TabsTrigger>
                        <TabsTrigger value="sources">Sumber</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview">
                        <p>
                          Aritmia adalah gangguan irama jantung yang dapat
                          berupa terlalu cepat (takikardia), lambat
                          (bradikardia), atau tidak teratur (seperti AFib atau
                          PVC). Manajemen gaya hidup krusial untuk mengurangi
                          episode dan risiko komplikasi seperti stroke.
                        </p>
                        <p>
                          Life's Essential 8 (AHA): Eat Better, Be More Active,
                          Quit Tobacco, Get Healthy Sleep, Manage Weight,
                          Control Cholesterol, Manage Blood Sugar, Manage Blood
                          Pressure.
                        </p>
                      </TabsContent>
                      <TabsContent value="triggers">
                        <ul className="space-y-2">
                          <li>
                            <strong>Kafein & Alkohol:</strong> Dapat memicu
                            AFib; batasi kafein &lt;200mg/hari, alkohol &lt;1-2
                            unit/hari.
                          </li>
                          <li>
                            <strong>Stres & Kurang Tidur:</strong> Meningkatkan
                            adrenalin; praktik relaksasi dan tidur 7-9 jam.
                          </li>
                          <li>
                            <strong>Merokok & Obesitas:</strong> Merusak
                            pembuluh darah; berhenti merokok dan jaga BMI
                            &lt;25.
                          </li>
                          <li>
                            <strong>Olahraga Berlebih:</strong> Bisa memicu pada
                            rentan; mulai bertahap 150 menit/minggu.
                          </li>
                        </ul>
                      </TabsContent>
                      <TabsContent value="lifestyle">
                        <ul className="space-y-2">
                          <li>
                            <strong>Diet:</strong> Rendah garam (&lt;2g/hari),
                            kaya omega-3, buah/sayur; hindari makanan olahan.
                          </li>
                          <li>
                            <strong>Aktivitas:</strong> 150 min moderat atau 75
                            min intens per minggu; campur aerobik & kekuatan.
                          </li>
                          <li>
                            <strong>Stres:</strong> Meditasi, yoga; kelola
                            dengan teknik 4-7-8 breathing.
                          </li>
                          <li>
                            <strong>Tidur:</strong> Rutin, hindari kafein sore;
                            target 7-9 jam untuk ritme sirkadian stabil.
                          </li>
                          <li>
                            <strong>Berat Badan:</strong> Turunkan 5-10% jika
                            obesitas untuk kurangi beban jantung.
                          </li>
                        </ul>
                      </TabsContent>
                      <TabsContent value="monitoring">
                        <ul className="space-y-2">
                          <li>
                            <strong>Pantau Detak:</strong> Gunakan wearable
                            untuk HRV; catat palpitasi, pusing, sesak.
                          </li>
                          <li>
                            <strong>Kontrol Faktor Risiko:</strong> Cek BP,
                            kolesterol, gula darah rutin.
                          </li>
                          <li>
                            <strong>Konsultasi:</strong> Jika episode
                            &gt;2/minggu, hubungi dokter; pertimbangkan Holter
                            monitor.
                          </li>
                          <li>
                            <strong>Pencegahan:</strong> Vaksinasi flu/COVID
                            untuk hindari infeksi pemicu aritmia.
                          </li>
                        </ul>
                      </TabsContent>
                      <TabsContent value="sources">
                        <ul className="space-y-1 text-sm">
                          <li>
                            American Heart Association: Lifestyle Strategies for
                            Atrial Fibrillation (2025)
                          </li>
                          <li>
                            Mayo Clinic: Diet and atrial fibrillation (Updated
                            2025)
                          </li>
                          <li>
                            NIH: Lifestyle and risk factor modification in
                            atrial fibrillation (PMC11983686)
                          </li>
                          <li>
                            AHA: Life's Essential 8 (2024-2025 Guidelines)
                          </li>
                          <li>
                            PubMed: Preventive Measures and Treatment Options
                            for Atrial Fibrillation
                          </li>
                        </ul>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedActionPlanner;
