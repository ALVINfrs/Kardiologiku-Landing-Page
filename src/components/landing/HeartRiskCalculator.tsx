import { useState, useEffect } from "react";
import type { FC } from "react";
import {
  motion,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import type { Variants } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  HeartPulse,
  Activity,
  ShieldCheck,
  Zap,
  Cloud,
  Sun,
  Brain,
} from "lucide-react";

// --- Tipe Data ---
type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active";
type DietQuality = "poor" | "average" | "good";
type AlcoholConsumption = "none" | "moderate" | "heavy";
type SyncopeTrigger = "rest" | "exercise" | "none";

interface FormData {
  age: number;
  gender: Gender;
  systolicBP: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  isSmoker: boolean;
  hasDiabetes: boolean;
  familyHistory: boolean;
  activityLevel: ActivityLevel;
  dietQuality: DietQuality;
  alcohol: AlcoholConsumption;
}

interface DangerousArrhythmiaData {
  hasBrugadaPattern: boolean;
  hasLQTdiagnosis: boolean;
  unexplainedSyncope: boolean;
  syncopeTrigger: SyncopeTrigger;
  nocturnalGasping: boolean;
  familyHistorySCD: boolean;
  drugInducedQT: boolean;
  congenitalDeafness: boolean;
}

interface SimulationToggles {
  quitSmoking: boolean;
  startExercise: boolean;
  improveDiet: boolean;
  controlDiabetes: boolean;
}

interface WeatherData {
  temperature: number;
  humidity: number;
}

interface HealthLogEntry {
  date: string;
  heartDiseaseScore: number;
  arrhythmiaScore: number;
  geneticSADSScore: number;
}

interface Insight {
  summary: string;
  trendAnalysis: string;
  longTermPrediction: string;
  topRecommendations: string[];
}

