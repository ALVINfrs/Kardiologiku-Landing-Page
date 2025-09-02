import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Play,
  Pause,
  TrendingUp,
  Clock,
  Stethoscope,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const aritmiaQuestions = [
  {
    id: 1,
    question: "Apa yang dimaksud dengan aritmia?",
    options: [
      "Gangguan pada irama detak jantung",
      "Tekanan darah tinggi",
      "Nyeri pada dada",
      "Pembengkakan jantung",
    ],
    correct: 0,
    explanation:
      "Aritmia adalah kondisi di mana irama detak jantung tidak normal - bisa terlalu cepat, terlalu lambat, atau tidak teratur.",
    difficulty: "easy",
  },
  {
    id: 2,
    question: "Manakah yang merupakan jenis aritmia?",
    options: ["Takikardia", "Bradikardia", "Fibrilasi atrium", "Semua benar"],
    correct: 3,
    explanation:
      "Takikardia (detak terlalu cepat), Bradikardia (detak terlalu lambat), dan Fibrilasi atrium semuanya adalah jenis aritmia.",
    difficulty: "medium",
  },
  {
    id: 3,
    question: "Berapa detak jantung yang dikategorikan Takikardia?",
    options: [
      ">100 detak/menit",
      ">80 detak/menit",
      ">120 detak/menit",
      ">90 detak/menit",
    ],
    correct: 0,
    explanation:
      "Takikardia terjadi ketika detak jantung melebihi 100 kali per menit dalam kondisi istirahat.",
    difficulty: "medium",
  },
  {
    id: 4,
    question: "Apa gejala umum aritmia?",
    options: [
      "Jantung berdebar",
      "Pusing dan lelah",
      "Sesak napas",
      "Semua benar",
    ],
    correct: 3,
    explanation:
      "Semua gejala tersebut bisa mengindikasikan aritmia. Jika mengalami gejala ini, segera konsultasi dengan dokter.",
    difficulty: "easy",
  },
  {
    id: 5,
    question: "Apa penyebab utama fibrilasi atrium?",
    options: [
      "Konsumsi kafein berlebihan",
      "Penyakit jantung koroner",
      "Stres dan kurang tidur",
      "Semua dapat menjadi penyebab",
    ],
    correct: 3,
    explanation:
      "Fibrilasi atrium dapat disebabkan oleh berbagai faktor termasuk penyakit jantung, gaya hidup, dan kondisi medis lainnya.",
    difficulty: "hard",
  },
  {
    id: 6,
    question: "Kapan sebaiknya segera mencari bantuan medis untuk aritmia?",
    options: [
      "Ketika merasa pusing ringan",
      "Saat nyeri dada disertai sesak napas berat",
      "Setelah minum kopi",
      "Hanya saat check-up rutin",
    ],
    correct: 1,
    explanation:
      "Nyeri dada yang disertai sesak napas berat adalah tanda darurat medis yang memerlukan penanganan segera.",
    difficulty: "hard",
  },
  // Tambahan pertanyaan untuk kompleksitas
  {
    id: 7,
    question: "Apa yang dimaksud dengan blok jantung?",
    options: [
      "Pemblokiran arteri jantung",
      "Gangguan konduksi listrik jantung",
      "Infeksi pada katup jantung",
      "Pembengkakan miokardium",
    ],
    correct: 1,
    explanation:
      "Blok jantung adalah gangguan pada sistem konduksi listrik jantung yang dapat menyebabkan detak jantung lambat atau tidak teratur.",
    difficulty: "hard",
  },
  {
    id: 8,
    question: "Metode diagnosis aritmia yang umum adalah?",
    options: ["EKG", "MRI", "CT Scan", "USG"],
    correct: 0,
    explanation:
      "Elektrokardiogram (EKG) adalah metode utama untuk mendeteksi aritmia dengan merekam aktivitas listrik jantung.",
    difficulty: "medium",
  },
];

