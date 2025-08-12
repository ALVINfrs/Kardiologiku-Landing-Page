import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Coffee,
  Zap,
  Moon,
  Footprints,
  BrainCircuit,
  HeartPulse,
  Shield,
  Wind,
  User,
  Activity,
  Cigarette,
  Wine,
  Dumbbell,
  Apple,
  Pill,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
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
import { Progress } from "@/components/ui/progress";
import { Tooltip as ReactTooltip } from "react-tooltip";

// --- TIPE DATA & STRUKTUR YANG LEBIH KOMPLEKS ---
type BaselineProfile =
  | "healthy"
  | "pvc_prone"
  | "afib_prone"
  | "hypertensive"
  | "athlete"
  | "post_mi";
type EKGPattern =
  | "normal"
  | "sinus_tachy"
  | "sinus_brady"
  | "pvc_single"
  | "pvc_multiple"
  | "afib_short_run"
  | "afib_persistent"
  | "aflutter"
  | "vtach"
  | "heart_block";

interface VitalSigns {
  bpm: number;
  stability: number; // 0-100%
  ekg: EKGPattern;
  bloodPressure: { systolic: number; diastolic: number };
  oxygenSat: number; // 0-100%
  arrhythmiaRisk: number; // 0-100%
}

interface Trigger {
  id: string;
  name: string;
  icon: React.ElementType;
  category:
    | "stimulant"
    | "exercise"
    | "relaxation"
    | "diet"
    | "medication"
    | "vice";
  impact: (
    vitals: VitalSigns,
    baseline: BaselineProfile
  ) => Partial<VitalSigns>;
  duration: number; // in seconds
  description: string; // Edukasi deskripsi
  riskFactors: string[]; // Faktor risiko edukatif
}

interface HistoryEntry {
  timestamp: number;
  bpm: number;
  stability: number;
  ekg: EKGPattern;
  bloodPressure: { systolic: number; diastolic: number };
  oxygenSat: number;
}

// --- DATABASE EKG PATHS YANG LEBIH KOMPLEKS & REALISTIS ---
const EKG_DATA_GENERATORS: Record<
  EKGPattern,
  (length: number) => { x: number; y: number }[]
