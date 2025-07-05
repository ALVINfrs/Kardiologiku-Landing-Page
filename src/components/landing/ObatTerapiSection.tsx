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
  note: string;
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
      name: "Normal Sinus Rhythm",
      displayName: "Normal",
      heartRate: 75,
      color: "#10b981",
      severity: "normal",
      description:
        "Ritme sinus normal dengan gelombang P, QRS, dan T yang teratur.",
      note: "Heart Rate: 75 BPM (regular)",
    },
    {
      id: "atrial_fib",
      name: "Atrial Fibrillation",
      displayName: "A-Fib",
      heartRate: 95,
      color: "#f59e0b",
      severity: "warning",
      description:
        "Fibrilasi atrium, ritme tidak teratur dan kacau dari atrium tanpa gelombang P yang jelas.",
      note: "Heart Rate: 95 BPM (irregular)",
    },
    {
      id: "atrial_flutter",
      name: "Atrial Flutter",
      displayName: "A-Flutter",
      heartRate: 150,
      color: "#f97316",
      severity: "warning",
      description:
        "Ritme atrium cepat dengan pola 'gigi gergaji' (sawtooth) pada EKG.",
      note: "Heart Rate: 150 BPM (regular or variable)",
    },
    {
      id: "tachycardia",
      name: "Supraventricular Tachycardia",
      displayName: "SVT",
      heartRate: 180,
      color: "#ef4444",
      severity: "danger",
      description:
        "Takikardia supraventrikular, ritme atrium sangat cepat dan teratur.",
      note: "Heart Rate: 180 BPM (regular)",
    },
    {
      id: "vtach",
      name: "Ventricular Tachycardia",
      displayName: "VT",
      heartRate: 200,
      color: "#dc2626",
      severity: "danger",
      description:
        "Takikardia ventrikular, irama ventrikel cepat dan berpotensi mematikan.",
      note: "Heart Rate: 200 BPM (usually regular)",
    },
    {
      id: "vfib",
      name: "Ventricular Fibrillation",
      displayName: "V-Fib",
      heartRate: 300,
      color: "#991b1b",
      severity: "danger",
      description:
        "Fibrilasi ventrikular, aktivitas listrik kacau tanpa kontraksi efektif (henti jantung).",
      note: "Heart Rate: 300 BPM (chaotic)",
    },
    {
      id: "torsades",
      name: "Torsades de Pointes",
      displayName: "Torsades",
      heartRate: 250,
      color: "#c026d3",
      severity: "danger",
      description: "V-Tach polimorfik dengan pola 'berputar' pada sumbu QRS.",
      note: "Heart Rate: 250 BPM (polymorphic)",
    },
    {
      id: "pvc",
      name: "Premature Ventricular Contractions",
      displayName: "PVC",
      heartRate: 85,
      color: "#f97316",
      severity: "warning",
      description:
        "Kontraksi ventrikular prematur, denyut ekstra yang mengganggu ritme normal.",
      note: "Heart Rate: 85 BPM (with ectopic beats)",
    },
    {
      id: "bradycardia",
      name: "Bradycardia",
      displayName: "Brady",
      heartRate: 45,
      color: "#3b82f6",
      severity: "warning",
      description:
        "Bradikardia, ritme sinus lebih lambat dari normal (<60 BPM).",
      note: "Heart Rate: 45 BPM (regular)",
    },
    {
      id: "ist",
      name: "Inappropriate Sinus Tachycardia",
      displayName: "IST",
      heartRate: 115,
      color: "#f43f5e",
      severity: "warning",
      description:
        "Takikardia sinus yang terjadi tanpa penyebab fisiologis jelas.",
      note: "Heart Rate: 115 BPM (regular)",
    },
    {
      id: "heart_block",
      name: "Complete Heart Block",
      displayName: "CHB",
      heartRate: 35,
      color: "#6366f1",
      severity: "danger",
      description:
        "Blok jantung total, tidak ada hubungan antara aktivitas atrium dan ventrikel.",
      note: "Heart Rate: 35 BPM (escape rhythm)",
    },
    {
      id: "first_degree_av",
      name: "1st Degree AV Block",
      displayName: "1° AV Block",
      heartRate: 65,
      color: "#2563eb",
      severity: "warning",
      description:
        "Blok AV derajat pertama dengan interval PR memanjang secara konsisten (>200 ms).",
      note: "Heart Rate: 65 BPM (regular)",
    },
    {
      id: "mobitz_i",
      name: "2nd Degree AV Block, Mobitz I (Wenckebach)",
      displayName: "Mobitz I",
      heartRate: 50,
      color: "#4f46e5",
      severity: "warning",
      description:
        "Interval PR bertambah secara progresif hingga satu kompleks QRS tidak muncul.",
      note: "Heart Rate: 50 BPM (regularly irregular)",
    },
    {
      id: "mobitz_ii",
      name: "2nd Degree AV Block, Mobitz II",
      displayName: "Mobitz II",
      heartRate: 40,
      color: "#7c3aed",
      severity: "danger",
      description:
        "Kompleks QRS menghilang secara tiba-tiba tanpa pemanjangan PR sebelumnya.",
      note: "Heart Rate: 40 BPM (irregular)",
    },
    {
      id: "junctional",
      name: "Junctional Rhythm",
      displayName: "Junctional",
      heartRate: 50,
      color: "#1d4ed8",
      severity: "warning",
      description:
        "Ritme dari AV node, gelombang P bisa absen atau muncul setelah QRS.",
      note: "Heart Rate: 50 BPM (regular)",
    },
    {
      id: "wpw",
      name: "Wolff-Parkinson-White Syndrome",
      displayName: "WPW",
      heartRate: 80,
      color: "#059669",
      severity: "danger",
      description:
        "Jalur listrik ekstra menyebabkan gelombang delta dan interval PR yang pendek.",
      note: "Heart Rate: 80 BPM (may be rapid or irregular)",
    },
    {
      id: "brugada",
      name: "Brugada Syndrome",
      displayName: "Brugada",
      heartRate: 70,
      color: "#8b5cf6",
      severity: "danger",
      description:
        "Sindrom genetik dengan pola ST elevasi khas di V1-V3, risiko henti jantung mendadak.",
      note: "Heart Rate: 70 BPM (can vary, often normal)",
    },
    {
      id: "asystole",
      name: "Asystole",
      displayName: "Asystole",
      heartRate: 0,
      color: "#4b5563",
      severity: "danger",
      description:
        "Tidak ada aktivitas listrik jantung (flatline), merupakan keadaan henti jantung total.",
      note: "Heart Rate: 0 BPM (no activity)",
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
          case "ist": {
            const fastCycle = i % 25; // Faster than normal, but sinus shape
            if (fastCycle === 6) y = 45; // P wave
            if (fastCycle === 12) y = 20; // Q wave
            if (fastCycle === 13) y = 80; // R wave
            if (fastCycle === 14) y = 30; // S wave
            if (fastCycle === 18) y = 60; // T wave
            break;
          }
          case "atrial_flutter": {
            const flutterCycle = i % 10;
            y = 50 - Math.abs(flutterCycle - 5) * 4; // Sawtooth baseline
            const qrsCycle = i % 40; // 4:1 block
            if (qrsCycle > 15 && qrsCycle < 20) {
              if (qrsCycle === 16) y = 80;
              if (qrsCycle === 17) y = 30;
            }
            break;
          }
          case "torsades": {
            const amplitude = 30 + Math.sin(i * 0.05) * 20;
            y = 50 + Math.sin(i * 0.7) * amplitude;
            break;
          }
          case "asystole":
            y = 50 + (Math.random() - 0.5) * 1.5; // Flatline with minor noise
            break;
          case "first_degree_av": {
            const cycle = i % 40;
            if (cycle === 5) y = 45; // P wave
            if (cycle === 20) y = 20; // QRS (PR interval is long)
            if (cycle === 21) y = 80;
            if (cycle === 22) y = 30;
            if (cycle === 28) y = 60; // T wave
            break;
          }
          case "mobitz_i": {
            const bigCycle = i % 160; // 4 beats cycle
            if (bigCycle < 40) {
              // Beat 1: PR = 5
              if (bigCycle === 8) y = 45;
              if (bigCycle === 13) y = 20;
              if (bigCycle === 14) y = 80;
            } else if (bigCycle < 80) {
              // Beat 2: PR = 8
              if (bigCycle === 48) y = 45;
              if (bigCycle === 56) y = 20;
              if (bigCycle === 57) y = 80;
            } else if (bigCycle < 120) {
              // Beat 3: PR = 11
              if (bigCycle === 88) y = 45;
              if (bigCycle === 99) y = 20;
              if (bigCycle === 100) y = 80;
            } else {
              // Beat 4: Dropped beat
              if (bigCycle === 128) y = 45; // Only P wave
            }
            break;
          }
          case "mobitz_ii": {
            const bigCycle = i % 120; // 3 beats cycle, 3:2 block
            if (bigCycle < 80) {
              // Beat 1 and 2 are normal
              const cycle = bigCycle % 40;
              if (cycle === 8) y = 45;
              if (cycle === 15) y = 20;
              if (cycle === 16) y = 80;
            } else {
              // Beat 3 is dropped
              if (bigCycle === 88) y = 45; // Only P wave
            }
            break;
          }
          case "junctional": {
            const slowCycle = i % 60;
            if (slowCycle === 30) y = 20;
            if (slowCycle === 32) y = 80;
            if (slowCycle === 34) y = 30;
            if (slowCycle === 36) y = 60; // Inverted P-wave after QRS
            break;
          }
          case "wpw": {
            const cycle = i % 40;
            if (cycle === 8) y = 45; // P wave
            if (cycle >= 12 && cycle < 15) y = 50 - (cycle - 11) * 10; // Delta wave
            if (cycle === 15) y = 80; // R wave
            if (cycle === 16) y = 30; // S wave
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

  const RealisticHeartAnimation = ({
    currentArrhythmia,
    heartAnimation,
  }: {
    currentArrhythmia: {
      id: string;
      name: string;
      displayName: string;
      heartRate: number;
      color: string;
      severity: "normal" | "warning" | "danger";
      description: string;
    };
    heartAnimation: boolean;
    currentRhythm: string;
  }) => (
    <div className="relative w-64 h-64 mx-auto">
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Heart outline - adjusted for realistic shape */}
        <motion.path
          d="M120,200 C120,200 30,130 30,80 C30,50 60,25 95,25 C105,25 115,30 120,40 C125,30 135,25 150,25 C180,25 210,50 210,80 C210,130 120,200 120,200 Z"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Gradient for chamber depth */}
        <defs>
          <linearGradient
            id="chamberGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#ef4444", stopOpacity: 0.8 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#b91c1c", stopOpacity: 0.6 }}
            />
          </linearGradient>
          <linearGradient
            id="atriumGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#3b82f6", stopOpacity: 0.6 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#1e40af", stopOpacity: 0.4 }}
            />
          </linearGradient>
        </defs>

        {/* Right Atrium - larger for realism */}
        <motion.path
          d="M150,60 C160,55 180,65 180,80 C180,95 165,105 150,100 C145,85 145,70 150,60 Z"
          fill={
            ["atrial_fib", "atrial_flutter", "ist", "torsades"].includes(
              currentArrhythmia.id
            )
              ? "url(#atriumGradient)"
              : "url(#atriumGradient)"
          }
          stroke="#3b82f6"
          strokeWidth="2"
          style={{ filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))" }}
          animate={{
            scale: heartAnimation
              ? [
                  1,
                  currentArrhythmia.id === "tachycardia" ||
                  currentArrhythmia.id === "ist" ||
                  currentArrhythmia.id === "atrial_flutter"
                    ? 1.15
                    : currentArrhythmia.id === "bradycardia"
                    ? 0.9
                    : currentArrhythmia.id === "atrial_fib"
                    ? 1.1 + (Math.random() - 0.5) * 0.2
                    : 1.1,
                  1,
                ]
              : 1,
            opacity: currentArrhythmia.id === "asystole" ? 0.2 : 1,
          }}
          transition={{
            duration:
              currentArrhythmia.id === "tachycardia" ||
              currentArrhythmia.id === "ist" ||
              currentArrhythmia.id === "atrial_flutter"
                ? 0.3
                : currentArrhythmia.id === "bradycardia"
                ? 2
                : currentArrhythmia.id === "torsades"
                ? 0.4
                : currentArrhythmia.id === "atrial_fib"
                ? 0.5 + (Math.random() - 0.5) * 0.2
                : 0.8,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? Infinity
                : 0,
            delay: 0.1,
            times:
              currentArrhythmia.id === "atrial_fib" ? [0, 0.5, 1] : undefined,
          }}
        />

        {/* Left Atrium - smaller than right atrium */}
        <motion.path
          d="M90,60 C75,55 60,65 60,80 C60,95 75,105 90,100 C95,85 95,70 90,60 Z"
          fill={
            ["atrial_fib", "atrial_flutter", "ist", "torsades"].includes(
              currentArrhythmia.id
            )
              ? "url(#atriumGradient)"
              : "url(#atriumGradient)"
          }
          stroke="#3b82f6"
          strokeWidth="2"
          style={{ filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))" }}
          animate={{
            scale: heartAnimation
              ? [
                  1,
                  currentArrhythmia.id === "tachycardia" ||
                  currentArrhythmia.id === "ist" ||
                  currentArrhythmia.id === "atrial_flutter"
                    ? 1.15
                    : currentArrhythmia.id === "bradycardia"
                    ? 0.9
                    : currentArrhythmia.id === "atrial_fib"
                    ? 1.1 + (Math.random() - 0.5) * 0.2
                    : 1.1,
                  1,
                ]
              : 1,
            opacity: currentArrhythmia.id === "asystole" ? 0.2 : 1,
          }}
          transition={{
            duration:
              currentArrhythmia.id === "tachycardia" ||
              currentArrhythmia.id === "ist" ||
              currentArrhythmia.id === "atrial_flutter"
                ? 0.3
                : currentArrhythmia.id === "bradycardia"
                ? 2
                : currentArrhythmia.id === "torsades"
                ? 0.4
                : currentArrhythmia.id === "atrial_fib"
                ? 0.5 + (Math.random() - 0.5) * 0.2
                : 0.8,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? Infinity
                : 0,
            delay: 0.1,
            times:
              currentArrhythmia.id === "atrial_fib" ? [0, 0.5, 1] : undefined,
          }}
        />

        {/* Right Ventricle - smaller and thinner */}
        <motion.path
          d="M150,100 C165,95 175,110 175,140 C175,170 160,185 145,180 C140,150 140,125 150,100 Z"
          fill={
            ["vtach", "vfib", "pvc", "torsades"].includes(currentArrhythmia.id)
              ? "url(#chamberGradient)"
              : "url(#chamberGradient)"
          }
          stroke="#ef4444"
          strokeWidth="2"
          style={{ filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))" }}
          animate={{
            scale: heartAnimation
              ? [
                  1,
                  currentArrhythmia.id === "tachycardia" ||
                  currentArrhythmia.id === "vtach" ||
                  currentArrhythmia.id === "vfib"
                    ? 1.25 +
                      (currentArrhythmia.id === "vfib"
                        ? (Math.random() - 0.5) * 0.3
                        : 0)
                    : currentArrhythmia.id === "bradycardia"
                    ? 0.85
                    : currentArrhythmia.id === "brugada"
                    ? 1.2 + (Math.random() - 0.5) * 0.1
                    : 1.2,
                  1,
                ]
              : 1,
            opacity:
              currentArrhythmia.id === "vfib"
                ? [0.8, 1, 0.8]
                : currentArrhythmia.id === "pvc"
                ? [1, 1.3, 1]
                : currentArrhythmia.id === "bradycardia"
                ? [1, 0.8, 1]
                : 1,
          }}
          transition={{
            duration:
              currentArrhythmia.id === "tachycardia" ||
              currentArrhythmia.id === "vtach"
                ? 0.3
                : currentArrhythmia.id === "bradycardia"
                ? 2
                : currentArrhythmia.id === "vfib"
                ? 0.25
                : currentArrhythmia.id === "pvc"
                ? 0.8
                : currentArrhythmia.id === "torsades"
                ? 0.4
                : 0.8,
            times: currentArrhythmia.id === "pvc" ? [0, 0.2, 0.4] : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? currentArrhythmia.id === "pvc"
                  ? Infinity
                  : Infinity
                : 0,
            delay: currentArrhythmia.id === "pvc" ? Math.random() * 2 : 0.2,
          }}
        />

        {/* Left Ventricle - larger and thicker */}
        <motion.path
          d="M90,100 C65,95 40,110 40,140 C40,170 65,185 90,180 C95,150 95,125 90,100 Z"
          fill={
            ["vtach", "vfib", "pvc", "torsades"].includes(currentArrhythmia.id)
              ? "url(#chamberGradient)"
              : "url(#chamberGradient)"
          }
          stroke="#ef4444"
          strokeWidth="3"
          style={{ filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))" }}
          animate={{
            scale: heartAnimation
              ? [
                  1,
                  currentArrhythmia.id === "tachycardia" ||
                  currentArrhythmia.id === "vtach" ||
                  currentArrhythmia.id === "vfib"
                    ? 1.25 +
                      (currentArrhythmia.id === "vfib"
                        ? (Math.random() - 0.5) * 0.3
                        : 0)
                    : currentArrhythmia.id === "bradycardia"
                    ? 0.85
                    : currentArrhythmia.id === "brugada"
                    ? 1.2 + (Math.random() - 0.5) * 0.1
                    : 1.2,
                  1,
                ]
              : 1,
            opacity:
              currentArrhythmia.id === "vfib"
                ? [0.8, 1, 0.8]
                : currentArrhythmia.id === "pvc"
                ? [1, 1.3, 1]
                : currentArrhythmia.id === "bradycardia"
                ? [1, 0.8, 1]
                : 1,
          }}
          transition={{
            duration:
              currentArrhythmia.id === "tachycardia" ||
              currentArrhythmia.id === "vtach"
                ? 0.3
                : currentArrhythmia.id === "bradycardia"
                ? 2
                : currentArrhythmia.id === "vfib"
                ? 0.25
                : currentArrhythmia.id === "pvc"
                ? 0.8
                : currentArrhythmia.id === "torsades"
                ? 0.4
                : 0.8,
            times: currentArrhythmia.id === "pvc" ? [0, 0.2, 0.4] : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? currentArrhythmia.id === "pvc"
                  ? Infinity
                  : Infinity
                : 0,
            delay: currentArrhythmia.id === "pvc" ? Math.random() * 2 : 0.2,
          }}
        />

        {/* Mitral Valve - simple animation */}
        <motion.line
          x1="90"
          y1="100"
          x2="90"
          y2="110"
          stroke="#dc2626"
          strokeWidth="2"
          animate={{
            y2:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? [110, 105, 110]
                : 110,
          }}
          transition={{
            duration:
              currentArrhythmia.id === "tachycardia" ||
              currentArrhythmia.id === "vtach"
                ? 0.3
                : currentArrhythmia.id === "bradycardia"
                ? 2
                : currentArrhythmia.id === "vfib"
                ? 0.25
                : currentArrhythmia.id === "pvc"
                ? 0.8
                : currentArrhythmia.id === "torsades"
                ? 0.4
                : 0.8,
            times: currentArrhythmia.id === "pvc" ? [0, 0.2, 0.4] : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? Infinity
                : 0,
          }}
        />

        {/* Aortic Valve */}
        <motion.line
          x1="90"
          y1="40"
          x2="90"
          y2="50"
          stroke="#dc2626"
          strokeWidth="2"
          animate={{
            y2:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? [50, 45, 50]
                : 50,
          }}
          transition={{
            duration:
              currentArrhythmia.id === "tachycardia" ||
              currentArrhythmia.id === "vtach"
                ? 0.3
                : currentArrhythmia.id === "bradycardia"
                ? 2
                : currentArrhythmia.id === "vfib"
                ? 0.25
                : currentArrhythmia.id === "pvc"
                ? 0.8
                : currentArrhythmia.id === "torsades"
                ? 0.4
                : 0.8,
            times: currentArrhythmia.id === "pvc" ? [0, 0.2, 0.4] : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? Infinity
                : 0,
            delay: 0.1,
          }}
        />

        {/* WPW Accessory Pathway */}
        <motion.path
          d="M160,70 Q140,90 120,120"
          fill="none"
          stroke={currentArrhythmia.id === "wpw" ? "#059669" : "transparent"}
          strokeWidth="2"
          animate={{
            stroke: currentArrhythmia.id === "wpw" ? "#059669" : "transparent",
            opacity: currentArrhythmia.id === "wpw" ? [0.6, 1, 0.6] : 0,
          }}
          transition={{
            duration: currentArrhythmia.id === "wpw" ? 0.6 : 0.8,
            times: currentArrhythmia.id === "wpw" ? [0, 0.5, 1] : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id === "wpw" ? Infinity : 0,
          }}
        >
          {currentArrhythmia.id === "wpw" && (
            <motion.circle
              cx="160"
              cy="70"
              r="2"
              fill="#059669"
              initial={{ cx: 160, cy: 70 }}
              animate={{ cx: [160, 120, 80], cy: [70, 100, 120] }}
              transition={{
                duration: 0.6,
                times: [0, 0.5, 1],
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}
        </motion.path>

        {/* Septum - thicker wall */}
        <motion.path
          d="M120,100 C118,100 118,180 120,180"
          fill="none"
          stroke={
            [
              "heart_block",
              "first_degree_av",
              "mobitz_i",
              "mobitz_ii",
            ].includes(currentArrhythmia.id)
              ? "#dc2626"
              : "#6b7280"
          }
          strokeWidth="4"
          animate={{
            stroke:
              currentArrhythmia.id === "asystole"
                ? "#4b5563"
                : [
                    "heart_block",
                    "first_degree_av",
                    "mobitz_i",
                    "mobitz_ii",
                  ].includes(currentArrhythmia.id)
                ? "#dc2626"
                : "#6b7280",
            scale: ["heart_block", "mobitz_i", "mobitz_ii"].includes(
              currentArrhythmia.id
            )
              ? [1, 1.05, 1]
              : 1,
          }}
          transition={{
            duration: 0.8,
            times: ["heart_block", "mobitz_i", "mobitz_ii"].includes(
              currentArrhythmia.id
            )
              ? [0, 0.5, 1]
              : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? Infinity
                : 0,
          }}
        />

        {/* Conduction System - SA Node */}
        <motion.circle
          cx="160"
          cy="70"
          r="4"
          fill={
            ["atrial_fib", "atrial_flutter", "ist"].includes(
              currentArrhythmia.id
            )
              ? "#ef4444"
              : currentArrhythmia.id === "asystole"
              ? "#4b5563"
              : "#fbbf24"
          }
          animate={{
            r: heartAnimation
              ? [
                  4,
                  currentArrhythmia.id === "tachycardia" ||
                  currentArrhythmia.id === "ist" ||
                  currentArrhythmia.id === "atrial_flutter"
                    ? 6
                    : 5,
                  4,
                ]
              : 4,
            opacity: currentArrhythmia.id === "asystole" ? 0.2 : 1,
          }}
          transition={{
            duration:
              currentArrhythmia.id === "tachycardia" ||
              currentArrhythmia.id === "ist"
                ? 0.3
                : currentArrhythmia.id === "bradycardia"
                ? 2
                : currentArrhythmia.id === "atrial_flutter"
                ? 0.5
                : currentArrhythmia.id === "asystole"
                ? 0
                : 0.8,
            times:
              currentArrhythmia.id === "tachycardia" ||
              currentArrhythmia.id === "ist" ||
              currentArrhythmia.id === "atrial_flutter"
                ? [0, 0.5, 1]
                : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? Infinity
                : 0,
          }}
        />

        {/* AV Node */}
        <motion.circle
          cx="120"
          cy="100"
          r="3"
          fill={
            [
              "heart_block",
              "first_degree_av",
              "mobitz_i",
              "mobitz_ii",
              "junctional",
            ].includes(currentArrhythmia.id)
              ? "#dc2626"
              : currentArrhythmia.id === "asystole"
              ? "#4b5563"
              : "#f59e0b"
          }
          animate={{
            r: heartAnimation
              ? [
                  3,
                  currentArrhythmia.id === "tachycardia" ||
                  currentArrhythmia.id === "junctional" ||
                  currentArrhythmia.id === "first_degree_av"
                    ? 5
                    : 4,
                  3,
                ]
              : 3,
            opacity:
              currentArrhythmia.id === "mobitz_ii"
                ? [1, 0.5, 1]
                : currentArrhythmia.id === "asystole"
                ? 0.2
                : 1,
          }}
          transition={{
            duration:
              currentArrhythmia.id === "tachycardia"
                ? 0.3
                : currentArrhythmia.id === "bradycardia"
                ? 2
                : currentArrhythmia.id === "junctional"
                ? 1.2
                : currentArrhythmia.id === "first_degree_av"
                ? 1
                : currentArrhythmia.id === "mobitz_i"
                ? 1 // Menggunakan nilai tunggal untuk menghindari error
                : currentArrhythmia.id === "mobitz_ii"
                ? 0.8
                : 0.8,
            times:
              currentArrhythmia.id === "mobitz_i"
                ? [0.8, 1, 1.2].map((d) => d / 2) // Normalisasi array untuk kompatibilitas
                : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? Infinity
                : 0,
            delay: currentArrhythmia.id === "first_degree_av" ? 0.2 : 0.1,
          }}
        />

        {/* Bundle of His */}
        <motion.line
          x1="120"
          y1="105"
          x2="120"
          y2="120"
          stroke={
            [
              "heart_block",
              "first_degree_av",
              "mobitz_i",
              "mobitz_ii",
            ].includes(currentArrhythmia.id)
              ? "#dc2626"
              : currentArrhythmia.id === "asystole"
              ? "#4b5563"
              : "#f59e0b"
          }
          strokeWidth="3"
        />

        {/* Left Bundle Branch with Purkinje Fibers */}
        <motion.path
          d="M120,120 L100,140 L80,160 M80,160 L70,165 M80,160 L85,165"
          fill="none"
          stroke={
            currentArrhythmia.id === "brugada"
              ? "#f97316"
              : [
                  "heart_block",
                  "first_degree_av",
                  "mobitz_i",
                  "mobitz_ii",
                ].includes(currentArrhythmia.id)
              ? "#dc2626"
              : currentArrhythmia.id === "asystole"
              ? "#4b5563"
              : "#f59e0b"
          }
          strokeWidth="2"
          animate={{
            y:
              currentArrhythmia.id === "brugada"
                ? [140, 130, 140]
                : ["heart_block", "mobitz_i", "mobitz_ii"].includes(
                    currentArrhythmia.id
                  )
                ? [140, 145, 140]
                : 140,
          }}
          transition={{
            duration:
              currentArrhythmia.id === "brugada"
                ? 1
                : currentArrhythmia.id === "mobitz_ii"
                ? 0.8
                : 0.8,
            times:
              currentArrhythmia.id === "brugada" ||
              ["mobitz_i", "mobitz_ii"].includes(currentArrhythmia.id)
                ? [0, 0.5, 1]
                : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? Infinity
                : 0,
          }}
        />

        {/* Right Bundle Branch with Purkinje Fibers */}
        <motion.path
          d="M120,120 L140,140 L160,160 M160,160 L155,165 M160,160 L165,165"
          fill="none"
          stroke={
            currentArrhythmia.id === "brugada"
              ? "#f97316"
              : [
                  "heart_block",
                  "first_degree_av",
                  "mobitz_i",
                  "mobitz_ii",
                ].includes(currentArrhythmia.id)
              ? "#dc2626"
              : currentArrhythmia.id === "asystole"
              ? "#4b5563"
              : "#f59e0b"
          }
          strokeWidth="2"
          animate={{
            y:
              currentArrhythmia.id === "brugada"
                ? [140, 130, 140]
                : ["heart_block", "mobitz_i", "mobitz_ii"].includes(
                    currentArrhythmia.id
                  )
                ? [140, 145, 140]
                : 140,
          }}
          transition={{
            duration:
              currentArrhythmia.id === "brugada"
                ? 1
                : currentArrhythmia.id === "mobitz_ii"
                ? 0.8
                : 0.8,
            times:
              currentArrhythmia.id === "brugada" ||
              ["mobitz_i", "mobitz_ii"].includes(currentArrhythmia.id)
                ? [0, 0.5, 1]
                : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? Infinity
                : 0,
          }}
        />

        {/* Electrical impulse animation - multiple impulses for A-Fib and VFib */}
        <AnimatePresence>
          {heartAnimation && currentArrhythmia.id !== "asystole" && (
            <>
              <motion.circle
                cx="160"
                cy="70"
                r="3"
                fill={
                  ["atrial_fib", "atrial_flutter", "ist"].includes(
                    currentArrhythmia.id
                  )
                    ? "#ef4444"
                    : currentArrhythmia.id === "torsades"
                    ? "#c026d3"
                    : currentArrhythmia.id === "vtach" ||
                      currentArrhythmia.id === "vfib"
                    ? "#ef4444"
                    : currentArrhythmia.id === "pvc"
                    ? "#ef4444"
                    : currentArrhythmia.id === "junctional"
                    ? "#f59e0b"
                    : "#fbbf24"
                }
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 2, 0],
                  opacity: [1, 0.5, 0],
                  cx:
                    currentArrhythmia.id === "wpw"
                      ? [160, 120, 80]
                      : currentArrhythmia.id === "torsades"
                      ? [120, 130, 120, 110]
                      : currentArrhythmia.id === "atrial_fib"
                      ? [160, 150 + (Math.random() - 0.5) * 20, 160]
                      : currentArrhythmia.id === "vtach" ||
                        currentArrhythmia.id === "vfib"
                      ? [80, 80, 80]
                      : currentArrhythmia.id === "pvc"
                      ? [80 + (Math.random() - 0.5) * 20, 80, 80]
                      : currentArrhythmia.id === "junctional"
                      ? [120, 80, 80]
                      : [160, 120, 80],
                  cy:
                    currentArrhythmia.id === "wpw"
                      ? [70, 100, 160]
                      : currentArrhythmia.id === "torsades"
                      ? [140, 150, 140, 130]
                      : currentArrhythmia.id === "atrial_fib"
                      ? [70, 70 + (Math.random() - 0.5) * 20, 70]
                      : currentArrhythmia.id === "vtach" ||
                        currentArrhythmia.id === "vfib"
                      ? [160, 160, 160]
                      : currentArrhythmia.id === "pvc"
                      ? [160 + (Math.random() - 0.5) * 20, 160, 160]
                      : currentArrhythmia.id === "junctional"
                      ? [100, 160, 160]
                      : [70, 100, 160],
                  rotate: currentArrhythmia.id === "torsades" ? [0, 360] : 0,
                }}
                transition={{
                  duration:
                    currentArrhythmia.id === "tachycardia" ||
                    currentArrhythmia.id === "vtach"
                      ? 0.3
                      : currentArrhythmia.id === "bradycardia"
                      ? 2
                      : currentArrhythmia.id === "atrial_flutter"
                      ? 0.5
                      : currentArrhythmia.id === "torsades"
                      ? 0.4
                      : currentArrhythmia.id === "wpw"
                      ? 0.6
                      : currentArrhythmia.id === "atrial_fib"
                      ? 0.5 + (Math.random() - 0.5) * 0.2
                      : currentArrhythmia.id === "vfib"
                      ? 0.25
                      : currentArrhythmia.id === "pvc"
                      ? 0.8
                      : currentArrhythmia.id === "junctional"
                      ? 1.2
                      : currentArrhythmia.id === "first_degree_av"
                      ? 1
                      : currentArrhythmia.id === "mobitz_i"
                      ? 1 // Menggunakan nilai tunggal
                      : currentArrhythmia.id === "mobitz_ii"
                      ? 0.8
                      : 0.8,
                  times:
                    currentArrhythmia.id === "mobitz_i"
                      ? [0.8, 1, 1.2].map((d) => d / 2)
                      : currentArrhythmia.id === "torsades"
                      ? [0, 0.25, 0.5, 0.75]
                      : undefined,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay:
                    currentArrhythmia.id === "first_degree_av"
                      ? 0.2
                      : currentArrhythmia.id === "mobitz_ii" &&
                        Math.random() > 0.7
                      ? 0
                      : 0.1,
                }}
              />
              {/* Additional impulses for A-Fib and VFib */}
              {currentArrhythmia.id === "atrial_fib" && (
                <>
                  <motion.circle
                    cx="160"
                    cy="70"
                    r="2"
                    fill="#ef4444"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [1, 0.5, 0],
                      cx: [160, 150 + (Math.random() - 0.5) * 20, 160],
                      cy: [70, 70 + (Math.random() - 0.5) * 20, 70],
                    }}
                    transition={{
                      duration: 0.5 + (Math.random() - 0.5) * 0.2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.2,
                    }}
                  />
                  <motion.circle
                    cx="160"
                    cy="70"
                    r="2"
                    fill="#ef4444"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [1, 0.5, 0],
                      cx: [160, 150 + (Math.random() - 0.5) * 20, 160],
                      cy: [70, 70 + (Math.random() - 0.5) * 20, 70],
                    }}
                    transition={{
                      duration: 0.5 + (Math.random() - 0.5) * 0.2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                  />
                </>
              )}
              {currentArrhythmia.id === "vfib" && (
                <>
                  <motion.circle
                    cx="80"
                    cy="160"
                    r="2"
                    fill="#ef4444"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [1, 0.5, 0],
                      cx: [80, 80 + (Math.random() - 0.5) * 20, 80],
                      cy: [160, 160 + (Math.random() - 0.5) * 20, 160],
                    }}
                    transition={{
                      duration: 0.25,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.2,
                    }}
                  />
                  <motion.circle
                    cx="80"
                    cy="160"
                    r="2"
                    fill="#ef4444"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [1, 0.5, 0],
                      cx: [80, 80 + (Math.random() - 0.5) * 20, 80],
                      cy: [160, 160 + (Math.random() - 0.5) * 20, 160],
                    }}
                    transition={{
                      duration: 0.25,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                  />
                </>
              )}
              {/* Torsades spiral path */}
              {currentArrhythmia.id === "torsades" && (
                <motion.circle
                  cx="120"
                  cy="140"
                  r="2"
                  fill="#c026d3"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [1, 0.5, 0],
                    cx: [120, 130, 120, 110],
                    cy: [140, 130, 140, 150],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 0.4,
                    times: [0, 0.25, 0.5, 0.75],
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.2,
                  }}
                />
              )}
            </>
          )}
        </AnimatePresence>

        {/* Coronary arteries - more complex */}
        <motion.path
          d="M120,40 Q140,50 160,70 Q170,75 180,80 M120,40 Q100,50 80,70 Q70,75 60,80"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          animate={{
            opacity: heartAnimation ? [0.6, 1, 0.6] : 0.6,
            strokeDasharray: heartAnimation ? ["0 100", "100 0"] : "0 100",
          }}
          transition={{
            duration:
              currentArrhythmia.id === "tachycardia" ||
              currentArrhythmia.id === "vtach"
                ? 0.3
                : currentArrhythmia.id === "bradycardia"
                ? 2
                : currentArrhythmia.id === "atrial_flutter"
                ? 0.5
                : currentArrhythmia.id === "torsades"
                ? 0.4
                : 0.8,
            times:
              currentArrhythmia.id === "tachycardia" ? [0, 0.5, 1] : undefined,
            repeat:
              heartAnimation && currentArrhythmia.id !== "asystole"
                ? Infinity
                : 0,
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

        {/* Flatline effect for asystole */}
        {currentArrhythmia.id === "asystole" && (
          <motion.line
            x1="0"
            y1="220"
            x2="240"
            y2="220"
            stroke="#4b5563"
            strokeWidth="2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </svg>

      {/* Advanced heart rate indicator with EKG-like pulse */}
      <motion.div
        className="absolute top-2 right-2 px-3 py-2 rounded-full text-sm font-bold text-white shadow-lg"
        style={{ backgroundColor: currentArrhythmia.color }}
        animate={{
          backgroundColor: currentArrhythmia.color,
          scale:
            heartAnimation && currentArrhythmia.id !== "asystole"
              ? [1, 1.05, 1]
              : currentArrhythmia.id === "asystole"
              ? 0.5
              : 1,
          opacity: heartAnimation ? [0.8, 1, 0.8] : 1,
        }}
        transition={{
          duration:
            currentArrhythmia.id === "tachycardia" ||
            currentArrhythmia.id === "vtach"
              ? 0.3
              : currentArrhythmia.id === "bradycardia"
              ? 2
              : currentArrhythmia.id === "atrial_flutter"
              ? 0.5
              : currentArrhythmia.id === "torsades"
              ? 0.4
              : 0.8,
          times:
            currentArrhythmia.id === "tachycardia" ? [0, 0.5, 1] : undefined,
          repeat:
            heartAnimation && currentArrhythmia.id !== "asystole"
              ? Infinity
              : 0,
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
        {currentArrhythmia.note && (
          <p className="text-muted-foreground">{currentArrhythmia.note}</p>
        )}
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
                <RealisticHeartAnimation
                  currentArrhythmia={currentArrhythmia}
                  heartAnimation={heartAnimation}
                  currentRhythm={currentRhythm}
                />

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