const symptomsChecklist = [
  {
    id: 1,
    symptom: "Jantung berdebar kencang",
    severity: "medium",
    category: "Rhythm",
  },
  {
    id: 2,
    symptom: "Detak jantung tidak teratur",
    severity: "high",
    category: "Rhythm",
  },
  {
    id: 3,
    symptom: "Pusing atau merasa ingin pingsan",
    severity: "high",
    category: "Circulation",
  },
  { id: 4, symptom: "Sesak napas", severity: "high", category: "Respiratory" },
  {
    id: 5,
    symptom: "Nyeri atau tekanan di dada",
    severity: "critical",
    category: "Pain",
  },
  {
    id: 6,
    symptom: "Keringat dingin",
    severity: "medium",
    category: "Autonomic",
  },
  {
    id: 7,
    symptom: "Kelelahan yang berlebihan",
    severity: "low",
    category: "General",
  },
  {
    id: 8,
    symptom: "Kesulitan bernafas saat beraktivitas",
    severity: "medium",
    category: "Respiratory",
  },
  {
    id: 9,
    symptom: "Merasa cemas atau panik",
    severity: "low",
    category: "Psychological",
  },
  {
    id: 10,
    symptom: "Pingsan atau hampir pingsan",
    severity: "critical",
    category: "Circulation",
  },
  // Tambahan gejala untuk kompleksitas
  {
    id: 11,
    symptom: "Pembengkakan pada kaki atau pergelangan",
    severity: "medium",
    category: "Circulation",
  },
  {
    id: 12,
    symptom: "Denyut nadi lemah",
    severity: "high",
    category: "Rhythm",
  },
];

const heartRateRanges = {
  bradycardia: {
    min: 40,
    max: 59,
    label: "Bradikardia",
    color: "text-blue-600 dark:text-blue-400",
  },
  normal: {
    min: 60,
    max: 100,
    label: "Normal",
    color: "text-green-600 dark:text-green-400",
  },
  tachycardia: {
    min: 101,
    max: 180,
    label: "Takikardia",
    color: "text-red-600 dark:text-red-400",
  },
};

