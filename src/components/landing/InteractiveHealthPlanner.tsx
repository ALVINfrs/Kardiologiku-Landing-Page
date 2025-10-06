// Nama file: src/components/landing/InteractiveHealthPlanner.tsx

import React, { useReducer, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  HeartPulse,
  Award,
  Plus,
  CheckCircle,
  TrendingUp,
  Flag,
  ShieldCheck,
  Flame,
  BookOpen,
  Activity,
  Heart,
  Stethoscope,
  Brain,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- 1. DEFINISI TIPE, DATA & LOGIKA UTAMA (STATE MANAGEMENT) ---

type Task = {
  id: string;
  description: string;
};

type Mission = {
  id: string;
  title: string;
  description: string;
  xp: number;
  durationDays: number;
  tasks: Task[];
  badgeIcon: React.ElementType;
  category: "Diet" | "Aktivitas" | "Edukasi";
};

type UserMission = {
  missionId: string;
  startDate: string;
  tasks: Record<string, boolean>;
  isCompleted: boolean;
};

type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isMilestone?: boolean;
};

type HealthVital = {
  id: string;
  date: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  weight: number;
  notes?: string;
};

type Symptom = {
  id: string;
  date: string;
  type: "Palpitasi" | "Sesak" | "Pusing" | "Lelah" | "Nyeri Dada";
  severity: 1 | 2 | 3; // 1=Ringan, 2=Sedang, 3=Berat
  duration: number;
  triggers?: string[];
  notes?: string;
};

type Quiz = {
  id: string;
  title: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
};

type HealthPlannerState = {
  xp: number;
  level: number;
  activeMissions: UserMission[];
  completedMissions: string[];
  timelineEvents: TimelineEvent[];
  vitals: HealthVital[];
  symptoms: Symptom[];
  completedQuizzes: string[];
  currentStreak: number;
  achievements: string[];
};

type Action =
  | { type: "START_MISSION"; payload: Mission }
  | { type: "TOGGLE_TASK"; payload: { missionId: string; taskId: string } }
  | { type: "RESET_PROGRESS" };

// Data Misi
const availableMissions: Mission[] = [
  {
    id: "m1",
    title: "Misi 7 Hari Rendah Garam",
    description: "Kurangi asupan sodium untuk menjaga tekanan darah.",
    xp: 150,
    durationDays: 7,
    category: "Diet",
    badgeIcon: ShieldCheck,
    tasks: Array.from({ length: 7 }, (_, i) => ({
      id: `d1t${i + 1}`,
      description: `Hari ${
        i + 1
      }: Catat semua makanan di Food Journal & pastikan rendah sodium.`,
    })),
  },
  {
    id: "m2",
    title: "Tantangan Kardio 5 Hari",
    description: "Mulai rutin berolahraga ringan untuk memperkuat jantung.",
    xp: 200,
    durationDays: 5,
    category: "Aktivitas",
    badgeIcon: Flame,
    tasks: Array.from({ length: 5 }, (_, i) => ({
      id: `a2t${i + 1}`,
      description: `Hari ${
        i + 1
      }: Lakukan jalan cepat atau bersepeda selama 30 menit.`,
    })),
  },
  {
    id: "m3",
    title: "Master Edukasi Aritmia",
    description:
      "Pahami kondisi Anda lebih dalam dengan membaca semua materi edukasi.",
    xp: 100,
    durationDays: 3,
    category: "Edukasi",
    badgeIcon: BookOpen,
    tasks: [
      { id: "e3t1", description: "Baca 5 artikel di AritmiaMythBuster." },
      { id: "e3t2", description: "Selesaikan Kuis Jantung Dasar." },
      { id: "e3t3", description: "Gunakan Simulator EKG untuk memahami AFib." },
    ],
  },
];

const aritmiaQuizzes: Quiz[] = [
  {
    id: "q1",
    title: "Dasar-Dasar Aritmia",
    questions: [
      {
        id: "q1_1",
        text: "Apa yang dimaksud dengan aritmia?",
        options: [
          "Detak jantung tidak teratur",
          "Tekanan darah tinggi",
          "Sakit pada dada",
          "Sesak nafas",
        ],
        correctIndex: 0,
        explanation:
          "Aritmia adalah kondisi di mana detak jantung menjadi tidak teratur, terlalu cepat, atau terlalu lambat.",
      },
      // Add more questions...
    ],
  },
  // Add more quizzes...
];