> = {
  normal: (len) =>
    Array.from({ length: len }, (_, i) => {
      const cycle = i % 40;
      let y = 0;
      if (cycle === 0) y = 0; // P wave start
      if (cycle === 5) y = 10; // P peak
      if (cycle === 10) y = 0;
      if (cycle === 15) y = -5; // Q
      if (cycle === 16) y = 30; // R
      if (cycle === 17) y = -10; // S
      if (cycle === 25) y = 15; // T
      if (cycle === 30) y = 0;
      return { x: i, y: y + (Math.random() - 0.5) * 2 }; // Noise
    }),
  sinus_tachy: (len) =>
    Array.from({ length: len }, (_, i) => {
      const cycle = i % 25;
      let y = 0;
      if (cycle === 0) y = 0;
      if (cycle === 3) y = 8;
      if (cycle === 6) y = 0;
      if (cycle === 9) y = -4;
      if (cycle === 10) y = 25;
      if (cycle === 11) y = -8;
      if (cycle === 16) y = 12;
      if (cycle === 19) y = 0;
      return { x: i, y: y + (Math.random() - 0.5) * 1.5 };
    }),
  sinus_brady: (len) =>
    Array.from({ length: len }, (_, i) => {
      const cycle = i % 60;
      let y = 0;
      if (cycle === 0) y = 0;
      if (cycle === 8) y = 12;
      if (cycle === 16) y = 0;
      if (cycle === 24) y = -6;
      if (cycle === 25) y = 35;
      if (cycle === 26) y = -12;
      if (cycle === 40) y = 18;
      if (cycle === 48) y = 0;
      return { x: i, y: y + (Math.random() - 0.5) * 3 };
    }),
  pvc_single: (len) =>
    Array.from({ length: len }, (_, i) => {
      const cycle = i % 120;
      let y = 0;
      if (cycle < 40) {
        // Normal beat
        if (cycle === 5) y = 10;
        if (cycle === 15) y = -5;
        if (cycle === 16) y = 30;
        if (cycle === 17) y = -10;
        if (cycle === 25) y = 15;
      } else if (cycle >= 40 && cycle < 80) {
        // PVC
        if (cycle === 45) y = -15; // Wide QRS
        if (cycle === 50) y = 40;
        if (cycle === 55) y = -20;
        if (cycle === 65) y = 10; // Aberrant T
      } else {
        // Compensatory pause + normal
        if (cycle === 85) y = 10;
        if (cycle === 95) y = -5;
        if (cycle === 96) y = 30;
        if (cycle === 97) y = -10;
        if (cycle === 105) y = 15;
      }
      return { x: i, y };
    }),
  pvc_multiple: (len) =>
    Array.from({ length: len }, (_, i) => {
      const cycle = i % 80;
      let y = 0;
      if (cycle < 40) {
        // PVC 1
        if (cycle === 5) y = -15;
        if (cycle === 10) y = 40;
        if (cycle === 15) y = -20;
        if (cycle === 25) y = 10;
      } else {
        // PVC 2
        if (cycle === 45) y = -18;
        if (cycle === 50) y = 45;
        if (cycle === 55) y = -25;
        if (cycle === 65) y = 12;
      }
      return { x: i, y };
    }),
  afib_short_run: (len) =>
    Array.from({ length: len }, (_, i) => ({
      x: i,
      y:
        Math.sin(i * 0.3) * 5 + // Fibrillatory waves
        (Math.random() > 0.95 ? (Math.random() - 0.5) * 20 : 0) + // Irregular QRS
        (Math.random() - 0.5) * 3, // Noise
    })),
  afib_persistent: (len) =>
    Array.from({ length: len }, (_, i) => ({
      x: i,
      y:
        Math.sin(i * 0.4) * 4 +
        Math.cos(i * 0.7) * 3 +
        (Math.random() > 0.9 ? (Math.random() - 0.5) * 25 : 0) +
        (Math.random() - 0.5) * 4,
    })),
  aflutter: (len) =>
    Array.from({ length: len }, (_, i) => {
      const cycle = i % 20;
      let y = Math.sin((cycle * Math.PI * 2) / 20) * 5; // Sawtooth
      if (i % 60 === 30) y += 25; // QRS every 3 flutters
      if (i % 60 === 31) y += -10;
      return { x: i, y };
    }),
  vtach: (len) =>
    Array.from({ length: len }, (_, i) => {
      const cycle = i % 30;
      let y = 0;
      if (cycle === 0) y = -20; // Wide complex
      if (cycle === 5) y = 50;
      if (cycle === 10) y = -25;
      if (cycle === 20) y = 15; // Discordant T
      return { x: i, y: y + (Math.random() - 0.5) * 5 };
    }),
  heart_block: (len) =>
    Array.from({ length: len }, (_, i) => {
      const cycle = i % 80;
      let y = 0;
      if (cycle % 20 === 0) y = 10; // P wave
      if (cycle % 20 === 5) y = 0;
      if (cycle % 40 === 20) {
        // Dropped QRS every other
        y = -5;
        if (cycle % 40 === 21) y = 30;
        if (cycle % 40 === 22) y = -10;
        if (cycle % 40 === 30) y = 15;
      }
      return { x: i, y };
    }),
};

