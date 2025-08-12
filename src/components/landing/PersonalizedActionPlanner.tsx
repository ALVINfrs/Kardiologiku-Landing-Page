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
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Target, TrendingUp, Wind, Droplets, Footprints } from "lucide-react";
import { cn } from "@/lib/utils";

// --- TIPE DATA & STRUKTUR ---
type Goal =
  | "reduce_bp"
  | "increase_activity"
  | "improve_diet"
  | "reduce_stress";
type ActionStatus = "todo" | "done" | "missed";
interface ActionItem {
  id: string;
  text: string;
  category: Goal;
  points: number;
  status: ActionStatus;
}
interface UserProfile {
  goals: Goal[];
  points: number;
  badges: string[];
}
interface HealthProjection {
  week: number;
  currentPath: number; // Risk score on current path
  healthyPath: number; // Risk score on ideal path
}

// --- DATABASE REKOMENDASI AKSI ---
const actionDatabase: Omit<ActionItem, "status">[] = [
  {
    id: "bp_1",
    text: "Kurangi 1 sdt garam dari masakan hari ini",
    category: "reduce_bp",
    points: 15,
  },
  {
    id: "bp_2",
    text: "Konsumsi makanan kaya potasium (pisang/alpukat)",
    category: "reduce_bp",
    points: 10,
  },
  {
    id: "activity_1",
    text: "Jalan kaki cepat selama 20 menit",
    category: "increase_activity",
    points: 20,
  },
  {
    id: "activity_2",
    text: "Lakukan peregangan selama 10 menit di pagi hari",
    category: "increase_activity",
    points: 10,
  },
  {
    id: "diet_1",
    text: "Ganti nasi putih dengan nasi merah untuk 1 porsi makan",
    category: "improve_diet",
    points: 15,
  },
  {
    id: "diet_2",
    text: "Minum 8 gelas air putih hari ini",
    category: "improve_diet",
    points: 10,
  },
  {
    id: "stress_1",
    text: "Lakukan teknik pernapasan 4-7-8 selama 5 menit",
    category: "reduce_stress",
    points: 15,
  },
  {
    id: "stress_2",
    text: "Hindari melihat layar 1 jam sebelum tidur",
    category: "reduce_stress",
    points: 10,
  },
];

// --- SUB-KOMPONEN ---
const HealthTree: React.FC<{ progress: number }> = ({ progress }) => {
  const treeColor = useMemo(() => {
    if (progress > 80) return "#22c55e"; // Green
    if (progress > 50) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  }, [progress]);

  return (
    <div className="w-full h-48 flex items-center justify-center">
      <motion.svg viewBox="0 0 100 100" className="w-40 h-40">
        {/* Batang Pohon */}
        <motion.path
          d="M 50 95 V 50"
          stroke="#8B572A"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Cabang-cabang */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: progress / 100, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.5,
          }}
          style={{ originX: "50px", originY: "50px" }}
        >
          <path
            d="M 50 50 Q 40 40 30 30"
            stroke={treeColor}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 50 50 Q 60 40 70 30"
            stroke={treeColor}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 50 60 Q 45 65 35 70"
            stroke={treeColor}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 50 60 Q 55 65 65 70"
            stroke={treeColor}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 30 30 Q 20 20 15 10"
            stroke={treeColor}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 70 30 Q 80 20 85 10"
            stroke={treeColor}
            strokeWidth="2"
            fill="none"
          />
          {/* Daun-daun */}
          {progress > 50 &&
            [15, 85, 40, 60, 25, 75].map((x) => (
              <circle
                key={x}
                cx={x}
                cy={10 + Math.random() * 20}
                r={Math.min(3, progress / 25)}
                fill={treeColor}
              />
            ))}
        </motion.g>
      </motion.svg>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