const LOCAL_STORAGE_KEY = "interactiveHealthPlannerState_v3";

// Reducer
const plannerReducer = (
  state: HealthPlannerState,
  action: Action
): HealthPlannerState => {
  switch (action.type) {
    case "START_MISSION": {
      const mission = action.payload;
      const newMission: UserMission = {
        missionId: mission.id,
        startDate: new Date().toISOString(),
        tasks: mission.tasks.reduce(
          (acc, task) => ({ ...acc, [task.id]: false }),
          {}
        ),
        isCompleted: false,
      };
      const newEvent: TimelineEvent = {
        id: `evt-${Date.now()}`,
        date: new Date().toISOString(),
        title: `Misi Dimulai: ${mission.title}`,
        description: `Anda telah memulai tantangan baru untuk ${mission.durationDays} hari ke depan.`,
        icon: Target,
      };
      return {
        ...state,
        activeMissions: [...state.activeMissions, newMission],
        timelineEvents: [newEvent, ...state.timelineEvents],
      };
    }
    case "TOGGLE_TASK": {
      let missionCompleted = false;
      const updatedMissions = state.activeMissions.map((m) => {
        if (m.missionId === action.payload.missionId) {
          const updatedTasks = {
            ...m.tasks,
            [action.payload.taskId]: !m.tasks[action.payload.taskId],
          };
          const allTasksCompleted = Object.values(updatedTasks).every(Boolean);
          if (allTasksCompleted && !m.isCompleted) {
            missionCompleted = true;
            return { ...m, tasks: updatedTasks, isCompleted: true };
          }
          return { ...m, tasks: updatedTasks };
        }
        return m;
      });

      if (missionCompleted) {
        const missionInfo = availableMissions.find(
          (m) => m.id === action.payload.missionId
        );
        if (missionInfo) {
          const newXP = state.xp + missionInfo.xp;
          const newLevel = Math.floor(newXP / 250) + 1;
          const newEvent: TimelineEvent = {
            id: `evt-${Date.now()}`,
            date: new Date().toISOString(),
            title: `MISI SELESAI: ${missionInfo.title}`,
            description: `Selamat! Anda mendapatkan ${missionInfo.xp} XP dan sebuah lencana baru!`,
            icon: Award,
            isMilestone: true,
          };
          return {
            ...state,
            xp: newXP,
            level: newLevel,
            activeMissions: updatedMissions.filter((m) => !m.isCompleted),
            completedMissions: [
              ...state.completedMissions,
              action.payload.missionId,
            ],
            timelineEvents: [newEvent, ...state.timelineEvents],
          };
        }
      }
      return { ...state, activeMissions: updatedMissions };
    }
    case "RESET_PROGRESS":
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return getInitialState();
    default:
      return state;
  }
};

// Add utility function for health tips
const generatePersonalizedTips = (
  vital: HealthVital | undefined,
  recentSymptoms: Symptom[]
): string[] => {
  const tips: string[] = [];

  if (vital) {
    if (vital.heartRate > 100) {
      tips.push(
        "Detak jantung Anda sedikit tinggi. Coba teknik relaksasi dan kurangi kafein."
      );
    }
    if (vital.bloodPressureSystolic > 140) {
      tips.push(
        "Tekanan darah Anda tinggi. Pastikan konsumsi garam dalam batas wajar."
      );
    }
  }

  const hasFrequentPalpitations =
    recentSymptoms.filter((s) => s.type === "Palpitasi").length > 2;
  if (hasFrequentPalpitations) {
    tips.push(
      "Anda sering mengalami palpitasi. Catat pemicu dan konsultasikan dengan dokter."
    );
  }

  return tips.length > 0 ? tips : ["Terus pantau kesehatan Anda secara rutin."];
};