// --- Komponen Angka yang Dianimasikan ---
const AnimatedNumber: FC<{ value: number }> = ({ value }) => {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

// --- Komponen Utama Kalkulator ---
const HeartRiskCalculator: FC = () => {
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem("formData");
    return saved
      ? JSON.parse(saved)
      : {
          age: 45,
          gender: "male",
          systolicBP: 120,
          totalCholesterol: 200,
          hdlCholesterol: 50,
          isSmoker: false,
          hasDiabetes: false,
          familyHistory: false,
          activityLevel: "sedentary",
          dietQuality: "average",
          alcohol: "none",
        };
  });

  const [dangerousArrhythmiaData, setDangerousArrhythmiaData] =
    useState<DangerousArrhythmiaData>(() => {
      const saved = localStorage.getItem("arrhythmiaData");
      return saved
        ? JSON.parse(saved)
        : {
            hasBrugadaPattern: false,
            hasLQTdiagnosis: false,
            unexplainedSyncope: false,
            syncopeTrigger: "none",
            nocturnalGasping: false,
            familyHistorySCD: false,
            drugInducedQT: false,
            congenitalDeafness: false,
          };
    });

  const [simulationToggles, setSimulationToggles] = useState<SimulationToggles>(
    () => {
      const saved = localStorage.getItem("simulationToggles");
      return saved
        ? JSON.parse(saved)
        : {
            quitSmoking: false,
            startExercise: false,
            improveDiet: false,
            controlDiabetes: false,
          };
    }
  );

  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 25,
    humidity: 60,
  });

  const [healthLog, setHealthLog] = useState<HealthLogEntry[]>(() => {
    const saved = localStorage.getItem("healthLog");
    return saved ? JSON.parse(saved) : [];
  });

  const [riskScores, setRiskScores] = useState({
    heartDisease: 0,
    arrhythmia: 0,
    geneticSADS: 0,
  });
  const [insight, setInsight] = useState<Insight>({
    summary: "",
    trendAnalysis: "",
    longTermPrediction: "",
    topRecommendations: [],
  });

  useEffect(() => {
    try {
      localStorage.setItem("formData", JSON.stringify(formData));
      localStorage.setItem(
        "arrhythmiaData",
        JSON.stringify(dangerousArrhythmiaData)
      );
      localStorage.setItem(
        "simulationToggles",
        JSON.stringify(simulationToggles)
      );
      localStorage.setItem("healthLog", JSON.stringify(healthLog));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [formData, dangerousArrhythmiaData, simulationToggles, healthLog]);

  const handleFormChange = <T extends keyof FormData>(
    field: T,
    value: FormData[T]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrhythmiaChange = <T extends keyof DangerousArrhythmiaData>(
    field: T,
    value: DangerousArrhythmiaData[T]
  ) => {
    setDangerousArrhythmiaData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSimulationToggle =
    (field: keyof SimulationToggles) => (checked: boolean) => {
      setSimulationToggles((prev) => ({ ...prev, [field]: checked }));
    };

  const handleWeatherChange = <T extends keyof WeatherData>(
    field: T,
    value: WeatherData[T]
  ) => {
    setWeatherData((prev) => ({ ...prev, [field]: value }));
  };

  const addToHealthLog = () => {
    const newEntry: HealthLogEntry = {
      date: new Date().toISOString().split("T")[0],
      heartDiseaseScore: riskScores.heartDisease,
      arrhythmiaScore: riskScores.arrhythmia,
      geneticSADSScore: riskScores.geneticSADS,
    };
    setHealthLog((prev) => [...prev, newEntry].slice(-10));
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeInOut" },
    }),
  };

  useEffect(() => {
    const calculateRisk = () => {
      let hdScore = 0;
      let arrhythmiaScore = 0;
      let brugadaScore = 0;
      let lqtsScore = 0;

      hdScore += Math.max(0, formData.age - 30) * 0.5;
      arrhythmiaScore += Math.max(0, formData.age - 40) * 0.7;
      if (formData.gender === "male") hdScore += 5;
      hdScore += Math.max(0, formData.systolicBP - 110) * 0.4;
      arrhythmiaScore += Math.max(0, formData.systolicBP - 120) * 0.8;
      hdScore += Math.max(0, formData.totalCholesterol - 180) * 0.2;
      hdScore += Math.max(0, 60 - formData.hdlCholesterol) * 0.3;
      const isEffectivelySmoker =
        formData.isSmoker && !simulationToggles.quitSmoking;
      if (isEffectivelySmoker) {
        hdScore += 20;
        arrhythmiaScore += 10;
      }
      const hasEffectiveDiabetes =
        formData.hasDiabetes && !simulationToggles.controlDiabetes;
      if (hasEffectiveDiabetes) {
        hdScore += 15;
        arrhythmiaScore += 8;
      }
      if (formData.familyHistory) {
        hdScore += 10;
        arrhythmiaScore += 5;
      }
      let effectiveActivity = formData.activityLevel;
      if (simulationToggles.startExercise) effectiveActivity = "moderate";
      if (effectiveActivity === "sedentary") {
        hdScore += 15;
        arrhythmiaScore += 5;
      }
      if (effectiveActivity === "light") hdScore += 8;
      let effectiveDiet = formData.dietQuality;
      if (simulationToggles.improveDiet) effectiveDiet = "good";
      if (effectiveDiet === "poor") {
        hdScore += 12;
        arrhythmiaScore += 4;
      }
      if (effectiveDiet === "average") hdScore += 6;
      if (formData.alcohol === "heavy") arrhythmiaScore += 15;
      if (formData.alcohol === "moderate") arrhythmiaScore += 7;

      if (weatherData.temperature > 35 || weatherData.humidity > 80) {
        hdScore += 10;
        arrhythmiaScore += 5;
      }

      if (dangerousArrhythmiaData.hasBrugadaPattern) brugadaScore += 60;
      if (
        dangerousArrhythmiaData.unexplainedSyncope &&
        dangerousArrhythmiaData.syncopeTrigger === "rest"
      )
        brugadaScore += 30;
      if (dangerousArrhythmiaData.nocturnalGasping) brugadaScore += 20;
      if (dangerousArrhythmiaData.hasLQTdiagnosis) lqtsScore += 60;
      if (
        dangerousArrhythmiaData.unexplainedSyncope &&
        dangerousArrhythmiaData.syncopeTrigger === "exercise"
      )
        lqtsScore += 35;
      if (dangerousArrhythmiaData.drugInducedQT) lqtsScore += 15;
      if (dangerousArrhythmiaData.congenitalDeafness) lqtsScore += 20;
      if (dangerousArrhythmiaData.familyHistorySCD) {
        brugadaScore += 25;
        lqtsScore += 25;
      }
      if (
        dangerousArrhythmiaData.unexplainedSyncope &&
        dangerousArrhythmiaData.syncopeTrigger === "none"
      ) {
        brugadaScore += 15;
        lqtsScore += 15;
      }

      const finalGeneticSADSScore = Math.max(brugadaScore, lqtsScore);

      setRiskScores({
        heartDisease: Math.min(100, Math.max(0, Math.round(hdScore))),
        arrhythmia: Math.min(100, Math.max(0, Math.round(arrhythmiaScore))),
        geneticSADS: Math.min(
          100,
          Math.max(0, Math.round(finalGeneticSADSScore))
        ),
      });

      const generateInsight = () => {
        const summary = `Berdasarkan data Anda saat ini (usia ${formData.age} tahun, tekanan darah ${formData.systolicBP} mmHg, kolesterol total ${formData.totalCholesterol} mg/dL), risiko penyakit jantung Anda adalah ${riskScores.heartDisease}%, aritmia ${riskScores.arrhythmia}%, dan risiko genetik SADS ${riskScores.geneticSADS}%.`;
        const trendAnalysis =
          healthLog.length > 1
            ? `Tren risiko Anda: Penyakit jantung rata-rata ${Math.round(
                healthLog.reduce((a, b) => a + b.heartDiseaseScore, 0) /
                  healthLog.length
              )}%, aritmia ${Math.round(
                healthLog.reduce((a, b) => a + b.arrhythmiaScore, 0) /
                  healthLog.length
              )}%, SADS ${Math.round(
                healthLog.reduce((a, b) => a + b.geneticSADSScore, 0) /
                  healthLog.length
              )}% dalam ${healthLog.length} hari terakhir.`
            : "Belum cukup data untuk analisis tren.";
        const longTermPrediction = `Jika pola gaya hidup tetap, risiko jantung Anda dapat meningkat sebesar ${Math.min(
          100,
          riskScores.heartDisease + (formData.age + 5 - 30) * 0.5
        )}% dalam 5 tahun. Dengan perubahan positif (berhenti merokok, olahraga teratur), risiko ini dapat dikurangi hingga ${Math.max(
          0,
          riskScores.heartDisease - 15
        )}%.`;
        const topRecommendations = [];
        if (riskScores.heartDisease > 50)
          topRecommendations.push(
            "Prioritaskan konsultasi dokter dan pantau tekanan darah."
          );
        if (riskScores.arrhythmia > 50)
          topRecommendations.push(
            "Hindari pemicu aritmia seperti stres berat."
          );
        if (riskScores.geneticSADS > 40)
          topRecommendations.push("Segera lakukan skrining genetik.");
        if (isEffectivelySmoker)
          topRecommendations.push(
            "Berhenti merokok untuk penurunan risiko signifikan."
          );
        if (topRecommendations.length === 0)
          topRecommendations.push("Jaga gaya hidup sehat untuk risiko rendah.");

        setInsight({
          summary,
          trendAnalysis,
          longTermPrediction,
          topRecommendations,
        });
      };

      generateInsight();
    };

    calculateRisk();
  }, [
    formData,
    simulationToggles,
    dangerousArrhythmiaData,
    weatherData,
    healthLog,
    riskScores.heartDisease,
    riskScores.arrhythmia,
    riskScores.geneticSADS,
  ]);

  const getRiskColor = (score: number) =>
    score > 75
      ? "text-red-500"
      : score > 50
      ? "text-orange-400"
      : score > 25
      ? "text-yellow-400"
      : "text-green-400";
  const getRiskLevel = (score: number) =>
    score > 75
      ? "Sangat Tinggi"
      : score > 50
      ? "Tinggi"
      : score > 25
      ? "Sedang"
      : "Rendah";
  const getRingColor = (score: number) =>
    score > 75
      ? "#ef4444"
      : score > 50
      ? "#fb923c"
      : score > 25
      ? "#facc15"
      : "#4ade80";

  return (
    <section
      id="kalkulator-risiko"
      className="py-24 sm:py-32 bg-background text-foreground transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <HeartPulse className="h-12 w-12 mx-auto text-red-600 dark:text-red-400 mb-4" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Kalkulator Risiko Jantung & Aritmia
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Gunakan simulasi interaktif ini untuk memperkirakan risiko Anda dan
            pahami bagaimana perubahan gaya hidup dapat membuat perbedaan besar.
          </p>
          <div className="mt-4 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-yellow-600 dark:text-yellow-400">
              Disclaimer: Ini adalah simulasi dan bukan pengganti nasihat medis
              profesional.
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-card text-card-foreground border-border transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <HeartPulse className="w-6 h-6" /> Data Diri & Medis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="age" className="text-muted-foreground">
                        Usia
                      </Label>
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        {formData.age}
                      </span>
                    </div>
                    <Slider
                      value={[formData.age]}
                      min={20}
                      max={80}
                      step={1}
                      onValueChange={(v) => {
                        if (v && v.length > 0) handleFormChange("age", v[0]);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Jenis Kelamin
                    </Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(v) =>
                        handleFormChange("gender", v as Gender)
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Pria</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Wanita</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="systolicBP"
                        className="text-muted-foreground"
                      >
                        Tekanan Darah Sistolik (mmHg)
                      </Label>
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        {formData.systolicBP}
                      </span>
                    </div>
                    <Slider
                      value={[formData.systolicBP]}
                      min={90}
                      max={200}
                      step={1}
                      onValueChange={(v) => {
                        if (v && v.length > 0)
                          handleFormChange("systolicBP", v[0]);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="totalCholesterol"
                        className="text-muted-foreground"
                      >
                        Kolesterol Total (mg/dL)
                      </Label>
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        {formData.totalCholesterol}
                      </span>
                    </div>
                    <Slider
                      value={[formData.totalCholesterol]}
                      min={100}
                      max={300}
                      step={1}
                      onValueChange={(v) => {
                        if (v && v.length > 0)
                          handleFormChange("totalCholesterol", v[0]);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="hdlCholesterol"
                        className="text-muted-foreground"
                      >
                        Kolesterol HDL (mg/dL)
                      </Label>
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        {formData.hdlCholesterol}
                      </span>
                    </div>
                    <Slider
                      value={[formData.hdlCholesterol]}
                      min={20}
                      max={100}
                      step={1}
                      onValueChange={(v) => {
                        if (v && v.length > 0)
                          handleFormChange("hdlCholesterol", v[0]);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-card text-card-foreground border-border transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <Activity className="w-6 h-6" /> Gaya Hidup & Riwayat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isSmoker" className="text-muted-foreground">
                      Apakah Anda Merokok?
                    </Label>
                    <Switch
                      id="isSmoker"
                      checked={formData.isSmoker}
                      onCheckedChange={(c) => handleFormChange("isSmoker", c)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="hasDiabetes"
                      className="text-muted-foreground"
                    >
                      Apakah Anda Menderita Diabetes?
                    </Label>
                    <Switch
                      id="hasDiabetes"
                      checked={formData.hasDiabetes}
                      onCheckedChange={(c) =>
                        handleFormChange("hasDiabetes", c)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="familyHistory"
                      className="text-muted-foreground"
                    >
                      Ada Riwayat Penyakit Jantung Koroner di Keluarga?
                    </Label>
                    <Switch
                      id="familyHistory"
                      checked={formData.familyHistory}
                      onCheckedChange={(c) =>
                        handleFormChange("familyHistory", c)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Aktivitas Fisik Mingguan
                    </Label>
                    <RadioGroup
                      value={formData.activityLevel}
                      onValueChange={(v) =>
                        handleFormChange("activityLevel", v as ActivityLevel)
                      }
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sedentary" id="sedentary" />
                        <Label htmlFor="sedentary">
                          Jarang/Tidak Sama Sekali
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light">Ringan (1-2x)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate">Sedang (3-4x)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="active" />
                        <Label htmlFor="active">Aktif (5x+)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Konsumsi Alkohol
                    </Label>
                    <RadioGroup
                      value={formData.alcohol}
                      onValueChange={(v) =>
                        handleFormChange("alcohol", v as AlcoholConsumption)
                      }
                      className="grid grid-cols-3 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none">Tidak Ada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate">Sedang</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="heavy" id="heavy" />
                        <Label htmlFor="heavy">Berat</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-card text-card-foreground border-border transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Zap className="w-6 h-6" /> Kajian Risiko Henti Jantung
                    Mendadak (SADS)
                  </CardTitle>
                  <CardDescription>
                    Jawab pertanyaan berikut untuk mengestimasi risiko dari
                    kelainan genetik seperti Brugada atau Long QT Syndrome.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="familyHistorySCD"
                      className="text-muted-foreground"
                    >
                      Riwayat henti jantung mendadak (usia lebih 45 thn) di
                      keluarga?
                    </Label>
                    <Switch
                      id="familyHistorySCD"
                      checked={dangerousArrhythmiaData.familyHistorySCD}
                      onCheckedChange={(c) =>
                        handleArrhythmiaChange("familyHistorySCD", c)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="unexplainedSyncope"
                      className="text-muted-foreground"
                    >
                      Pernah pingsan mendadak tanpa sebab yang jelas?
                    </Label>
                    <Switch
                      id="unexplainedSyncope"
                      checked={dangerousArrhythmiaData.unexplainedSyncope}
                      onCheckedChange={(c) =>
                        handleArrhythmiaChange("unexplainedSyncope", c)
                      }
                    />
                  </div>
                  {dangerousArrhythmiaData.unexplainedSyncope && (
                    <div className="space-y-2 pl-4 border-l-2 border-yellow-400 dark:border-yellow-600">
                      <Label>Kapan biasanya pingsan terjadi?</Label>
                      <RadioGroup
                        value={dangerousArrhythmiaData.syncopeTrigger}
                        onValueChange={(v) =>
                          handleArrhythmiaChange(
                            "syncopeTrigger",
                            v as SyncopeTrigger
                          )
                        }
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rest" id="rest" />
                          <Label htmlFor="rest">Saat Istirahat/Tidur</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="exercise" id="exercise" />
                          <Label htmlFor="exercise">Saat Olahraga/Stres</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="nocturnalGasping"
                      className="text-muted-foreground"
                    >
                      Pernah terbangun di malam hari karena tersengal-sengal?
                    </Label>
                    <Switch
                      id="nocturnalGasping"
                      checked={dangerousArrhythmiaData.nocturnalGasping}
                      onCheckedChange={(c) =>
                        handleArrhythmiaChange("nocturnalGasping", c)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="hasBrugadaPattern"
                      className="text-muted-foreground"
                    >
                      Pernah didiagnosis dokter memiliki pola EKG Brugada Tipe
                      1?
                    </Label>
                    <Switch
                      id="hasBrugadaPattern"
                      checked={dangerousArrhythmiaData.hasBrugadaPattern}
                      onCheckedChange={(c) =>
                        handleArrhythmiaChange("hasBrugadaPattern", c)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="hasLQTdiagnosis"
                      className="text-muted-foreground"
                    >
                      Pernah didiagnosis dokter memiliki Long QT Syndrome
                      (LQTS)?
                    </Label>
                    <Switch
                      id="hasLQTdiagnosis"
                      checked={dangerousArrhythmiaData.hasLQTdiagnosis}
                      onCheckedChange={(c) =>
                        handleArrhythmiaChange("hasLQTdiagnosis", c)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="drugInducedQT"
                      className="text-muted-foreground"
                    >
                      Mengonsumsi obat yang dapat memperpanjang interval QT?
                    </Label>
                    <Switch
                      id="drugInducedQT"
                      checked={dangerousArrhythmiaData.drugInducedQT}
                      onCheckedChange={(c) =>
                        handleArrhythmiaChange("drugInducedQT", c)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="congenitalDeafness"
                      className="text-muted-foreground"
                    >
                      Memiliki riwayat tuli (tidak bisa mendengar) sejak lahir?
                    </Label>
                    <Switch
                      id="congenitalDeafness"
                      checked={dangerousArrhythmiaData.congenitalDeafness}
                      onCheckedChange={(c) =>
                        handleArrhythmiaChange("congenitalDeafness", c)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={3}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-card text-card-foreground border-border transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Cloud className="w-6 h-6" /> Kondisi Cuaca
                  </CardTitle>
                  <CardDescription>
                    Masukkan suhu dan kelembapan untuk menyesuaikan risiko.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="temperature"
                        className="text-muted-foreground"
                      >
                        Suhu (°C)
                      </Label>
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                        {weatherData.temperature}
                      </span>
                    </div>
                    <Slider
                      value={[weatherData.temperature]}
                      min={15}
                      max={45}
                      step={1}
                      onValueChange={(v) => {
                        if (v && v.length > 0)
                          handleWeatherChange("temperature", v[0]);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="humidity"
                        className="text-muted-foreground"
                      >
                        Kelembapan (%)
                      </Label>
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                        {weatherData.humidity}
                      </span>
                    </div>
                    <Slider
                      value={[weatherData.humidity]}
                      min={20}
                      max={100}
                      step={1}
                      onValueChange={(v) => {
                        if (v && v.length > 0)
                          handleWeatherChange("humidity", v[0]);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={4}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-card text-card-foreground border-border transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Sun className="w-6 h-6" /> Log Kesehatan
                  </CardTitle>
                  <CardDescription>
                    Catat dan lihat riwayat risiko Anda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <button
                    onClick={addToHealthLog}
                    className="bg-blue-400 text-white px-4 py-2 rounded dark:bg-blue-600"
                  >
                    Tambah ke Log
                  </button>
                  <ul className="text-muted-foreground">
                    {healthLog.map((entry, index) => (
                      <li key={index} className="py-1">
                        {entry.date}: HD={entry.heartDiseaseScore}%, Arr=
                        {entry.arrhythmiaScore}%, SADS={entry.geneticSADSScore}%
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6 sticky top-24">
            <motion.div
              custom={5}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-card text-card-foreground border-border transition-colors text-center">
                <CardHeader>
                  <CardTitle>Hasil Estimasi Risiko Anda</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-md font-semibold text-red-600 dark:text-red-400">
                        Penyakit Jantung
                      </h3>
                      <div style={{ width: 120, height: 120 }}>
                        <ResponsiveContainer>
                          <RadialBarChart
                            innerRadius="70%"
                            outerRadius="100%"
                            data={[{ value: riskScores.heartDisease }]}
                            startAngle={90}
                            endAngle={-270}
                          >
                            <PolarAngleAxis
                              type="number"
                              domain={[0, 100]}
                              angleAxisId={0}
                              tick={false}
                            />
                            <RadialBar
                              background
                              dataKey="value"
                              cornerRadius={10}
                              fill={getRingColor(riskScores.heartDisease)}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                      <p
                        className={`text-3xl font-bold ${getRiskColor(
                          riskScores.heartDisease
                        )}`}
                      >
                        <AnimatedNumber value={riskScores.heartDisease} />%
                      </p>
                      <p
                        className={`font-semibold ${getRiskColor(
                          riskScores.heartDisease
                        )}`}
                      >
                        {getRiskLevel(riskScores.heartDisease)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <h3 className="text-md font-semibold text-red-600 dark:text-red-400">
                        Aritmia Umum
                      </h3>
                      <div style={{ width: 120, height: 120 }}>
                        <ResponsiveContainer>
                          <RadialBarChart
                            innerRadius="70%"
                            outerRadius="100%"
                            data={[{ value: riskScores.arrhythmia }]}
                            startAngle={90}
                            endAngle={-270}
                          >
                            <PolarAngleAxis
                              type="number"
                              domain={[0, 100]}
                              angleAxisId={0}
                              tick={false}
                            />
                            <RadialBar
                              background
                              dataKey="value"
                              cornerRadius={10}
                              fill={getRingColor(riskScores.arrhythmia)}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                      <p
                        className={`text-3xl font-bold ${getRiskColor(
                          riskScores.arrhythmia
                        )}`}
                      >
                        <AnimatedNumber value={riskScores.arrhythmia} />%
                      </p>
                      <p
                        className={`font-semibold ${getRiskColor(
                          riskScores.arrhythmia
                        )}`}
                      >
                        {getRiskLevel(riskScores.arrhythmia)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 border-t border-border pt-4">
                    <h3 className="text-md font-semibold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                      <Zap size={16} /> Risiko Genetik (SADS)
                    </h3>
                    <div style={{ width: 120, height: 120 }}>
                      <ResponsiveContainer>
                        <RadialBarChart
                          innerRadius="70%"
                          outerRadius="100%"
                          data={[{ value: riskScores.geneticSADS }]}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                          />
                          <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={10}
                            fill={getRingColor(riskScores.geneticSADS)}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <p
                      className={`text-3xl font-bold ${getRiskColor(
                        riskScores.geneticSADS
                      )}`}
                    >
                      <AnimatedNumber value={riskScores.geneticSADS} />%
                    </p>
                    <p
                      className={`font-semibold ${getRiskColor(
                        riskScores.geneticSADS
                      )}`}
                    >
                      {getRiskLevel(riskScores.geneticSADS)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={6}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-card text-card-foreground border-border transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <ShieldCheck className="w-6 h-6" /> Simulasi Perubahan Gaya
                    Hidup
                  </CardTitle>
                  <CardDescription>
                    Lihat bagaimana risiko Anda berubah jika Anda mengambil
                    tindakan positif.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.isSmoker && (
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="sim-smoke"
                        className="text-muted-foreground"
                      >
                        Simulasikan Berhenti Merokok
                      </Label>
                      <Switch
                        id="sim-smoke"
                        checked={simulationToggles.quitSmoking}
                        onCheckedChange={handleSimulationToggle("quitSmoking")}
                      />
                    </div>
                  )}
                  {formData.activityLevel === "sedentary" && (
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="sim-exercise"
                        className="text-muted-foreground"
                      >
                        Simulasikan Olahraga Teratur
                      </Label>
                      <Switch
                        id="sim-exercise"
                        checked={simulationToggles.startExercise}
                        onCheckedChange={handleSimulationToggle(
                          "startExercise"
                        )}
                      />
                    </div>
                  )}
                  {formData.dietQuality !== "good" && (
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="sim-diet"
                        className="text-muted-foreground"
                      >
                        Simulasikan Diet Sehat
                      </Label>
                      <Switch
                        id="sim-diet"
                        checked={simulationToggles.improveDiet}
                        onCheckedChange={handleSimulationToggle("improveDiet")}
                      />
                    </div>
                  )}
                  {formData.hasDiabetes && (
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="sim-diabetes"
                        className="text-muted-foreground"
                      >
                        Simulasikan Kontrol Gula Darah
                      </Label>
                      <Switch
                        id="sim-diabetes"
                        checked={simulationToggles.controlDiabetes}
                        onCheckedChange={handleSimulationToggle(
                          "controlDiabetes"
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={7}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-card text-card-foreground border-border transition-colors">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">
                    Rekomendasi Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                    <AnimatePresence>
                      {insight.topRecommendations.map((rec, index) => (
                        <motion.li
                          key={rec}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {rec}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={8}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-card text-card-foreground border-border transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Brain className="w-6 h-6" /> AI Insight & Tren
                  </CardTitle>
                  <CardDescription>
                    Analisis mendalam dan visualisasi tren risiko Anda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Ringkasan
                    </h4>
                    <p className="text-muted-foreground">{insight.summary}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Analisis Tren
                    </h4>
                    <div style={{ width: "100%", height: 200 }}>
                      <ResponsiveContainer>
                        <LineChart
                          data={healthLog.map((entry) => ({
                            date: entry.date,
                            heartDisease: entry.heartDiseaseScore,
                            arrhythmia: entry.arrhythmiaScore,
                            geneticSADS: entry.geneticSADSScore,
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="heartDisease"
                            stroke="#ef4444"
                            name="Penyakit Jantung"
                          />
                          <Line
                            type="monotone"
                            dataKey="arrhythmia"
                            stroke="#fb923c"
                            name="Aritmia"
                          />
                          <Line
                            type="monotone"
                            dataKey="geneticSADS"
                            stroke="#facc15"
                            name="SADS"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-muted-foreground mt-2">
                      {insight.trendAnalysis}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Prediksi Jangka Panjang
                    </h4>
                    <p className="text-muted-foreground">
                      {insight.longTermPrediction}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeartRiskCalculator;