const PersonalizedActionPlanner: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    goals: [],
    points: 0,
    badges: [],
  });
  const [actionList, setActionList] = useState<ActionItem[]>([]);

  const toggleGoal = (goal: Goal) => {
    setProfile((prev) => {
      const newGoals = prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals: newGoals };
    });
  };

  const generateActionPlan = useCallback(() => {
    let recommendedActions: Omit<ActionItem, "status">[] = [];
    if (profile.goals.length === 0) {
      // Rekomendasi umum jika tidak ada goal
      recommendedActions = actionDatabase.slice(0, 3);
    } else {
      profile.goals.forEach((goal) => {
        const actionsForGoal = actionDatabase.filter(
          (a) => a.category === goal
        );
        if (actionsForGoal.length > 0) {
          recommendedActions.push(
            actionsForGoal[Math.floor(Math.random() * actionsForGoal.length)]
          );
        }
      });
    }
    // Pastikan unik dan maksimal 3
    const uniqueActions = [
      ...new Map(recommendedActions.map((item) => [item["id"], item])).values(),
    ];
    setActionList(
      uniqueActions.slice(0, 3).map((a) => ({ ...a, status: "todo" }))
    );
  }, [profile.goals]);

  useEffect(() => {
    generateActionPlan();
  }, [profile.goals, generateActionPlan]);

  const handleActionCheck = (id: string, checked: boolean) => {
    setActionList((prev) =>
      prev.map((action) => {
        if (action.id === id) {
          if (checked && action.status === "todo") {
            setProfile((p) => ({ ...p, points: p.points + action.points }));
          } else if (!checked && action.status === "done") {
            setProfile((p) => ({
              ...p,
              points: Math.max(0, p.points - action.points),
            }));
          }
          return { ...action, status: checked ? "done" : "todo" };
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
    if (totalPossiblePoints === 0) return 50; // Default state
    const currentPoints = actionList
      .filter((a) => a.status === "done")
      .reduce((sum, a) => sum + a.points, 0);
    return (currentPoints / totalPossiblePoints) * 100;
  }, [actionList]);

  const projectionData = useMemo<HealthProjection[]>(() => {
    const data: HealthProjection[] = [];
    let currentRisk = 50; // Start at 50% risk
    const adherenceFactor = (healthProgress / 100) * 2 - 1; // -1 to 1 scale
    for (let i = 0; i <= 12; i++) {
      // 12 weeks
      currentRisk -= adherenceFactor * 1.5;
      currentRisk = Math.max(
        10,
        Math.min(90, currentRisk + (Math.random() - 0.5) * 2)
      );
      data.push({
        week: i,
        currentPath: currentRisk,
        healthyPath: 50 - i * 2.5,
      });
    }
    return data;
  }, [healthProgress]);

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
          <Target className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Perencana Aksi Personal Anda
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Dari wawasan menjadi aksi. Tetapkan tujuan Anda, dapatkan
            rekomendasi cerdas, dan lihat kemajuan Anda secara visual.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KIRI: Pengaturan Tujuan & Rencana Aksi */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Langkah 1: Pilih Fokus Utama Anda</CardTitle>
                <CardDescription>
                  Pilih 1-2 tujuan utama untuk minggu ini.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => toggleGoal("reduce_bp")}
                  variant={
                    profile.goals.includes("reduce_bp") ? "default" : "outline"
                  }
                  className="h-auto py-3 flex-col gap-1"
                >
                  <TrendingUp /> <span>Turunkan Tensi</span>
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
                  <Footprints /> <span>Tambah Aktivitas</span>
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
                  <Droplets /> <span>Perbaiki Pola Makan</span>
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
                  <Wind /> <span>Kelola Stres</span>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>
                  Langkah 2: Selesaikan Rencana Aksi Mingguan
                </CardTitle>
                <CardDescription>
                  AI Coach telah menyiapkan 3 tugas paling berdampak untuk Anda.
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* KANAN: Visualisasi Progres */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Progres Anda: Pohon Kesehatan Jantung</CardTitle>
                <CardDescription>
                  Pohon ini akan tumbuh subur seiring Anda menyelesaikan tugas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HealthTree progress={healthProgress} />
                <div className="text-center">
                  <Badge>Total Poin Sehat: {profile.points}</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>
                  Proyeksi Risiko Jangka Panjang (12 Minggu)
                </CardTitle>
                <CardDescription>
                  Visualisasi dampak konsistensi Anda terhadap penurunan risiko.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
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
                    </defs>
                    <XAxis dataKey="week" tickFormatter={(w) => `W${w}`} />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="healthyPath"
                      name="Jalur Ideal"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#colorHealthy)"
                    />
                    <Area
                      type="monotone"
                      dataKey="currentPath"
                      name="Proyeksi Anda"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorCurrent)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedActionPlanner;
