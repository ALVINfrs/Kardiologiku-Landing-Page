// Ganti nama file menjadi -> src/components/landing/InteractiveHealthPlanner.tsx

import React, { useReducer, useEffect, useState } from "react";
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

// Tipe Data
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
  badgeIcon: React.ElementType; // Menggunakan ElementType agar bisa dilewatkan sebagai komponen
  category: "Diet" | "Aktivitas" | "Edukasi";
};

type UserMission = {
  missionId: string;
  startDate: string;
  tasks: Record<string, boolean>; // { taskId: isCompleted }
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

type HealthPlannerState = {
  xp: number;
  level: number;
  activeMissions: UserMission[];
  completedMissions: string[];
  timelineEvents: TimelineEvent[];
};

type Action =
  | { type: "START_MISSION"; payload: Mission }
  | { type: "TOGGLE_TASK"; payload: { missionId: string; taskId: string } }
  | { type: "RESET_PROGRESS" };

// Data Misi yang Tersedia
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

const LOCAL_STORAGE_KEY = "interactiveHealthPlannerState_v2";

// Reducer untuk State Management
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
        <div className="flex flex-col items-center justify-center">
          <HeartPulse className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-3xl font-bold">{xp}</p>
          <p className="text-sm text-gray-500">Total Poin Kesehatan (XP)</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Award className="h-10 w-10 text-yellow-500 mb-2" />
          <p className="text-3xl font-bold">{completedMissions.length}</p>
          <p className="text-sm text-gray-500">Lencana Diterima</p>
          <div className="flex gap-2 mt-2">
            {availableMissions
              .filter((m) => completedMissions.includes(m.id))
              .map((mission) => {
                const BadgeIcon = mission.badgeIcon;
                return (
                  <TooltipProvider key={mission.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-1 border rounded-full bg-gray-100 dark:bg-gray-700">
                          <BadgeIcon className="h-6 w-6" />
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

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4">Kontrol Misi</h3>
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
              const BadgeIcon = mission.badgeIcon;

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
                const BadgeIcon = mission.badgeIcon;
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
              const Icon = event.icon; // **FIX DI SINI**
              return (
                <motion.div
                  key={event.id}
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <MissionControl state={state} dispatch={dispatch} />
        <div className="mt-12">
          <Timeline events={state.timelineEvents} />
        </div>
      </div>
    </section>
  );
};

export default InteractiveHealthPlanner;
