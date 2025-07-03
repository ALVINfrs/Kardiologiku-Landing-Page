import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Activity,
  Shield,
  Pill,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Timer,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Medication {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  details: string;
  drugs: string[];
  mechanism: string;
  sideEffects: string[];
  effectiveness: number;
}

interface Procedure {
  id: string;
  name: string;
  color: string;
  description: string;
  successRate: number;
  duration: string;
  recovery: string;
  risks: string[];
}

interface ECGPoint {
  x: number;
  y: number;
}

interface ArrhythmiaType {
  id: string;
  name: string;
  displayName: string;
  heartRate: number;
  color: string;
  severity: "normal" | "warning" | "danger";
  description: string;
}

const ObatTerapiSection = () => {
  const [activeTab, setActiveTab] = useState<string>("obat");
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [heartAnimation, setHeartAnimation] = useState<boolean>(true);
  const [currentRhythm, setCurrentRhythm] = useState<string>("normal");
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [ecgData, setEcgData] = useState<ECGPoint[]>([]);

  const arrhythmiaTypes: ArrhythmiaType[] = [
    {
      id: "normal",
      name: "Normal Sinus",
      displayName: "Normal",
      heartRate: 75,
      color: "#10b981",
      severity: "normal",
      description: "Ritme jantung normal",
    },
    {
      id: "atrial_fib",
      name: "Atrial Fibrillation",
      displayName: "A-Fib",
      heartRate: 95,
      color: "#f59e0b",
      severity: "warning",
      description: "Fibrilasi atrium",
    },
    {
      id: "tachycardia",
      name: "Supraventricular Tachycardia",
      displayName: "SVT",
      heartRate: 180,
      color: "#ef4444",
      severity: "danger",
      description: "Takikardia supraventrikular",
    },
    {
      id: "vtach",
      name: "Ventricular Tachycardia",
      displayName: "VT",
      heartRate: 200,
      color: "#dc2626",
      severity: "danger",
      description: "Takikardia ventrikular",
    },
    {
      id: "vfib",
      name: "Ventricular Fibrillation",
      displayName: "V-Fib",
      heartRate: 300,
      color: "#991b1b",
      severity: "danger",
      description: "Fibrilasi ventrikular",
    },
    {
      id: "pvc",
      name: "Premature Ventricular Contractions",
      displayName: "PVC",
      heartRate: 85,
      color: "#f97316",
      severity: "warning",
      description: "Kontraksi ventrikular prematur",
    },
    {
      id: "brugada",
      name: "Brugada Syndrome",
      displayName: "Brugada",
      heartRate: 70,
      color: "#8b5cf6",
      severity: "danger",
      description: "Sindrom Brugada",
    },
    {
      id: "bradycardia",
      name: "Bradycardia",
      displayName: "Brady",
      heartRate: 45,
      color: "#3b82f6",
      severity: "warning",
      description: "Bradikardia",
    },
    {
      id: "heart_block",
      name: "Complete Heart Block",
      displayName: "CHB",
      heartRate: 35,
      color: "#6366f1",
      severity: "danger",
      description: "Blok jantung total",
    },
  ];

  const currentArrhythmia =
    arrhythmiaTypes.find((arr) => arr.id === currentRhythm) ||
    arrhythmiaTypes[0];

  // Generate ECG data based on rhythm type
  useEffect(() => {
    const generateECG = (): ECGPoint[] => {
      const points: ECGPoint[] = [];
      const basePoints = 200;

      for (let i = 0; i < basePoints; i++) {
        let y = 50;
        const x = (i / basePoints) * 100;
        const cycle = i % 40;

        switch (currentRhythm) {
          case "normal":
            // Normal sinus rhythm
            if (cycle === 8) y = 45; // P wave
            if (cycle === 15) y = 20; // Q wave
            if (cycle === 16) y = 80; // R wave
            if (cycle === 17) y = 30; // S wave
            if (cycle === 22) y = 60; // T wave
            break;

          case "atrial_fib":
            // Atrial fibrillation - irregular baseline, no P waves
            y = 50 + Math.sin(i * 0.8) * 8 + (Math.random() - 0.5) * 15;
            if (Math.random() > 0.75) {
              y = 80; // Irregular QRS
            }
            break;

          case "tachycardia": {
            // SVT - fast regular rhythm
            const fastCycle = i % 15;
            if (fastCycle === 5) y = 45; // P wave
            if (fastCycle === 8) y = 20; // Q wave
            if (fastCycle === 9) y = 85; // R wave
            if (fastCycle === 10) y = 25; // S wave
            if (fastCycle === 12) y = 60; // T wave
            break;
          }

          case "vtach": {
            // Ventricular tachycardia - wide QRS, no P waves
            const vtCycle = i % 12;
            if (vtCycle >= 3 && vtCycle <= 7) {
              y = 50 + Math.sin(((vtCycle - 3) * Math.PI) / 4) * 40;
            }
            break;
          }

          case "vfib":
            // Ventricular fibrillation - chaotic
            y =
              50 +
              Math.sin(i * 2.5) * 25 +
              Math.sin(i * 1.3) * 15 +
              (Math.random() - 0.5) * 30;
            break;

          case "pvc":
            // PVC - normal rhythm with premature beats
            if (cycle === 8) y = 45; // P wave
            if (cycle === 15) y = 20; // Q wave
            if (cycle === 16) y = 80; // R wave
            if (cycle === 17) y = 30; // S wave
            if (cycle === 22) y = 60; // T wave
            // Add PVC every 6th beat
            if (i % 60 === 45) {
              y = 90; // Wide QRS of PVC
            }
            break;

          case "brugada":
            // Brugada - characteristic ST elevation in V1-V3
            if (cycle === 8) y = 45; // P wave
            if (cycle === 15) y = 20; // Q wave
            if (cycle === 16) y = 80; // R wave
            if (cycle === 17) y = 30; // S wave
            if (cycle >= 18 && cycle <= 20) y = 65; // ST elevation
            if (cycle === 22) y = 40; // Inverted T wave
            break;

          case "bradycardia": {
            // Bradycardia - slow rhythm
            const slowCycle = i % 80;
            if (slowCycle === 15) y = 45; // P wave
            if (slowCycle === 30) y = 20; // Q wave
            if (slowCycle === 32) y = 80; // R wave
            if (slowCycle === 34) y = 30; // S wave
            if (slowCycle === 45) y = 60; // T wave
            break;
          }

          case "heart_block": {
            // Complete heart block - P waves and QRS independent
            const pCycle = i % 25;
            const qrsCycle = i % 60;
            if (pCycle === 5 || pCycle === 15) y = 45; // P waves
            if (qrsCycle === 20) y = 20; // Q wave
            if (qrsCycle === 22) y = 80; // R wave
            if (qrsCycle === 24) y = 30; // S wave
            if (qrsCycle === 35) y = 60; // T wave
            break;
          }
        }

        points.push({ x, y });
      }
      return points;
    };

    setEcgData(generateECG());
  }, [currentRhythm]);

  const medications: Medication[] = [
    {
      id: "antiarrhythmic",
      name: "Antiaritmia",
      icon: Pill,
      color: "blue",
      description: "Obat pengatur irama jantung",
      details: "Mengatur aktivitas listrik jantung untuk menormalkan irama",
      drugs: ["Amiodarone", "Flecainide", "Propafenone"],
      mechanism: "Memblokir saluran ion natrium dan kalium",
      sideEffects: ["Mual", "Pusing", "Gangguan penglihatan"],
      effectiveness: 85,
    },
    {
      id: "beta_blocker",
      name: "Beta Blocker",
      icon: Heart,
      color: "red",
      description: "Perlambat detak jantung",
      details: "Memblokir efek adrenalin untuk mengurangi detak jantung",
      drugs: ["Metoprolol", "Bisoprolol", "Carvedilol"],
      mechanism: "Memblokir reseptor beta-adrenergik",
      sideEffects: ["Kelelahan", "Sesak napas", "Kaki dingin"],
      effectiveness: 78,
    },
    {
      id: "anticoagulant",
      name: "Antikoagulan",
      icon: Shield,
      color: "green",
      description: "Pencegah penggumpalan darah",
      details: "Mengurangi risiko stroke dengan mencegah pembentukan gumpalan",
      drugs: ["Warfarin", "Dabigatran", "Rivaroxaban"],
      mechanism: "Menghambat faktor pembekuan darah",
      sideEffects: ["Perdarahan", "Memar", "Gusi berdarah"],
      effectiveness: 92,
    },
    {
      id: "calcium_blocker",
      name: "Calcium Channel Blocker",
      icon: Activity,
      color: "purple",
      description: "Relaksasi pembuluh darah",
      details: "Mengendurkan otot jantung dan pembuluh darah",
      drugs: ["Verapamil", "Diltiazem", "Amlodipine"],
      mechanism: "Memblokir saluran kalsium",
      sideEffects: ["Pembengkakan kaki", "Konstipasi", "Pusing"],
      effectiveness: 73,
    },
  ];

  const procedures: Procedure[] = [
    {
      id: "ablation",
      name: "Ablasi Kateter",
      color: "red",
      description:
        "Prosedur minimal invasif untuk menghancurkan jaringan jantung yang menyebabkan aritmia.",
      successRate: 85,
      duration: "2-4 jam",
      recovery: "1-2 hari",
      risks: ["Perdarahan", "Infeksi", "Kerusakan pembuluh darah"],
    },
    {
      id: "pacemaker",
      name: "Alat Pacu Jantung",
      color: "blue",
      description:
        "Perangkat kecil yang ditanamkan untuk membantu mengatur irama jantung.",
      successRate: 95,
      duration: "1-2 jam",
      recovery: "3-5 hari",
      risks: ["Infeksi", "Perdarahan", "Kerusakan saraf"],
    },
    {
      id: "icd",
      name: "ICD (Implantable Cardioverter Defibrillator)",
      color: "green",
      description:
        "Alat yang dapat mendeteksi dan mengatasi aritmia berbahaya secara otomatis.",
      successRate: 98,
      duration: "1-3 jam",
      recovery: "2-4 hari",
      risks: ["Infeksi", "Malposisi lead", "Pneumotoraks"],
    },
    {
      id: "cardioversion",
      name: "Kardioversi",
      color: "purple",
      description:
        "Prosedur untuk mengembalikan irama jantung normal menggunakan kejutan listrik.",
      successRate: 90,
      duration: "< 1 jam",
      recovery: "Beberapa jam",
      risks: ["Luka bakar ringan pada kulit", "Gumpalan darah", "Aritmia lain"],
    },
    {
      id: "maze_procedure",
      name: "Operasi Maze",
      color: "orange",
      description:
        "Operasi terbuka untuk menciptakan jalur baru bagi sinyal listrik jantung.",
      successRate: 80,
      duration: "3-6 jam",
      recovery: "4-6 minggu",
      risks: ["Risiko operasi jantung terbuka", "Perdarahan", "Stroke"],
    },
    {
      id: "lifestyle_modification",
      name: "Modifikasi Gaya Hidup",
      color: "teal",
      description:
        "Pola makan sehat, olahraga teratur, dan manajemen stres sebagai fondasi pengobatan.",
      successRate: 70, // Merepresentasikan tingkat keberhasilan dalam mengelola gejala
      duration: "Seumur hidup",
      recovery: "Berkelanjutan",
      risks: ["Memerlukan disiplin tinggi", "Hasil bervariasi antar individu"],
    },
  ];

  const RealisticHeartAnimation = () => (
    <div className="relative w-64 h-64 mx-auto">
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Heart outline - more realistic shape */}
        <motion.path
          d="M120,200 C120,200 40,130 40,80 C40,50 65,25 95,25 C105,25 115,30 120,40 C125,30 135,25 145,25 C175,25 200,50 200,80 C200,130 120,200 120,200 Z"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Right Atrium */}
        <motion.path
          d="M145,60 C160,55 175,65 175,80 C175,95 160,105 145,100 C140,85 140,70 145,60 Z"
          fill="rgba(59, 130, 246, 0.4)"
          stroke="#3b82f6"
          strokeWidth="2"
          animate={{
            fill:
              currentArrhythmia.severity === "danger"
                ? "rgba(239, 68, 68, 0.6)"
                : "rgba(59, 130, 246, 0.4)",
            scale: heartAnimation ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration:
              currentRhythm === "tachycardia"
                ? 0.3
                : currentRhythm === "bradycardia"
                ? 2
                : 0.8,
            repeat: heartAnimation ? Infinity : 0,
            delay: 0.1,
          }}
        />

        {/* Left Atrium */}
        <motion.path
          d="M95,60 C80,55 65,65 65,80 C65,95 80,105 95,100 C100,85 100,70 95,60 Z"
          fill="rgba(59, 130, 246, 0.4)"
          stroke="#3b82f6"
          strokeWidth="2"
          animate={{
            fill:
              currentArrhythmia.severity === "danger"
                ? "rgba(239, 68, 68, 0.6)"
                : "rgba(59, 130, 246, 0.4)",
            scale: heartAnimation ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration:
              currentRhythm === "tachycardia"
                ? 0.3
                : currentRhythm === "bradycardia"
                ? 2
                : 0.8,
            repeat: heartAnimation ? Infinity : 0,
            delay: 0.1,
          }}
        />

        {/* Right Ventricle */}
        <motion.path
          d="M145,100 C165,95 185,110 185,140 C185,170 165,185 145,180 C140,150 140,125 145,100 Z"
          fill="rgba(239, 68, 68, 0.4)"
          stroke="#ef4444"
          strokeWidth="2"
          animate={{
            fill:
              currentArrhythmia.id === "vtach" ||
              currentArrhythmia.id === "vfib"
                ? "rgba(239, 68, 68, 0.8)"
                : "rgba(239, 68, 68, 0.4)",
            scale: heartAnimation ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration:
              currentRhythm === "tachycardia"
                ? 0.3
                : currentRhythm === "bradycardia"
                ? 2
                : 0.8,
            repeat: heartAnimation ? Infinity : 0,
            delay: 0.2,
          }}
        />

        {/* Left Ventricle */}
        <motion.path
          d="M95,100 C75,95 55,110 55,140 C55,170 75,185 95,180 C100,150 100,125 95,100 Z"
          fill="rgba(239, 68, 68, 0.4)"
          stroke="#ef4444"
          strokeWidth="2"
          animate={{
            fill:
              currentArrhythmia.id === "vtach" ||
              currentArrhythmia.id === "vfib"
                ? "rgba(239, 68, 68, 0.8)"
                : "rgba(239, 68, 68, 0.4)",
            scale: heartAnimation ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration:
              currentRhythm === "tachycardia"
                ? 0.3
                : currentRhythm === "bradycardia"
                ? 2
                : 0.8,
            repeat: heartAnimation ? Infinity : 0,
            delay: 0.2,
          }}
        />

        {/* Septum */}
        <motion.line
          x1="120"
          y1="100"
          x2="120"
          y2="180"
          stroke="#6b7280"
          strokeWidth="3"
          animate={{
            stroke:
              currentArrhythmia.id === "heart_block" ? "#dc2626" : "#6b7280",
          }}
        />

        {/* Conduction System - SA Node */}
        <motion.circle
          cx="160"
          cy="70"
          r="4"
          fill="#fbbf24"
          animate={{
            r: heartAnimation ? [4, 6, 4] : 4,
            fill: currentArrhythmia.id === "atrial_fib" ? "#ef4444" : "#fbbf24",
          }}
          transition={{
            duration:
              currentRhythm === "tachycardia"
                ? 0.3
                : currentRhythm === "bradycardia"
                ? 2
                : 0.8,
            repeat: heartAnimation ? Infinity : 0,
          }}
        />

        {/* AV Node */}
        <motion.circle
          cx="120"
          cy="100"
          r="3"
          fill="#f59e0b"
          animate={{
            r: heartAnimation ? [3, 5, 3] : 3,
            fill:
              currentArrhythmia.id === "heart_block" ? "#dc2626" : "#f59e0b",
          }}
          transition={{
            duration:
              currentRhythm === "tachycardia"
                ? 0.3
                : currentRhythm === "bradycardia"
                ? 2
                : 0.8,
            repeat: heartAnimation ? Infinity : 0,
            delay: 0.1,
          }}
        />

        {/* Bundle of His */}
        <motion.line
          x1="120"
          y1="105"
          x2="120"
          y2="120"
          stroke="#f59e0b"
          strokeWidth="3"
          animate={{
            stroke:
              currentArrhythmia.id === "heart_block" ? "#dc2626" : "#f59e0b",
          }}
        />

        {/* Left Bundle Branch */}
        <motion.path
          d="M120,120 L100,140 L80,160"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          animate={{
            stroke:
              currentArrhythmia.id === "heart_block" ? "#dc2626" : "#f59e0b",
          }}
        />

        {/* Right Bundle Branch */}
        <motion.path
          d="M120,120 L140,140 L160,160"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          animate={{
            stroke:
              currentArrhythmia.id === "heart_block" ? "#dc2626" : "#f59e0b",
          }}
        />

        {/* Electrical impulse animation */}
        <AnimatePresence>
          {heartAnimation && (
            <motion.circle
              cx="160"
              cy="70"
              r="3"
              fill="#fbbf24"
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 2, 0],
                opacity: [1, 0.5, 0],
              }}
              transition={{
                duration:
                  currentRhythm === "tachycardia"
                    ? 0.3
                    : currentRhythm === "bradycardia"
                    ? 2
                    : 0.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}
        </AnimatePresence>

        {/* Coronary arteries */}
        <motion.path
          d="M120,40 Q140,50 160,70 M120,40 Q100,50 80,70"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          opacity="0.6"
          animate={{
            opacity: heartAnimation ? [0.6, 1, 0.6] : 0.6,
          }}
          transition={{
            duration:
              currentRhythm === "tachycardia"
                ? 0.3
                : currentRhythm === "bradycardia"
                ? 2
                : 0.8,
            repeat: heartAnimation ? Infinity : 0,
          }}
        />

        {/* Anatomical labels */}
        <text
          x="175"
          y="65"
          fontSize="10"
          fill="#374151"
          className="font-semibold"
        >
          SA
        </text>
        <text
          x="125"
          y="95"
          fontSize="10"
          fill="#374151"
          className="font-semibold"
        >
          AV
        </text>
        <text
          x="50"
          y="75"
          fontSize="10"
          fill="#374151"
          className="font-semibold"
        >
          LA
        </text>
        <text
          x="185"
          y="75"
          fontSize="10"
          fill="#374151"
          className="font-semibold"
        >
          RA
        </text>
        <text
          x="50"
          y="145"
          fontSize="10"
          fill="#374151"
          className="font-semibold"
        >
          LV
        </text>
        <text
          x="185"
          y="145"
          fontSize="10"
          fill="#374151"
          className="font-semibold"
        >
          RV
        </text>
      </svg>

      {/* Advanced heart rate indicator */}
      <motion.div
        className="absolute top-2 right-2 px-3 py-2 rounded-full text-sm font-bold text-white shadow-lg"
        style={{ backgroundColor: currentArrhythmia.color }}
        animate={{
          backgroundColor: currentArrhythmia.color,
          scale: heartAnimation ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration:
            currentRhythm === "tachycardia"
              ? 0.3
              : currentRhythm === "bradycardia"
              ? 2
              : 0.8,
          repeat: heartAnimation ? Infinity : 0,
        }}
      >
        <div className="flex items-center space-x-1">
          <Heart className="h-4 w-4" />
          <span>{currentArrhythmia.heartRate}</span>
        </div>
        <div className="text-xs text-center opacity-90">BPM</div>
      </motion.div>

      {/* Severity indicator */}
      <motion.div
        className="absolute top-2 left-2 p-2 rounded-full text-white shadow-lg"
        style={{ backgroundColor: currentArrhythmia.color }}
      >
        {currentArrhythmia.severity === "normal" && (
          <CheckCircle className="h-4 w-4" />
        )}
        {currentArrhythmia.severity === "warning" && (
          <AlertTriangle className="h-4 w-4" />
        )}
        {currentArrhythmia.severity === "danger" && (
          <XCircle className="h-4 w-4" />
        )}
      </motion.div>
    </div>
  );

  const ECGDisplay = () => (
    <div className="bg-black p-4 rounded-lg border-2 border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-green-400 text-sm font-mono font-bold">
          ECG Monitor - {currentArrhythmia.name}
        </span>
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentArrhythmia.color }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
          />
          <span className="text-xs" style={{ color: currentArrhythmia.color }}>
            {currentArrhythmia.displayName}
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-400 mb-2">
        {currentArrhythmia.description}
      </div>
      <svg viewBox="0 0 100 100" className="w-full h-20 bg-gray-900 rounded">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="2" height="2" patternUnits="userSpaceOnUse">
            <path
              d="M 2 0 L 0 0 0 2"
              fill="none"
              stroke="#166534"
              strokeWidth="0.1"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* ECG trace */}
        <motion.polyline
          points={ecgData.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="none"
          stroke={currentArrhythmia.color}
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Baseline */}
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="#166534"
          strokeWidth="0.2"
          opacity="0.5"
        />
      </svg>

      <div className="flex justify-between items-center mt-2 text-xs">
        <span className="text-gray-400">Speed: 25mm/s</span>
        <span className="text-gray-400">Gain: 10mm/mV</span>
      </div>
    </div>
  );

  return (
    <section
      id="obat-terapi"
      className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Obat & Terapi Aritmia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Panduan lengkap pengobatan dan terapi untuk berbagai jenis gangguan
            irama jantung
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Heart Animation Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="h-full shadow-xl border-2 border-blue-100">
              <CardHeader className="text-center bg-gradient-to-r from-red-50 to-pink-50">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  <span>Anatomi & Konduksi Jantung</span>
                </CardTitle>
                <CardDescription>
                  Visualisasi real-time struktur jantung dan sistem konduksi
                  listrik
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <RealisticHeartAnimation />

                <div className="grid grid-cols-3 gap-2">
                  {arrhythmiaTypes.map((arrhythmia) => (
                    <motion.button
                      key={arrhythmia.id}
                      onClick={() => setCurrentRhythm(arrhythmia.id)}
                      className={`px-2 py-1 text-xs rounded-md font-semibold transition-all duration-200 ${
                        currentRhythm === arrhythmia.id
                          ? "text-white shadow-md"
                          : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                      }`}
                      style={{
                        backgroundColor:
                          currentRhythm === arrhythmia.id
                            ? arrhythmia.color
                            : undefined,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {arrhythmia.displayName}
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <motion.button
                    onClick={() => setHeartAnimation(!heartAnimation)}
                    className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {heartAnimation ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentRhythm("normal")}
                    className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details & Treatment Section */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ECGDisplay />

            <Card className="shadow-xl border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Pill className="h-6 w-6 text-purple-600" />
                  <span>Opsi Perawatan</span>
                </CardTitle>
                <CardDescription>
                  Pilih antara obat-obatan atau prosedur medis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="obat">Obat-obatan</TabsTrigger>
                    <TabsTrigger value="terapi">Prosedur</TabsTrigger>
                  </TabsList>
                  <TabsContent value="obat">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {medications.map((med) => (
                        <motion.div
                          key={med.id}
                          onClick={() => {
                            setSelectedMedication(med);
                            setShowDetails(true);
                          }}
                          whileHover={{ scale: 1.03, y: -5 }}
                          className="cursor-pointer"
                        >
                          <Card className="h-full hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-3">
                                <med.icon
                                  className={`h-6 w-6 text-${med.color}-500`}
                                />
                                <span>{med.name}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600">
                                {med.description}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="terapi">
                    <div className="space-y-4 mt-4">
                      {procedures.map((proc) => (
                        <Card key={proc.id} className="bg-gray-50">
                          <CardHeader>
                            <CardTitle>{proc.name}</CardTitle>
                            <CardDescription>
                              {proc.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <CheckCircle
                                className={`h-5 w-5 text-${proc.color}-500`}
                              />
                              <div>
                                <p className="font-semibold">Tingkat Sukses</p>
                                <p>{proc.successRate}%</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Timer
                                className={`h-5 w-5 text-${proc.color}-500`}
                              />
                              <div>
                                <p className="font-semibold">Durasi</p>
                                <p>{proc.duration}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp
                                className={`h-5 w-5 text-${proc.color}-500`}
                              />
                              <div>
                                <p className="font-semibold">Pemulihan</p>
                                <p>{proc.recovery}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <AlertTriangle
                                className={`h-5 w-5 text-${proc.color}-500`}
                              />
                              <div>
                                <p className="font-semibold">Risiko Utama</p>
                                <p>{proc.risks[0]}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <AnimatePresence>
          {showDetails && selectedMedication && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 space-y-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  <XCircle className="h-8 w-8" />
                </button>

                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-full bg-${selectedMedication.color}-100`}
                  >
                    <selectedMedication.icon
                      className={`h-10 w-10 text-${selectedMedication.color}-600`}
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">
                      {selectedMedication.name}
                    </h3>
                    <p className="text-gray-500">
                      {selectedMedication.details}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-gray-700">
                      Contoh Obat
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMedication.drugs.map((drug) => (
                        <Badge
                          key={drug}
                          variant="secondary"
                          className="text-sm"
                        >
                          {drug}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-gray-700">
                      Mekanisme Kerja
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedMedication.mechanism}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2 text-gray-700">
                    Efek Samping Umum
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {selectedMedication.sideEffects.map((effect) => (
                      <li key={effect}>{effect}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2 text-gray-700">
                    Tingkat Efektivitas
                  </h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <motion.div
                        className={`h-4 rounded-full bg-${selectedMedication.color}-500`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${selectedMedication.effectiveness}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <span
                      className={`font-bold text-lg text-${selectedMedication.color}-600`}
                    >
                      {selectedMedication.effectiveness}%
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ObatTerapiSection;