const getInitialState = (): HealthPlannerState => ({
  xp: 0,
  level: 1,
  activeMissions: [],
  completedMissions: [],
  timelineEvents: [
    {
      id: "init",
      date: new Date().toISOString(),
      title: "Selamat Datang di Perjalanan Kesehatan Anda!",
      description: "Pilih misi pertama Anda untuk memulai.",
      icon: Flag,
    },
  ],
  vitals: [],
  symptoms: [],
  completedQuizzes: [],
  currentStreak: 0,
  achievements: [],
});

// --- 2. SUB-KOMPONEN UI ---

const Dashboard = ({
  state,
  onReset,
}: {
  state: HealthPlannerState;
  onReset: () => void;
}) => {
  const { xp, level, completedMissions } = state;
  const xpForNextLevel = 250;
  const currentLevelXP = (level - 1) * xpForNextLevel;
  const xpInLevel = xp - currentLevelXP;
  const progressPercentage = (xpInLevel / xpForNextLevel) * 100;

  return (
    <Card className="shadow-xl border-2 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Dasbor Kesehatan Anda</CardTitle>
          <CardDescription>Lacak progres dan pencapaian Anda.</CardDescription>
        </div>
        <Button variant="destructive" size="sm" onClick={onReset}>
          Reset
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Lingkaran */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-24 w-24">
            <svg
              className="h-full w-full"
              viewBox="0 0 36 36"
              transform="rotate(-90)"
            >
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                className="stroke-current text-gray-200 dark:text-gray-700"
                strokeWidth="3"
              />
              <motion.circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${progressPercentage} 100`}
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: `${progressPercentage} 100` }}
                transition={{ duration: 1 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs">Level</span>
              <motion.span
                key={level}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold"
              >
                {level}
              </motion.span>
            </div>
          </div>
          <p className="text-center text-sm mt-2 text-gray-500">
            {xpInLevel} / {xpForNextLevel} XP
          </p>
        </div>

        {/* Total XP */}
        <div className="flex flex-col items-center justify-center">
          <HeartPulse className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-3xl font-bold">{xp}</p>
          <p className="text-sm text-gray-500">Total Poin Kesehatan (XP)</p>
        </div>

        {/* Badge */}
        <div className="flex flex-col items-center justify-center">
          <Award className="h-10 w-10 text-yellow-500 mb-2" />
          <p className="text-3xl font-bold">{completedMissions.length}</p>
          <p className="text-sm text-gray-500">Lencana Diterima</p>
          <div className="flex gap-2 mt-2">
            {availableMissions
              .filter((m) => completedMissions.includes(m.id))
              .map((mission) => {
                const BadgeIcon = mission.badgeIcon ?? ShieldCheck;
                return (
                  <TooltipProvider key={mission.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-1 border rounded-full bg-gray-100 dark:bg-gray-700">
                          <BadgeIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{mission.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HealthTips = ({
  vitals,
  symptoms,
}: {
  vitals: HealthVital[];
  symptoms: Symptom[];
}) => {
  const tips = useMemo(() => {
    const latestVital = vitals[0];
    const recentSymptoms = symptoms.slice(0, 5);
    return generatePersonalizedTips(latestVital, recentSymptoms);
  }, [vitals, symptoms]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-blue-500" />
          Tips Kesehatan Personal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{tip}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const SymptomTracker = ({
  symptoms,
  onAddSymptom,
}: {
  symptoms: Symptom[];
  onAddSymptom: (symptom: Omit<Symptom, "id">) => void;
}) => {
  const [selectedSymptom, setSelectedSymptom] =
    useState<Symptom["type"]>("Palpitasi");
  const [severity, setSeverity] = useState<Symptom["severity"]>(1);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-red-500" />
          Monitor Gejala
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Recent Symptoms */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Gejala Terakhir:</h4>
            {symptoms.slice(0, 3).map((symptom) => (
              <div key={symptom.id} className="text-sm text-gray-500">
                {new Date(symptom.date).toLocaleDateString()}: {symptom.type}{" "}
                (Level {symptom.severity})
              </div>
            ))}
          </div>

          {/* Symptom Input */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Jenis Gejala</label>
                <select
                  className="w-full mt-1 rounded-md"
                  value={selectedSymptom}
                  onChange={(e) =>
                    setSelectedSymptom(e.target.value as Symptom["type"])
                  }
                >
                  <option value="Palpitasi">Palpitasi</option>
                  <option value="Sesak">Sesak</option>
                  <option value="Pusing">Pusing</option>
                  <option value="Lelah">Lelah</option>
                  <option value="Nyeri Dada">Nyeri Dada</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Tingkat Keparahan</label>
                <select
                  className="w-full mt-1 rounded-md"
                  value={severity}
                  onChange={(e) =>
                    setSeverity(Number(e.target.value) as Symptom["severity"])
                  }
                >
                  <option value={1}>Ringan</option>
                  <option value={2}>Sedang</option>
                  <option value={3}>Berat</option>
                </select>
              </div>
            </div>
            <Button
              onClick={() =>
                onAddSymptom({
                  date: new Date().toISOString(),
                  type: selectedSymptom,
                  severity,
                  duration: 0,
                })
              }
              className="w-full"
            >
              Catat Gejala
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const VitalSigns = ({ vitals }: { vitals: HealthVital[] }) => {
  const latestVital = vitals[0];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          Tanda Vital
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500">Detak Jantung</p>
            <p className="text-2xl font-bold">
              {latestVital?.heartRate || "--"}
            </p>
            <p className="text-xs text-gray-400">bpm</p>
          </div>
          {/* Add more vital signs */}
        </div>
      </CardContent>
    </Card>
  );
};

const AritmiaQuiz = ({
  quiz,
  onComplete,
}: {
  quiz: Quiz;
  onComplete: (score: number) => void;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (newAnswers.length === quiz.questions.length) {
      // Calculate score
      const score = newAnswers.reduce((acc, ans, idx) => {
        return acc + (ans === quiz.questions[idx].correctIndex ? 1 : 0);
      }, 0);
      onComplete(Math.round((score / quiz.questions.length) * 100));
    } else {
      setCurrentQuestion((current) => current + 1);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Brain className="mr-2 h-4 w-4" />
          Mulai Quiz: {quiz.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        {currentQuestion < quiz.questions.length ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">
              {quiz.questions[currentQuestion].text}
            </h3>
            <div className="space-y-2">
              {quiz.questions[currentQuestion].options.map((option, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full text-left justify-start"
                  onClick={() => handleAnswer(idx)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <Progress value={(currentQuestion / quiz.questions.length) * 100} />
          </div>
        ) : (
          <div className="text-center py-4">
            <h3 className="text-lg font-bold">Quiz Selesai!</h3>
            <p className="text-gray-500">
              Terima kasih telah menyelesaikan quiz.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const MissionControl = ({
  state,
  dispatch,
}: {
  state: HealthPlannerState;
  dispatch: React.Dispatch<Action>;
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { activeMissions, completedMissions } = state;
  const missionsToDisplay = availableMissions.filter(
    (m) =>
      !completedMissions.includes(m.id) &&
      !activeMissions.some((am) => am.missionId === m.id)
  );

  const handleSymptomAdd = (symptom: Omit<Symptom, "id">) => {
    // TODO: Add action handler for symptoms
    console.log("New symptom:", symptom);
  };

  return (
    <div className="space-y-8">
      {/* Health Monitoring Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <VitalSigns vitals={state.vitals} />
        <SymptomTracker
          symptoms={state.symptoms}
          onAddSymptom={handleSymptomAdd}
        />
      </div>

      {/* Education Section */}
      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle>Edukasi Aritmia</CardTitle>
          <CardDescription>
            Pelajari lebih lanjut tentang kondisi aritmia melalui kuis
            interaktif
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aritmiaQuizzes.map((quiz) => (
            <AritmiaQuiz
              key={quiz.id}
              quiz={quiz}
              onComplete={(score) => {
                console.log(`Quiz completed with score: ${score}`);
                // TODO: Add action handler for quiz completion
              }}
            />
          ))}
        </CardContent>
      </Card>

      {/* Active Missions */}
      <h3 className="text-2xl font-bold mb-4">Misi Aktif</h3>
      <AnimatePresence>
        {activeMissions.length > 0 && (
          <motion.div layout className="space-y-4 mb-4">
            {activeMissions.map((um) => {
              const mission = availableMissions.find(
                (m) => m.id === um.missionId
              );
              if (!mission) return null;
              const completedTasks = Object.values(um.tasks).filter(
                Boolean
              ).length;
              const progress = (completedTasks / mission.tasks.length) * 100;
              const BadgeIcon = mission.badgeIcon ?? ShieldCheck;

              return (
                <motion.div
                  key={um.missionId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                >
                  <Card className="bg-white dark:bg-gray-800 overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <BadgeIcon className="h-8 w-8 text-gray-700 dark:text-gray-300" />{" "}
                          {mission.title}
                        </CardTitle>
                        <Badge variant="secondary">{mission.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-4">
                        {mission.description}
                      </p>
                      <Progress value={progress} className="mb-4" />
                      <div className="space-y-2">
                        {mission.tasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() =>
                              dispatch({
                                type: "TOGGLE_TASK",
                                payload: {
                                  missionId: mission.id,
                                  taskId: task.id,
                                },
                              })
                            }
                            className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div
                              className={cn(
                                "h-5 w-5 rounded-sm border-2 flex-shrink-0 flex items-center justify-center transition-all",
                                um.tasks[task.id]
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-400"
                              )}
                            >
                              <AnimatePresence>
                                {um.tasks[task.id] && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                  >
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <span
                              className={cn(
                                "text-sm transition-all",
                                um.tasks[task.id] &&
                                  "line-through text-gray-500"
                              )}
                            >
                              {task.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission Selection Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Pilih Misi Baru
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pilih Misi Kesehatan Baru</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto">
            {missionsToDisplay.length > 0 ? (
              missionsToDisplay.map((mission) => {
                const BadgeIcon = mission.badgeIcon ?? ShieldCheck;
                return (
                  <Card key={mission.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <BadgeIcon className="h-8 w-8 text-gray-700 dark:text-gray-300" />{" "}
                        <CardTitle>{mission.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {mission.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-500">
                        {mission.description}
                      </p>
                    </CardContent>
                    <div className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={() => {
                          dispatch({ type: "START_MISSION", payload: mission });
                          setModalOpen(false);
                        }}
                      >
                        Mulai Misi (+{mission.xp} XP)
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <p className="text-center col-span-2 text-gray-500">
                Anda telah menyelesaikan semua misi yang tersedia. Hebat!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Timeline Perjalanan Anda</h3>
      <div className="relative">
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-8">
          <AnimatePresence initial={false}>
            {events.map((event) => {
              const Icon = typeof event.icon === "function" ? event.icon : Flag; // FIX
              return (
                <motion.div
                  key={`${event.id}-${event.date}`} // FIX key unik
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative pl-16"
                >
                  <div
                    className={cn(
                      "absolute left-0 top-1 h-10 w-10 rounded-full flex items-center justify-center border-4 border-gray-100 dark:border-gray-950",
                      event.isMilestone
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-300 dark:bg-gray-600"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    {new Date(event.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- 3. KOMPONEN UTAMA ---
const InteractiveHealthPlanner: React.FC = () => {
  const initializer = (
    initialState: HealthPlannerState
  ): HealthPlannerState => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return { ...getInitialState(), ...parsed };
      }
      return initialState;
    } catch {
      return initialState;
    }
  };

  const [state, dispatch] = useReducer(
    plannerReducer,
    getInitialState(),
    initializer
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleReset = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin mereset semua progres? Aksi ini tidak bisa dibatalkan."
      )
    ) {
      dispatch({ type: "RESET_PROGRESS" });
    }
  };

  return (
    <section id="health-planner" className="py-20 bg-gray-100 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <TrendingUp className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
            Perencana Kesehatan Interaktif Anda
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Ambil kendali, selesaikan misi, dan bangun versi diri Anda yang
            lebih sehat.
          </p>
        </div>

        <Dashboard state={state} onReset={handleReset} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MissionControl state={state} dispatch={dispatch} />
          </div>
          <div className="space-y-6">
            <HealthTips vitals={state.vitals} symptoms={state.symptoms} />
            {/* Add more sidebar components */}
          </div>
        </div>
        <Timeline events={state.timelineEvents} />
      </div>
    </section>
  );
};

export default InteractiveHealthPlanner;