// --- SUB-KOMPONEN EKG VISUAL YANG LEBIH ADVANCED ---
const EKGVisual: React.FC<{ pattern: EKGPattern; bpm: number }> = ({
  pattern,
  bpm,
}) => {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const dataLength = 300; // Lebih panjang untuk detail

  useEffect(() => {
    const generateData = EKG_DATA_GENERATORS[pattern];
    setData(generateData(dataLength));
  }, [pattern]);

  const animationDuration =
    bpm > 0 ? (60 / bpm) * (dataLength / 40) * 1000 : 5000;

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <AnimatePresence>
        <motion.div
          key={pattern}
          className="w-full h-full"
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            duration: animationDuration / 1000,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <ResponsiveContainer width="200%" height="100%">
            <LineChart
              data={data.concat(data)}
              margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
            >
              <CartesianGrid stroke="#333" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- KOMPONEN UTAMA YANG SUPER KOMPLEKS, INTERAKTIF & EDUKATIF ---
const LifestyleImpactSimulator: React.FC = () => {
  const [baseline, setBaseline] = useState<BaselineProfile>("healthy");
  const [vitals, setVitals] = useState<VitalSigns>({
    bpm: 70,
    stability: 100,
    ekg: "normal",
    bloodPressure: { systolic: 120, diastolic: 80 },
    oxygenSat: 98,
    arrhythmiaRisk: 0,
  });
  const [activeTriggers, setActiveTriggers] = useState<
    Map<string, NodeJS.Timeout>
  >(new Map());
  const [stressLevel, setStressLevel] = useState(0); // 0-100
  const [sleepHours, setSleepHours] = useState(8); // 0-12
  const [exerciseMinutes, setExerciseMinutes] = useState(0); // 0-120
  const [dietQuality, setDietQuality] = useState(50); // 0-100
  const [aiInsight, setAiInsight] = useState<React.ReactNode>(
    "Pilih profil jantung dan berikan pemicu untuk memulai simulasi. Gunakan tab edukasi untuk belajar lebih lanjut."
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [healthScore, setHealthScore] = useState(100); // Skor gamification
  const [achievements, setAchievements] = useState<string[]>([]);
  const tickInterval = useRef<NodeJS.Timeout | null>(null);

  const baselineVitals = useMemo<Record<BaselineProfile, VitalSigns>>(
    () => ({
      healthy: {
        bpm: 70,
        stability: 100,
        ekg: "normal",
        bloodPressure: { systolic: 120, diastolic: 80 },
        oxygenSat: 98,
        arrhythmiaRisk: 0,
      },
      pvc_prone: {
        bpm: 75,
        stability: 85,
        ekg: "normal",
        bloodPressure: { systolic: 125, diastolic: 82 },
        oxygenSat: 97,
        arrhythmiaRisk: 20,
      },
      afib_prone: {
        bpm: 80,
        stability: 75,
        ekg: "normal",
        bloodPressure: { systolic: 130, diastolic: 85 },
        oxygenSat: 96,
        arrhythmiaRisk: 40,
      },
      hypertensive: {
        bpm: 85,
        stability: 70,
        ekg: "sinus_tachy",
        bloodPressure: { systolic: 150, diastolic: 95 },
        oxygenSat: 95,
        arrhythmiaRisk: 30,
      },
      athlete: {
        bpm: 55,
        stability: 95,
        ekg: "sinus_brady",
        bloodPressure: { systolic: 110, diastolic: 70 },
        oxygenSat: 99,
        arrhythmiaRisk: 5,
      },
      post_mi: {
        bpm: 90,
        stability: 60,
        ekg: "normal",
        bloodPressure: { systolic: 140, diastolic: 90 },
        oxygenSat: 94,
        arrhythmiaRisk: 50,
      },
    }),
    []
  );

  const triggers = useMemo<Trigger[]>(
    () => [
      {
        id: "coffee",
        name: "Minum Kopi",
        icon: Coffee,
        category: "stimulant",
        duration: 10,
        impact: (v, b) => ({
          bpm: v.bpm + (b === "pvc_prone" ? 20 : 10),
          stability: v.stability - (b === "pvc_prone" ? 25 : 10),
          ekg: b === "pvc_prone" ? "pvc_single" : "sinus_tachy",
          arrhythmiaRisk: v.arrhythmiaRisk + 10,
        }),
        description:
          "Kafein meningkatkan kadar adrenalin, yang dapat mempercepat detak jantung dan memicu PVC pada individu rentan.",
        riskFactors: ["Dehidrasi", "Interaksi dengan obat", "Gangguan tidur"],
      },
      {
        id: "energy_drink",
        name: "Minuman Energi",
        icon: Zap,
        category: "stimulant",
        duration: 15,
        impact: (v, b) => ({
          bpm: v.bpm + (b === "afib_prone" ? 40 : 25),
          stability: v.stability - (b === "afib_prone" ? 40 : 20),
          ekg: b === "afib_prone" ? "afib_short_run" : "pvc_multiple",
          bloodPressure: {
            systolic: v.bloodPressure.systolic + 15,
            diastolic: v.bloodPressure.diastolic + 10,
          },
          arrhythmiaRisk: v.arrhythmiaRisk + 20,
        }),
        description:
          "Kombinasi kafein tinggi dan gula dapat menyebabkan takikardia dan meningkatkan risiko AFib pada pasien rentan.",
        riskFactors: ["Palpitasi", "Kecemasan", "Ketergantungan"],
      },
      {
        id: "sprint",
        name: "Lari Sprint",
        icon: Footprints,
        category: "exercise",
        duration: 8,
        impact: (v, b) => ({
          bpm: v.bpm + (b === "athlete" ? 60 : 80),
          ekg: b === "post_mi" ? "vtach" : "sinus_tachy",
          oxygenSat: v.oxygenSat - (b === "post_mi" ? 5 : 2),
          arrhythmiaRisk:
            b === "post_mi" ? v.arrhythmiaRisk + 30 : v.arrhythmiaRisk + 5,
        }),
        description:
          "Olahraga intens meningkatkan kebutuhan oksigen, tetapi pada pasien pasca-MI dapat memicu ventrikular takikardia.",
        riskFactors: ["Cedera otot jantung", "Kelelahan", "Dehidrasi"],
      },
      {
        id: "meditate",
        name: "Meditasi",
        icon: Wind,
        category: "relaxation",
        duration: 20,
        impact: (_, b) => ({
          bpm: baselineVitals[b].bpm - 5,
          stability: 100,
          ekg: "normal",
          bloodPressure: {
            systolic: baselineVitals[b].bloodPressure.systolic - 10,
            diastolic: baselineVitals[b].bloodPressure.diastolic - 5,
          },
          arrhythmiaRisk: 0,
        }),
        description:
          "Meditasi mengaktifkan sistem parasimpatis, menurunkan tekanan darah dan menstabilkan irama jantung.",
        riskFactors: [
          "Tidak ada risiko signifikan",
          "Manfaat: Mengurangi stres kronis",
        ],
      },
      {
        id: "smoking",
        name: "Merokok",
        icon: Cigarette,
        category: "vice",
        duration: 5,
        impact: (v, b) => ({
          bpm: v.bpm + 15,
          stability: v.stability - 15,
          ekg: b === "hypertensive" ? "heart_block" : "sinus_tachy",
          bloodPressure: {
            systolic: v.bloodPressure.systolic + 20,
            diastolic: v.bloodPressure.diastolic + 15,
          },
          oxygenSat: v.oxygenSat - 5,
          arrhythmiaRisk: v.arrhythmiaRisk + 25,
        }),
        description:
          "Nikotin menyempitkan pembuluh darah dan meningkatkan tekanan darah, meningkatkan risiko aritmia dan serangan jantung.",
        riskFactors: ["Kanker paru", "Penyakit vaskular", "Ketergantungan"],
      },
      {
        id: "alcohol",
        name: "Minum Alkohol",
        icon: Wine,
        category: "vice",
        duration: 12,
        impact: (v, b) => ({
          bpm: v.bpm + (b === "afib_prone" ? 30 : 15),
          stability: v.stability - 20,
          ekg: b === "afib_prone" ? "afib_persistent" : "aflutter",
          arrhythmiaRisk: v.arrhythmiaRisk + 15,
        }),
        description:
          "'Holiday heart syndrome': Alkohol dapat memicu AFib bahkan pada individu sehat, terutama dalam jumlah besar.",
        riskFactors: ["Kerusakan hati", "Dehidrasi", "Interaksi obat"],
      },
      {
        id: "weight_training",
        name: "Angkat Beban",
        icon: Dumbbell,
        category: "exercise",
        duration: 10,
        impact: (v, b) => ({
          bpm: v.bpm + 50,
          bloodPressure: {
            systolic: v.bloodPressure.systolic + 30,
            diastolic: v.bloodPressure.diastolic + 20,
          },
          ekg: b === "hypertensive" ? "vtach" : "sinus_tachy",
          arrhythmiaRisk:
            b === "hypertensive" ? v.arrhythmiaRisk + 20 : v.arrhythmiaRisk + 5,
        }),
        description:
          "Latihan resistensi meningkatkan tekanan darah sementara, bermanfaat untuk kesehatan jantung jangka panjang jika dilakukan benar.",
        riskFactors: ["Cedera", "Overtraining", "Hipertensi sementara"],
      },
      {
        id: "healthy_meal",
        name: "Makan Sehat",
        icon: Apple,
        category: "diet",
        duration: 15,
        impact: (v) => ({
          stability: v.stability + 10,
          bloodPressure: {
            systolic: v.bloodPressure.systolic - 5,
            diastolic: v.bloodPressure.diastolic - 3,
          },
          arrhythmiaRisk: v.arrhythmiaRisk - 5,
        }),
        description:
          "Makanan kaya potasium dan magnesium seperti buah-buahan membantu menjaga keseimbangan elektrolit untuk irama jantung stabil.",
        riskFactors: ["Tidak ada", "Manfaat: Anti-inflamasi"],
      },
      {
        id: "beta_blocker",
        name: "Minum Beta-Blocker",
        icon: Pill,
        category: "medication",
        duration: 20,
        impact: (v, b) => ({
          bpm: v.bpm - 20,
          ekg: b === "afib_prone" ? "normal" : "sinus_brady",
          stability: v.stability + 15,
          arrhythmiaRisk: v.arrhythmiaRisk - 20,
        }),
        description:
          "Beta-blocker memperlambat detak jantung dan mengurangi tekanan darah, efektif untuk mengontrol takikardia dan AFib.",
        riskFactors: ["Kelelahan", "Hipotensi", "Interaksi dengan stimulan"],
      },
    ],
    [baselineVitals]
  );

  const handleTrigger = (trigger: Trigger) => {
    if (activeTriggers.has(trigger.id)) return;

    const timerId = setTimeout(() => {
      setActiveTriggers((prev) => {
        const newMap = new Map(prev);
        newMap.delete(trigger.id);
        return newMap;
      });
    }, trigger.duration * 1000);

    setActiveTriggers((prev) => new Map(prev).set(trigger.id, timerId));
    setVitals((prev) => ({ ...prev, ...trigger.impact(prev, baseline) }));

    // Gamification: Tambah achievement jika trigger tertentu
    if (
      trigger.category === "relaxation" &&
      !achievements.includes("Zen Master")
    ) {
      setAchievements((prev) => [...prev, "Zen Master"]);
    }
  };

  const handleProfileChange = (profile: BaselineProfile) => {
    setBaseline(profile);
    setVitals(baselineVitals[profile]);
    activeTriggers.forEach((timer) => clearTimeout(timer));
    setActiveTriggers(new Map());
    setStressLevel(0);
    setSleepHours(8);
    setExerciseMinutes(0);
    setDietQuality(50);
    setHistory([]);
    setHealthScore(100);
    setAchievements([]);
  };

  useEffect(() => {
    if (tickInterval.current) clearInterval(tickInterval.current);

    tickInterval.current = setInterval(() => {
      setVitals((prev) => {
        const baseVitals: VitalSigns = baselineVitals[baseline];

        // Hitung impact yang lebih kompleks
        const stressImpactBPM =
          (stressLevel / 100) * (baseline === "afib_prone" ? 40 : 25);
        const sleepDeprivationImpactBPM =
          sleepHours < 6 ? (6 - sleepHours) * 5 : 0;
        const exerciseBenefitBPM =
          exerciseMinutes > 30 ? -(exerciseMinutes / 120) * 10 : 0;
        const dietImpactBPM = dietQuality < 50 ? (50 - dietQuality) / 5 : 0;
        const targetBpm =
          baseVitals.bpm +
          stressImpactBPM +
          sleepDeprivationImpactBPM +
          exerciseBenefitBPM +
          dietImpactBPM;

        const newBpm = prev.bpm + (targetBpm - prev.bpm) * 0.05; // Smooth transition

        const stressImpactStability = (stressLevel / 100) * 50;
        const sleepDeprivationImpactStability =
          sleepHours < 6 ? (6 - sleepHours) * 8 : 0;
        const exerciseBenefitStability =
          exerciseMinutes > 30 ? (exerciseMinutes / 120) * 20 : 0;
        const dietImpactStability =
          dietQuality > 50 ? (dietQuality - 50) / 5 : 0;
        const targetStability =
          baseVitals.stability -
          stressImpactStability -
          sleepDeprivationImpactStability +
          exerciseBenefitStability +
          dietImpactStability;

        const newStability =
          prev.stability + (targetStability - prev.stability) * 0.1;

        const stressImpactBP = (stressLevel / 100) * 20;
        const exerciseBenefitBP = exerciseMinutes > 30 ? -10 : 0;
        const targetSystolic =
          baseVitals.bloodPressure.systolic +
          stressImpactBP +
          (dietQuality < 50 ? 10 : -5) +
          exerciseBenefitBP;
        const targetDiastolic =
          baseVitals.bloodPressure.diastolic +
          stressImpactBP / 2 +
          (dietQuality < 50 ? 5 : -3) +
          exerciseBenefitBP / 2;

        const newBP = {
          systolic:
            prev.bloodPressure.systolic +
            (targetSystolic - prev.bloodPressure.systolic) * 0.05,
          diastolic:
            prev.bloodPressure.diastolic +
            (targetDiastolic - prev.bloodPressure.diastolic) * 0.05,
        };

        const oxygenImpact =
          sleepHours < 6
            ? -(6 - sleepHours)
            : 0 + (exerciseMinutes > 60 ? -2 : 1);
        const newOxygenSat =
          prev.oxygenSat +
          (baseVitals.oxygenSat + oxygenImpact - prev.oxygenSat) * 0.1;

        const riskFactors =
          stressLevel / 10 +
          (sleepHours < 6 ? 10 : 0) +
          (dietQuality < 50 ? 5 : 0) -
          exerciseMinutes / 10;
        const newArrhythmiaRisk =
          prev.arrhythmiaRisk +
          (baseVitals.arrhythmiaRisk + riskFactors - prev.arrhythmiaRisk) *
            0.05;

        let newEkg: EKGPattern = prev.ekg;
        if (activeTriggers.size === 0) {
          if (newArrhythmiaRisk > 70 && baseline === "afib_prone")
            newEkg = "afib_persistent";
          else if (newArrhythmiaRisk > 50 && baseline === "pvc_prone")
            newEkg = "pvc_multiple";
          else if (newArrhythmiaRisk > 80 && baseline === "post_mi")
            newEkg = "vtach";
          else if (newBpm > 100) newEkg = "sinus_tachy";
          else if (newBpm < 50) newEkg = "sinus_brady";
          else if (newStability < 50 && baseline === "hypertensive")
            newEkg = "heart_block";
          else newEkg = "normal";
        }

        // Update history setiap 5 detik
        if (Date.now() % 5000 < 500) {
          setHistory((prevHist) => [
            ...prevHist.slice(-59), // Keep last 60 entries
            {
              timestamp: Date.now(),
              bpm: Math.round(newBpm),
              stability: Math.round(newStability),
              ekg: newEkg,
              bloodPressure: {
                systolic: Math.round(newBP.systolic),
                diastolic: Math.round(newBP.diastolic),
              },
              oxygenSat: Math.round(newOxygenSat),
            },
          ]);
        }

        // Update health score
        const newScore = Math.round(
          100 -
            newArrhythmiaRisk / 2 -
            stressLevel / 2 +
            dietQuality / 4 +
            exerciseMinutes / 5 +
            sleepHours * 2
        );
        setHealthScore(Math.max(0, Math.min(100, newScore)));

        // Achievement check
        if (newScore > 90 && !achievements.includes("Heart Hero")) {
          setAchievements((prev) => [...prev, "Heart Hero"]);
        }
        if (newArrhythmiaRisk > 80 && !achievements.includes("Risk Taker")) {
          setAchievements((prev) => [...prev, "Risk Taker"]);
        }

        return {
          bpm: Math.round(newBpm),
          stability: Math.round(newStability),
          ekg: newEkg,
          bloodPressure: {
            systolic: Math.round(newBP.systolic),
            diastolic: Math.round(newBP.diastolic),
          },
          oxygenSat: Math.round(newOxygenSat),
          arrhythmiaRisk: Math.round(newArrhythmiaRisk),
        };
      });
    }, 500);

    return () => {
      if (tickInterval.current) clearInterval(tickInterval.current);
    };
  }, [
    baseline,
    activeTriggers,
    stressLevel,
    sleepHours,
    exerciseMinutes,
    dietQuality,
    baselineVitals,
    achievements,
  ]);

  useEffect(() => {
    let insightText = "";
    let icon = <CheckCircle className="text-green-400" />;
    switch (vitals.ekg) {
      case "pvc_single":
      case "pvc_multiple":
        insightText =
          "PVC terdeteksi: Denyut ekstra dari ventrikel. Seringkali jinak, tapi monitor jika sering terjadi.";
        icon = <AlertTriangle className="text-yellow-400" />;
        break;
      case "afib_short_run":
      case "afib_persistent":
        insightText =
          "Atrial Fibrillation: Irama kacau meningkatkan risiko stroke. Konsultasi dokter segera.";
        icon = <AlertTriangle className="text-red-400" />;
        break;
      case "sinus_tachy":
        insightText =
          "Takikardia Sinus: Detak cepat normal sebagai respons stres atau aktivitas.";
        icon = <TrendingUp className="text-orange-400" />;
        break;
      case "sinus_brady":
        insightText =
          "Bradikardia Sinus: Detak lambat, umum pada atlet tapi bisa indikasi masalah tiroid.";
        icon = <TrendingUp className="text-blue-400" />;
        break;
      case "aflutter":
        insightText =
          "Atrial Flutter: Gelombang sawtooth, sering terkait dengan penyakit jantung struktural.";
        icon = <AlertTriangle className="text-red-400" />;
        break;
      case "vtach":
        insightText =
          "Ventricular Tachycardia: Berpotensi fatal, terutama pasca-infark miokard.";
        icon = <AlertTriangle className="text-red-600 animate-pulse" />;
        break;
      case "heart_block":
        insightText =
          "Heart Block: Gangguan konduksi, mungkin memerlukan pacemaker jika derajat tinggi.";
        icon = <AlertTriangle className="text-orange-400" />;
        break;
      default:
        insightText =
          "Irama Sinus Normal: Jantung berfungsi optimal. Pertahankan gaya hidup sehat.";
        icon = <CheckCircle className="text-green-400" />;
    }

    if (sleepHours < 6) {
      insightText +=
        " Kurang tidur meningkatkan kortisol, menurunkan ambang aritmia.";
    }
    if (exerciseMinutes > 60) {
      insightText +=
        " Olahraga berlebih bisa menyebabkan kelelahan; istirahat penting.";
    }
    if (dietQuality < 30) {
      insightText +=
        " Diet buruk menyebabkan ketidakseimbangan elektrolit, risiko aritmia naik.";
    }
    if (vitals.arrhythmiaRisk > 50) {
      insightText += " Risiko aritmia tinggi: Pertimbangkan intervensi medis.";
    }

    setAiInsight(
      <div className="flex items-start gap-2">
        {icon}
        <span>{insightText}</span>
      </div>
    );
  }, [vitals, sleepHours, exerciseMinutes, dietQuality]);

  return (
    <section
      id="lifestyle-simulator"
      className="py-24 sm:py-32 bg-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <HeartPulse className="h-12 w-12 mx-auto text-red-500 mb-4 animate-pulse" />
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Simulator Dampak Gaya Hidup Canggih
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Jelajahi bagaimana pilihan harian memengaruhi jantung Anda secara
            mendalam. Dengan visualisasi real-time, analisis AI, dan elemen
            edukatif, pelajari cara menjaga kesehatan kardiovaskular.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="text-blue-400" />
                  Pilih Profil Jantung
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleProfileChange("healthy")}
                  variant={baseline === "healthy" ? "default" : "outline"}
                >
                  Sehat
                </Button>
                <Button
                  onClick={() => handleProfileChange("pvc_prone")}
                  variant={baseline === "pvc_prone" ? "default" : "outline"}
                >
                  Rentan PVC
                </Button>
                <Button
                  onClick={() => handleProfileChange("afib_prone")}
                  variant={baseline === "afib_prone" ? "default" : "outline"}
                >
                  Cenderung AFib
                </Button>
                <Button
                  onClick={() => handleProfileChange("hypertensive")}
                  variant={baseline === "hypertensive" ? "default" : "outline"}
                >
                  Hipertensi
                </Button>
                <Button
                  onClick={() => handleProfileChange("athlete")}
                  variant={baseline === "athlete" ? "default" : "outline"}
                >
                  Atlet
                </Button>
                <Button
                  onClick={() => handleProfileChange("post_mi")}
                  variant={baseline === "post_mi" ? "default" : "outline"}
                >
                  Pasca-MI
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-yellow-400" />
                  Panel Pemicu Interaktif
                </CardTitle>
                <CardDescription>
                  Klik untuk mengaktifkan; hover untuk info edukatif.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {triggers.map((t) => (
                  <div key={t.id}>
                    <Button
                      onClick={() => handleTrigger(t)}
                      disabled={activeTriggers.has(t.id)}
                      className="flex items-center gap-2 w-full"
                      data-tooltip-id={t.id}
                    >
                      <t.icon className="h-4 w-4" /> {t.name}
                    </Button>
                    <ReactTooltip
                      id={t.id}
                      place="top"
                      content={t.description}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="text-orange-400" />
                  Faktor Berkelanjutan
                </CardTitle>
                <CardDescription>
                  Atur untuk simulasi jangka panjang.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label
                    htmlFor="stress"
                    className="flex justify-between items-center text-sm mb-2"
                  >
                    <span className="flex items-center gap-1">
                      <Shield /> Tingkat Stres
                    </span>
                    <Badge variant="secondary">{stressLevel}%</Badge>
                  </Label>
                  <Slider
                    id="stress"
                    value={[stressLevel]}
                    onValueChange={(v) => setStressLevel(v[0])}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="sleep"
                    className="flex justify-between items-center text-sm mb-2"
                  >
                    <span className="flex items-center gap-1">
                      <Moon /> Jam Tidur
                    </span>
                    <Badge variant="secondary">{sleepHours} Jam</Badge>
                  </Label>
                  <Slider
                    id="sleep"
                    value={[sleepHours]}
                    onValueChange={(v) => setSleepHours(v[0])}
                    max={12}
                    step={0.5}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="exercise"
                    className="flex justify-between items-center text-sm mb-2"
                  >
                    <span className="flex items-center gap-1">
                      <Footprints /> Menit Olahraga
                    </span>
                    <Badge variant="secondary">{exerciseMinutes} Min</Badge>
                  </Label>
                  <Slider
                    id="exercise"
                    value={[exerciseMinutes]}
                    onValueChange={(v) => setExerciseMinutes(v[0])}
                    max={120}
                    step={5}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="diet"
                    className="flex justify-between items-center text-sm mb-2"
                  >
                    <span className="flex items-center gap-1">
                      <Apple /> Kualitas Diet
                    </span>
                    <Badge variant="secondary">{dietQuality}%</Badge>
                  </Label>
                  <Slider
                    id="diet"
                    value={[dietQuality]}
                    onValueChange={(v) => setDietQuality(v[0])}
                    max={100}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-purple-400" />
                  Skor Kesehatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={healthScore} className="w-full" />
                <p className="text-center mt-2">{healthScore}% Optimal</p>
                <div className="mt-4">
                  <h4 className="text-sm font-bold mb-2">Achievement:</h4>
                  <ul className="space-y-1">
                    {achievements.map((ach) => (
                      <li
                        key={ach}
                        className="flex items-center gap-1 text-green-400"
                      >
                        <CheckCircle className="h-4 w-4" /> {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="bg-black border-2 border-gray-700">
              <CardHeader className="flex flex-row justify-between items-center p-4 border-b border-gray-700">
                <CardTitle className="text-lg text-green-400 font-mono">
                  LIVE EKG MONITOR
                </CardTitle>
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm">
                  <span
                    className={cn(
                      "transition-colors",
                      vitals.bpm > 100 || vitals.bpm < 60
                        ? "text-red-400 animate-pulse"
                        : "text-green-400"
                    )}
                  >
                    HR: {vitals.bpm} bpm
                  </span>
                  <span
                    className={cn(
                      "transition-colors",
                      vitals.stability < 70
                        ? "text-red-400 animate-pulse"
                        : vitals.stability < 90
                        ? "text-yellow-400"
                        : "text-green-400"
                    )}
                  >
                    STAB: {vitals.stability}%
                  </span>
                  <span
                    className={cn(
                      "transition-colors",
                      vitals.bloodPressure.systolic > 140 ||
                        vitals.bloodPressure.diastolic > 90
                        ? "text-red-400"
                        : "text-green-400"
                    )}
                  >
                    BP: {vitals.bloodPressure.systolic}/
                    {vitals.bloodPressure.diastolic}
                  </span>
                  <span
                    className={cn(
                      "transition-colors",
                      vitals.oxygenSat < 95 ? "text-red-400" : "text-green-400"
                    )}
                  >
                    O2: {vitals.oxygenSat}%
                  </span>
                  <span
                    className={cn(
                      "transition-colors",
                      vitals.arrhythmiaRisk > 50
                        ? "text-red-400 animate-pulse"
                        : "text-yellow-400"
                    )}
                  >
                    RISK: {vitals.arrhythmiaRisk}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-64">
                  <EKGVisual pattern={vitals.ekg} bpm={vitals.bpm} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-900/30 border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-300">
                  <BrainCircuit /> AI Bio-Feedback & Edukasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={typeof aiInsight === "string" ? aiInsight : undefined}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-300 italic"
                  >
                    {aiInsight}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <HelpCircle /> Pelajari Lebih Lanjut
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Edukasi Kesehatan Jantung</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="ekg">
                        <TabsList>
                          <TabsTrigger value="ekg">Pola EKG</TabsTrigger>
                          <TabsTrigger value="triggers">
                            Pemicu & Risiko
                          </TabsTrigger>
                          <TabsTrigger value="profiles">
                            Profil Baseline
                          </TabsTrigger>
                          <TabsTrigger value="tips">
                            Tips Pencegahan
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="ekg">
                          <ul className="space-y-2">
                            <li>
                              <strong>Normal:</strong> Irama standar sehat.
                            </li>
                            <li>
                              <strong>Sinus Tachy:</strong> Detak cepat karena
                              stres atau olahraga.
                            </li>
                            <li>
                              <strong>PVC:</strong> Denyut ekstra, sering dipicu
                              kafein.
                            </li>
                            <li>
                              <strong>AFib:</strong> Irama kacau, risiko
                              pembekuan darah.
                            </li>
                            {/* Tambahkan yang lain */}
                          </ul>
                        </TabsContent>
                        <TabsContent value="triggers">
                          <ul className="space-y-2">
                            {triggers.map((t) => (
                              <li key={t.id}>
                                <strong>{t.name}:</strong> {t.description}
                                <br />
                                Risiko: {t.riskFactors.join(", ")}
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                        <TabsContent value="profiles">
                          <ul className="space-y-2">
                            <li>
                              <strong>Sehat:</strong> Baseline optimal, risiko
                              rendah.
                            </li>
                            <li>
                              <strong>Rentan PVC:</strong> Mudah terpicu
                              extrasystole.
                            </li>
                            {/* Tambahkan yang lain */}
                          </ul>
                        </TabsContent>
                        <TabsContent value="tips">
                          <ul className="space-y-2">
                            <li>
                              <Stethoscope /> Rutin cek EKG jika ada gejala.
                            </li>
                            <li>
                              <Apple /> Diet Mediterania untuk kesehatan
                              jantung.
                            </li>
                            <li>
                              <Footprints /> 150 menit olahraga moderat per
                              minggu.
                            </li>
                            <li>
                              <Moon /> Tidur 7-9 jam setiap malam.
                            </li>
                            <li>
                              <Shield /> Kelola stres dengan mindfulness.
                            </li>
                          </ul>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300">
                  <TrendingUp /> Riwayat Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                      />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="bpm"
                        stroke="#8884d8"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="stability"
                        stroke="#82ca9d"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="oxygenSat"
                        stroke="#ffc658"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LifestyleImpactSimulator;