export default function HeartQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [checkedSymptoms, setCheckedSymptoms] = useState<number[]>([]);
  const [heartRate, setHeartRate] = useState<number>(75);
  const [heartRateHistory, setHeartRateHistory] = useState<
    { time: number; rate: number }[]
  >([]);
  const [showRiskLevel, setShowRiskLevel] = useState(false);
  const [isBeating, setIsBeating] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [, setQuestionStartTime] = useState(Date.now());
  const [activeTab, setActiveTab] = useState<"quiz" | "symptoms" | "monitor">(
    "monitor"
  );
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [symptomCategories, setSymptomCategories] = useState<string[]>([]);

  // Timer effect for overall time
  useEffect(() => {
    if (!quizCompleted && activeTab === "quiz") {
      const timer = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizCompleted, activeTab]);

  // Heart rate simulation with history logging
  useEffect(() => {
    const interval = setInterval(() => {
      if (isBeating) {
        const variation = Math.floor(Math.random() * 6) - 3;
        const newRate = Math.max(45, Math.min(170, heartRate + variation));
        setHeartRate(newRate);
        setHeartRateHistory((prev) => [
          ...prev.slice(-19), // Keep last 20 readings
          { time: Date.now(), rate: newRate },
        ]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isBeating, heartRate]);

  const getHeartRateCategory = (rate: number) => {
    if (rate < 60) return heartRateRanges.bradycardia;
    if (rate > 100) return heartRateRanges.tachycardia;
    return heartRateRanges.normal;
  };

  const handleSymptomCheck = (symptomId: number) => {
    setCheckedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
    // Update categories
    const symptom = symptomsChecklist.find((s) => s.id === symptomId);
    if (symptom) {
      setSymptomCategories((prev) => {
        const newCats = new Set(prev);
        if (checkedSymptoms.includes(symptomId)) {
          newCats.delete(symptom.category);
        } else {
          newCats.add(symptom.category);
        }
        return Array.from(newCats);
      });
    }
  };

  const calculateRisk = () => {
    const criticalSymptoms = checkedSymptoms.filter((id) => {
      const symptom = symptomsChecklist.find((s) => s.id === id);
      return symptom?.severity === "critical";
    }).length;

    const highSymptoms = checkedSymptoms.filter((id) => {
      const symptom = symptomsChecklist.find((s) => s.id === id);
      return symptom?.severity === "high";
    }).length;

    const riskScore =
      criticalSymptoms * 30 +
      highSymptoms * 15 +
      checkedSymptoms.length * 5 +
      symptomCategories.length * 10; // Bonus for category diversity
    setShowRiskLevel(true);
    return Math.min(riskScore, 100);
  };

  const getRiskRecommendations = (riskScore: number) => {
    if (riskScore > 60) {
      return [
        "Segera hubungi layanan darurat medis.",
        "Hindari aktivitas fisik berat.",
        "Catat semua gejala dan waktu kemunculannya.",
      ];
    } else if (riskScore > 30) {
      return [
        "Jadwalkan konsultasi dengan dokter spesialis jantung.",
        "Pantau detak jantung secara rutin.",
        "Kurangi konsumsi kafein dan alkohol.",
      ];
    } else {
      return [
        "Lanjutkan gaya hidup sehat.",
        "Lakukan olahraga ringan secara teratur.",
        "Periksa kesehatan jantung tahunan.",
      ];
    }
  };

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    if (optionIndex === aritmiaQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < aritmiaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
    } else {
      setQuizCompleted(true);
      setQuizAttempts(quizAttempts + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setTimeSpent(0);
    setQuestionStartTime(Date.now());
  };

  const toggleHeartbeat = () => {
    setIsBeating(!isBeating);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const HeartRateMonitor = () => {
    const category = getHeartRateCategory(heartRate);
    const chartData = heartRateHistory.map((entry, index) => ({
      name: `T${index + 1}`,
      bpm: entry.rate,
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-red-500" />
            Monitor Detak Jantung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <motion.div
              animate={{
                scale: isBeating ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="text-red-500 text-8xl mb-4 cursor-pointer select-none"
              onClick={toggleHeartbeat}
            >
              <Heart className="w-20 h-20 mx-auto" fill="currentColor" />
            </motion.div>

            <div className="space-y-2">
              <div className="text-4xl font-bold">{heartRate} BPM</div>
              <Badge variant="secondary" className={category.color}>
                {category.label}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {isBeating ? "Klik jantung untuk pause" : "Klik untuk mulai"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="h-[200px]">
            <ChartContainer
              config={{ bpm: { label: "BPM", color: "hsl(var(--primary))" } }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="bpm" fill="hsl(var(--primary))" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={toggleHeartbeat}
              className="flex-1"
              variant={isBeating ? "destructive" : "default"}
            >
              {isBeating ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setHeartRateHistory([])}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset History
            </Button>
          </div>

          <Alert variant="default">
            <Stethoscope className="h-4 w-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>
              Ini adalah simulasi. Gunakan perangkat medis nyata untuk
              pengukuran akurat.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  };

  const SymptomsChecker = () => {
    const riskScore = showRiskLevel ? calculateRisk() : 0;
    const recommendations = getRiskRecommendations(riskScore);
    const groupedSymptoms = symptomsChecklist.reduce(
      (acc: Record<string, typeof symptomsChecklist>, symptom) => {
        if (!acc[symptom.category]) acc[symptom.category] = [];
        acc[symptom.category].push(symptom);
        return acc;
      },
      {}
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            Cek Gejala Aritmia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedSymptoms).map(([category, symptoms]) => (
            <div key={category}>
              <h3 className="font-semibold mb-2">{category} Symptoms</h3>
              <div className="space-y-3">
                {symptoms.map((item) => {
                  const isChecked = checkedSymptoms.includes(item.id);
                  return (
                    <TooltipProvider key={item.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                              isChecked
                                ? "bg-destructive/10 border-destructive"
                                : "bg-muted/50 hover:bg-muted"
                            }`}
                            onClick={() => handleSymptomCheck(item.id)}
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() =>
                                handleSymptomCheck(item.id)
                              }
                              className="mr-3"
                            />
                            <span className="flex-1">{item.symptom}</span>
                            <Badge
                              variant={
                                item.severity === "critical"
                                  ? "destructive"
                                  : item.severity === "high"
                                  ? "secondary" // ganti dari warning ke secondary
                                  : item.severity === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item.severity}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Klik untuk toggle gejala ini</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          ))}

          <Button
            onClick={() => calculateRisk()}
            disabled={checkedSymptoms.length === 0}
            className="w-full"
          >
            Analisis Risiko ({checkedSymptoms.length} gejala dipilih)
          </Button>

          <AnimatePresence>
            {showRiskLevel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                // ...existing code...
                <Alert
                  variant={
                    riskScore > 60 ? "destructive" : "default" // Ubah semua variant menjadi "default" atau "destructive" saja
                  }
                >
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Tingkat Risiko: {riskScore}%</AlertTitle>
                  <AlertDescription>
                    {riskScore > 60
                      ? "🚨 RISIKO TINGGI: Anda sangat disarankan untuk SEGERA berkonsultasi dengan dokter kardiologi."
                      : riskScore > 30
                      ? "⚠️ RISIKO SEDANG: Disarankan untuk berkonsultasi dengan dokter dalam waktu dekat."
                      : "✅ RISIKO RENDAH: Tetap pantau kondisi Anda dan konsultasikan jika gejala bertambah."}
                  </AlertDescription>
                </Alert>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Rekomendasi:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-muted-foreground">
                  Analisis berdasarkan {checkedSymptoms.length} dari{" "}
                  {symptomsChecklist.length} gejala dan{" "}
                  {symptomCategories.length} kategori.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    );
  };

  const QuizSection = () => {
    if (quizCompleted) {
      const percentage = Math.round((score / aritmiaQuestions.length) * 100);
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              Kuis Selesai!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-2xl font-semibold">
                Skor: {score}/{aritmiaQuestions.length}
              </p>
              <Progress value={percentage} className="w-[60%] mx-auto" />
              <p className="text-lg">Persentase: {percentage}%</p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Waktu: {formatTime(timeSpent)}</span>
              </div>
              <Badge variant="secondary">Percobaan ke-{quizAttempts}</Badge>
            </div>

            <Alert variant="default">
              <AlertDescription>
                {score === aritmiaQuestions.length
                  ? "🎉 Sempurna! Anda memiliki pemahaman yang sangat baik tentang aritmia."
                  : score >= aritmiaQuestions.length * 0.8
                  ? "👏 Bagus sekali! Pengetahuan Anda tentang aritmia sudah baik."
                  : score >= aritmiaQuestions.length * 0.6
                  ? "👍 Cukup baik! Masih ada ruang untuk belajar lebih lanjut."
                  : "💪 Jangan menyerah! Pelajari lebih lanjut tentang aritmia untuk kesehatan jantung yang lebih baik."}
              </AlertDescription>
            </Alert>

            <Button onClick={resetQuiz} className="mx-auto">
              <RotateCcw className="w-4 h-4 mr-2" />
              Ulangi Kuis
            </Button>
          </CardContent>
        </Card>
      );
    }

    const currentQ = aritmiaQuestions[currentQuestion];
    const progress =
      ((currentQuestion + (showExplanation ? 1 : 0)) /
        aritmiaQuestions.length) *
      100;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Kuis Pengetahuan Aritmia
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(timeSpent)}
              </div>
              <Badge
                variant={
                  currentQ.difficulty === "easy"
                    ? "secondary" // ganti success ke secondary
                    : currentQ.difficulty === "medium"
                    ? "default"
                    : "destructive"
                }
              >
                {currentQ.difficulty}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Pertanyaan {currentQuestion + 1} dari {aritmiaQuestions.length}
              </span>
              <span>
                Skor: {score}/{currentQuestion + (showExplanation ? 1 : 0)}
              </span>
            </div>
            <Progress value={progress} />
          </div>

          <h3 className="text-xl font-semibold">{currentQ.question}</h3>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              let variant: "default" | "outline" | "secondary" | "destructive" =
                "outline";
              if (selectedAnswer !== null) {
                if (selectedAnswer === index) {
                  variant =
                    index === currentQ.correct ? "default" : "destructive"; // ganti success ke default
                } else if (index === currentQ.correct) {
                  variant = "default"; // ganti success ke default
                } else {
                  variant = "secondary";
                }
              }

              return (
                <Button
                  key={index}
                  variant={variant}
                  className="w-full justify-start text-left h-auto py-4"
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="mr-3 w-6 h-6 rounded-full border flex items-center justify-center text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                  {selectedAnswer !== null && index === currentQ.correct && (
                    <CheckCircle className="w-5 h-5 ml-auto" />
                  )}
                  {selectedAnswer === index && index !== currentQ.correct && (
                    <XCircle className="w-5 h-5 ml-auto" />
                  )}
                </Button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Alert variant="default">
                  <AlertTitle>Penjelasan:</AlertTitle>
                  <AlertDescription>{currentQ.explanation}</AlertDescription>
                </Alert>
                {currentQuestion < aritmiaQuestions.length - 1 ? (
                  <Button onClick={nextQuestion} className="w-full">
                    Pertanyaan Selanjutnya →
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    variant="default" // ganti success ke default
                    className="w-full"
                  >
                    Selesaikan Kuis ✓
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitor">
            <Activity className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="symptoms">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Gejala</span>
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Heart className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Kuis</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="monitor">
          <HeartRateMonitor />
        </TabsContent>
        <TabsContent value="symptoms">
          <SymptomsChecker />
        </TabsContent>
        <TabsContent value="quiz">
          <QuizSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
