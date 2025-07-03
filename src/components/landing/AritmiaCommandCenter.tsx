// src/components/landing/AritmiaCommandCenter.tsx

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Pill,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Printer,
  PlusCircle,
  Trash2,
  TrendingUp,
  CloudUpload,
  CloudDownload,
  Info,
  ShieldCheck,
  BrainCircuit,
  Sparkles,
  Award,
  Flame,
  Bike,
  Footprints,
  PersonStanding,
  Dumbbell,
  Brain,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- DATABASE INTERNAL & STRUKTUR TIPE DATA ---
const careProfiles = {
  general: {
    label: "Kesehatan Jantung Umum",
    info: "Fokus pada pola makan, olahraga, manajemen stres, dan berat badan ideal.",
    details: {
      triggers: "Gaya hidup tidak sehat, stres, kurang tidur.",
      whenToCallDoctor:
        "Jika mengalami nyeri dada, sesak napas berat, atau pusing berulang.",
    },
    tasks: [
      { id: "gen1", text: "Olahraga ringan 30 menit" },
      { id: "gen2", text: "Konsumsi makanan sehat jantung" },
    ],
  },
  atrial_fibrillation: {
    label: "Fibrilasi Atrium (AF)",
    info: "Detak jantung cepat dan tidak teratur. Risiko utama adalah stroke.",
    details: {
      triggers: "Hipertensi, penyakit jantung, alkohol, kafein, stres.",
      whenToCallDoctor:
        "Gejala stroke (wajah miring, lengan lemah, bicara pelo), detak sangat cepat, pingsan.",
    },
    tasks: [
      { id: "af1", text: "Minum obat pengencer darah" },
      { id: "af2", text: "Minum obat pengontrol irama/laju" },
    ],
  },
  vt: {
    label: "Takikardia Ventrikel (VT)",
    info: "Detak cepat dari bilik jantung, bisa mengancam nyawa.",
    details: {
      triggers: "Penyakit jantung koroner, kardiomiopati, gangguan elektrolit.",
      whenToCallDoctor:
        "Setiap episode VT, terutama jika disertai pusing atau pingsan. Hubungi UGD.",
    },
    tasks: [
      { id: "vt1", text: "Minum obat antiaritmia" },
      { id: "vt2", text: "Pastikan perangkat ICD berfungsi (jika ada)" },
    ],
  },
  brugada: {
    label: "Sindrom Brugada",
    info: "Kelainan genetik yang berisiko irama fatal. Hindari pemicu adalah kunci.",
    details: {
      triggers:
        "Demam tinggi, beberapa jenis obat (anestesi, anti-depresan), kokain.",
      whenToCallDoctor:
        "Pingsan tanpa sebab, kejang, atau riwayat keluarga henti jantung mendadak.",
    },
    tasks: [
      { id: "brg1", text: "Hindari daftar obat pemicu" },
      { id: "brg2", text: "Segera obati demam" },
    ],
  },
  ist: {
    label: "Inappropriate Sinus Tachycardia (IST)",
    info: "Detak jantung sinus yang lebih cepat dari normal tanpa pemicu yang jelas.",
    details: {
      triggers: "Dehidrasi, stres, dekondisi fisik.",
      whenToCallDoctor:
        "Jika detak jantung saat istirahat sangat tinggi dan mengganggu kualitas hidup.",
    },
    tasks: [
      { id: "ist1", text: "Tingkatkan asupan cairan & elektrolit" },
      { id: "ist2", text: "Minum obat (beta-blocker/ivabradine)" },
    ],
  },
  av_block: {
    label: "AV Block (Blok Jantung)",
    info: "Gangguan sinyal listrik, menyebabkan detak lambat.",
    details: {
      triggers:
        "Kerusakan jaringan jantung karena usia, penyakit jantung, efek samping obat.",
      whenToCallDoctor:
        "Pusing hebat, hampir pingsan, kelelahan ekstrem yang tidak biasa.",
    },
    tasks: [
      { id: "avb1", text: "Monitor gejala (pusing, kelelahan)" },
      { id: "avb2", text: "Periksa jadwal kontrol alat pacu jantung" },
    ],
  },
};
const commonSymptoms = [
  { id: "sym1", label: "Pusing / Kepala Ringan" },
  { id: "sym2", label: "Jantung Berdebar (Palpitasi)" },
  { id: "sym3", label: "Nyeri Dada" },
  { id: "sym4", label: "Sesak Napas" },
  { id: "sym5", label: "Kelelahan Ekstrem" },
];

const commonActivities = [
  { id: "walk", label: "Jalan Kaki", icon: Footprints },
  { id: "run", label: "Lari Ringan", icon: PersonStanding },
  { id: "cycle", label: "Bersepeda", icon: Bike },
  { id: "gym", label: "Angkat Beban", icon: Dumbbell },
  { id: "mindful", label: "Yoga/Meditasi", icon: Brain },
];
const moodOptions = [
  { id: "great", label: "Sangat Baik", icon: "😃" },
  { id: "good", label: "Baik", icon: "🙂" },
  { id: "neutral", label: "Biasa Saja", icon: "😐" },
  { id: "bad", label: "Kurang Baik", icon: "😟" },
  { id: "terrible", label: "Sangat Buruk", icon: "😩" },
];

type ProfileKey = keyof typeof careProfiles;
type Medication = { id: string; name: string; dosage: string };
type ActivityLog = { id: string; type: string; duration: number };
type Mood = "great" | "good" | "neutral" | "bad" | "terrible";

type DailyLog = {
  checklist: { [taskId: string]: boolean };
  medLog: { [medId: string]: boolean };
  symptoms: { [symptomId: string]: boolean };
  vitals: { sys: string; dia: string; hr: string };
  notes: string;
  activities: ActivityLog[];
  mood?: Mood;
};

type UserGoals = {
  targetSys: string;
  targetDia: string;
  activityGoalMinutes: string;
};
type AppData = {
  profile: ProfileKey;
  medications: Medication[];
  goals: UserGoals;
  dailyLogs: { [date: string]: DailyLog };
};
type Insight = { text: string; type: "positive" | "warning" | "info" };

const AritmiaCommandCenter = () => {
  const [data, setData] = useState<AppData>({
    profile: "general",
    medications: [],
    goals: { targetSys: "130", targetDia: "80", activityGoalMinutes: "150" },
    dailyLogs: {},
  });
  const [activeTab, setActiveTab] = useState<"daily" | "analysis">("daily");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: "",
    show: false,
  });
  const backupTextRef = useRef<HTMLTextAreaElement>(null);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("");
  const [dateRange, setDateRange] = useState<7 | 30 | 90>(7);
  const [newActivityType, setNewActivityType] = useState(
    commonActivities[0].id
  );
  const [newActivityDuration, setNewActivityDuration] = useState("");

  const todayString = currentDate.toISOString().split("T")[0];
  const dailyLog: DailyLog = data.dailyLogs[todayString] || {
    checklist: {},
    medLog: {},
    symptoms: {},
    vitals: { sys: "", dia: "", hr: "" },
    notes: "",
    activities: [],
  };

  useEffect(() => {
    const savedData = localStorage.getItem("AritmiaCommandCenterData_v4");
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Gagal memuat data:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("AritmiaCommandCenterData_v4", JSON.stringify(data));
  }, [data]);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };
  const updateData = <K extends keyof AppData>(field: K, value: AppData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };
  const updateDailyLog = <K extends keyof DailyLog>(
    field: K,
    value: DailyLog[K]
  ) => {
    const newLog = { ...dailyLog, [field]: value };
    updateData("dailyLogs", { ...data.dailyLogs, [todayString]: newLog });
  };
  const handleCheckboxChange = (
    type: "checklist" | "medLog" | "symptoms",
    id: string
  ) => {
    const currentLog = dailyLog[type];
    updateDailyLog(type, { ...currentLog, [id]: !currentLog[id] });
  };
  const addMedication = () => {
    if (newMedName && newMedDosage) {
      updateData("medications", [
        ...data.medications,
        { id: `med_${Date.now()}`, name: newMedName, dosage: newMedDosage },
      ]);
      setNewMedName("");
      setNewMedDosage("");
      showToast("Obat berhasil ditambahkan!");
    }
  };
  const deleteMedication = (medId: string) => {
    updateData(
      "medications",
      data.medications.filter((med) => med.id !== medId)
    );
    showToast("Obat berhasil dihapus.");
  };

  const addActivityHandler = () => {
    if (
      newActivityType &&
      newActivityDuration &&
      parseInt(newActivityDuration) > 0
    ) {
      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        type:
          commonActivities.find((a) => a.id === newActivityType)?.label ||
          "Aktivitas",
        duration: parseInt(newActivityDuration),
      };
      updateDailyLog("activities", [...dailyLog.activities, newActivity]);
      setNewActivityDuration("");
    }
  };
  const deleteActivityHandler = (activityId: string) => {
    updateDailyLog(
      "activities",
      dailyLog.activities.filter((a) => a.id !== activityId)
    );
  };
  const setMoodHandler = (mood: Mood) => {
    updateDailyLog("mood", mood);
  };

  const analysisData = useMemo(() => {
    const dates = Array.from({ length: dateRange }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();
    return dates.map((date) => ({
      date,
      shortDate: new Date(date + "T00:00:00").toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      log: data.dailyLogs[date],
      sys: data.dailyLogs[date]?.vitals.sys
        ? parseInt(data.dailyLogs[date].vitals.sys)
        : null,
      dia: data.dailyLogs[date]?.vitals.dia
        ? parseInt(data.dailyLogs[date].vitals.dia)
        : null,
      hr: data.dailyLogs[date]?.vitals.hr
        ? parseInt(data.dailyLogs[date].vitals.hr)
        : null,
    }));
  }, [data.dailyLogs, dateRange]);
  const generateDailyInsight = (
    log: DailyLog,
    meds: Medication[]
  ): Insight | null => {
    if (
      !log ||
      Object.keys(log.vitals).every(
        (k) => !log.vitals[k as keyof typeof log.vitals]
      )
    ) {
      return {
        text: "Belum ada data tercatat untuk hari ini. Silakan isi log harian Anda.",
        type: "info",
      };
    }

    const { vitals, symptoms, activities, mood, medLog } = log;
    const sys = vitals.sys ? parseInt(vitals.sys) : 0;
    const dia = vitals.dia ? parseInt(vitals.dia) : 0;
    const hr = vitals.hr ? parseInt(vitals.hr) : 0;
    const hasSymptoms = Object.values(symptoms).some((s) => s);

    // Aturan Prioritas #1: Peringatan Kritis (Kombinasi)
    if (sys > 140 && hasSymptoms) {
      return {
        text: "Tekanan darah Anda tinggi disertai gejala. Ini adalah kombinasi yang perlu diwaspadai. Cukup istirahat.",
        type: "warning",
      };
    }
    if ((mood === "bad" || mood === "terrible") && hasSymptoms) {
      return {
        text: "Anda melaporkan gejala di hari dengan mood buruk. Perhatikan korelasi antara stres dan gejala Anda.",
        type: "warning",
      };
    }

    // Aturan Prioritas #2: Peringatan Tanda Vital
    if (sys > 140 || dia > 90) {
      return {
        text: `Tekanan darah Anda hari ini (${sys}/${dia}) tergolong tinggi. Pantau terus dan hindari makanan asin.`,
        type: "warning",
      };
    }
    if (hr > 100) {
      return {
        text: `Nadi istirahat Anda (${hr} bpm) tergolong cepat (Takikardia). Pastikan Anda cukup terhidrasi.`,
        type: "warning",
      };
    }
    if (hr > 0 && hr < 50) {
      return {
        text: `Nadi istirahat Anda (${hr} bpm) tergolong lambat (Bradikardia). Jika disertai pusing, segera konsultasi.`,
        type: "warning",
      };
    }

    // Aturan Prioritas #3: Pujian & Dorongan (Bervariasi)
    const totalMinutes = activities.reduce((sum, act) => sum + act.duration, 0);
    if (totalMinutes > 0) {
      const praises = [
        `Kerja bagus! Anda telah aktif selama ${totalMinutes} menit hari ini. 🏆`,
        `Luar biasa! ${totalMinutes} menit aktivitas tercatat hari ini. Terus bergerak!`,
      ];
      return {
        text: praises[Math.floor(Math.random() * praises.length)],
        type: "positive",
      };
    }

    const allMedsTaken = meds.length > 0 && meds.every((med) => medLog[med.id]);
    if (allMedsTaken) {
      return {
        text: "Hebat! Semua obat sudah diminum hari ini sesuai jadwal. ✅",
        type: "positive",
      };
    }

    // Aturan Prioritas #4: Pengingat & Info Umum
    if (meds.length > 0 && !allMedsTaken) {
      return {
        text: "Jangan lupa untuk mencatat obat yang sudah Anda minum hari ini.",
        type: "info",
      };
    }

    const nudges = [
      "Belum ada aktivitas tercatat hari ini. Coba luangkan 20 menit untuk jalan santai, jika kondisi memungkinkan.",
      "Bagaimana perasaan Anda hari ini? Jangan lupa catat mood dan gejala yang dirasakan.",
    ];
    return {
      text: nudges[Math.floor(Math.random() * nudges.length)],
      type: "info",
    };
  };
  const todayStr = new Date().toISOString().split("T")[0];
  const todayLog = data.dailyLogs[todayStr]; // ganti nama jadi todayLog

  const { insights, streaks, achievements } = useMemo(() => {
    const newInsights: Insight[] = [];
    const today = new Date();
    let consecutiveDays = 0;
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      if (data.dailyLogs[dateStr]) {
        consecutiveDays++;
      } else {
        if (i > 0) break;
      }
    }
    if (consecutiveDays > 2)
      newInsights.push({
        text: `Luar biasa! Anda telah mencatat data ${consecutiveDays} hari beruntun.`,
        type: "positive",
      });

    let highBPSymptomCount = 0;
    let highStressSymptomCount = 0;
    analysisData.forEach(({ log }) => {
      if (
        log &&
        log.vitals.sys &&
        parseInt(log.vitals.sys) > 140 &&
        (log.symptoms["sym1"] || log.symptoms["sym2"])
      )
        highBPSymptomCount++;
      if (
        log &&
        (log.mood === "bad" || log.mood === "terrible") &&
        Object.values(log.symptoms).some((s) => s)
      )
        highStressSymptomCount++;
    });
    if (highBPSymptomCount > 2)
      newInsights.push({
        text: `Terdeteksi pola: Gejala pusing/debaran sering muncul saat tekanan darah sistolik di atas 140.`,
        type: "warning",
      });
    if (highStressSymptomCount > 2)
      newInsights.push({
        text: `Pola terdeteksi: Gejala seringkali muncul pada hari-hari dengan tingkat stres/mood yang buruk.`,
        type: "warning",
      });
    const dailyInsight = generateDailyInsight(todayLog, data.medications);
    if (dailyInsight) {
      newInsights.push(dailyInsight);
    }

    const recent7Days = analysisData.slice(-7);
    const totalActivityMinutes = recent7Days.reduce((acc, { log }) => {
      const dailyTotal =
        log?.activities.reduce((sum, act) => sum + act.duration, 0) || 0;
      return acc + dailyTotal;
    }, 0);
    const activityGoalMet =
      totalActivityMinutes >= parseInt(data.goals.activityGoalMinutes);
    if (activityGoalMet)
      newInsights.push({
        text: `Selamat, target aktivitas mingguan (${data.goals.activityGoalMinutes} menit) Anda tercapai!`,
        type: "positive",
      });
    else if (recent7Days.length === 7)
      newInsights.push({
        text: `Target aktivitas minggu ini belum tercapai (${totalActivityMinutes}/${data.goals.activityGoalMinutes} menit). Tetap semangat!`,
        type: "info",
      });

    return {
      insights: newInsights,
      streaks: { logging: consecutiveDays },
      achievements: { activityGoal: activityGoalMet },
    };
  }, [
    analysisData,
    data.dailyLogs,
    data.goals.activityGoalMinutes,
    todayLog,
    data.medications,
  ]);

  const exportData = () => {
    let summary = `<html><head><title>Laporan Kesehatan Jantung - ${new Date().toLocaleDateString()}</title><style>body{font-family:sans-serif;line-height:1.6;padding:20px}table{width:100%;border-collapse:collapse;margin-top:1em}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background-color:#f2f2f2}.header{text-align:center;border-bottom:2px solid #333;margin-bottom:20px}</style></head><body>`;
    summary += `<div class="header"><h1>Laporan Kesehatan Jantung</h1><h2>Profil Perawatan: ${
      careProfiles[data.profile].label
    }</h2><p>Periode Laporan: ${dateRange} Hari Terakhir</p></div>`;
    analysisData.forEach(({ date, log }) => {
      if (log) {
        summary += `<h3>Laporan untuk ${new Date(
          date + "T00:00:00"
        ).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</h3>`;
        summary += "<table>";
        summary += `<tr><td><b>Tanda Vital</b></td><td>Tekanan Darah: ${
          log.vitals.sys || "N/A"
        }/${log.vitals.dia || "N/A"} mmHg | Nadi: ${
          log.vitals.hr || "N/A"
        } bpm</td></tr>`;
        summary += `<tr><td><b>Gejala</b></td><td>${
          commonSymptoms
            .filter((s) => log.symptoms[s.id])
            .map((s) => s.label)
            .join(", ") || "Tidak ada gejala"
        }</td></tr>`;
        summary += `<tr><td><b>Aktivitas</b></td><td>${
          log.activities
            .map((a) => `${a.type} (${a.duration} menit)`)
            .join(", ") || "Tidak ada aktivitas"
        }</td></tr>`;
        summary += `<tr><td><b>Mood/Stres</b></td><td>${
          moodOptions.find((m) => m.id === log.mood)?.label || "Tidak tercatat"
        }</td></tr>`;
        summary += `<tr><td><b>Obat Diminum</b></td><td>${
          data.medications
            .filter((m) => log.medLog[m.id])
            .map((m) => `${m.name} (${m.dosage})`)
            .join(", ") || "Tidak ada obat"
        }</td></tr>`;
        summary += `<tr><td><b>Catatan Harian</b></td><td>${
          log.notes || "Tidak ada catatan"
        }</td></tr>`;
        summary += "</table><br/>";
      }
    });
    summary += `</body></html>`;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(summary);
      win.document.close();
      win.print();
    }
  };
  const handleBackup = () => {
    if (backupTextRef.current) {
      backupTextRef.current.value = btoa(JSON.stringify(data));
      showToast("Data backup berhasil dibuat!");
    }
  };
  const handleRestore = () => {
    if (
      backupTextRef.current?.value &&
      window.confirm(
        "Yakin ingin menimpa data saat ini? Aksi ini tidak bisa dibatalkan."
      )
    ) {
      try {
        setData(JSON.parse(atob(backupTextRef.current.value)));
        showToast("Data berhasil dipulihkan!");
      } catch (e) {
        console.error("Restore gagal:", e);
        showToast("Gagal memulihkan. Kode backup tidak valid!");
      }
    }
  };

  const profileData = careProfiles[data.profile];

  return (
    <section
      id="care-hub"
      className="py-20 sm:py-24 bg-slate-100 dark:bg-black/20"
    >
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-gray-900/50 p-6 border-b dark:border-gray-700">
            <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <HeartPulse /> Aritmia Command Center
            </CardTitle>
            <CardDescription className="text-center mt-2 dark:text-gray-400">
              Dasbor cerdas untuk manajemen, analisis, dan edukasi kesehatan
              jantung Anda.
            </CardDescription>
            <div className="mt-4 flex justify-center border-b border-gray-200 dark:border-gray-700 relative">
              <button
                onClick={() => setActiveTab("daily")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "daily"
                    ? "text-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Data Harian
              </button>
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "analysis"
                    ? "text-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dasbor & Analisis
              </button>
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-[-1px] h-0.5 bg-red-600"
                style={{
                  width: activeTab === "daily" ? "95px" : "130px",
                  x: activeTab === "daily" ? "-62px" : "62px",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "daily" ? (
                <motion.div
                  key="daily"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4 p-4 border dark:border-gray-700 rounded-lg lg:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Profil Perawatan
                          </label>
                          <Select
                            onValueChange={(v: ProfileKey) =>
                              updateData("profile", v)
                            }
                            value={data.profile}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(careProfiles).map((k) => (
                                <SelectItem key={k} value={k}>
                                  {careProfiles[k as ProfileKey].label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-between items-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setCurrentDate(
                                (d) => new Date(d.setDate(d.getDate() - 1))
                              )
                            }
                          >
                            <ChevronLeft />
                          </Button>
                          <div className="text-center">
                            <label className="text-sm font-medium">
                              Tanggal Log
                            </label>
                            <span className="font-semibold text-lg block">
                              {todayString}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setCurrentDate(
                                (d) => new Date(d.setDate(d.getDate() + 1))
                              )
                            }
                          >
                            <ChevronRight />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 pt-4 border-t dark:border-gray-700">
                        <div className="space-y-3">
                          <h3 className="font-bold flex items-center gap-2">
                            <ClipboardList /> Checklist & Tanda Vital
                          </h3>
                          {profileData.tasks.map((t) => (
                            <div key={t.id} className="flex items-center">
                              <Checkbox
                                id={`task-${t.id}`}
                                checked={!!dailyLog.checklist[t.id]}
                                onCheckedChange={() =>
                                  handleCheckboxChange("checklist", t.id)
                                }
                              />
                              <label
                                htmlFor={`task-${t.id}`}
                                className="ml-2 text-sm"
                              >
                                {t.text}
                              </label>
                            </div>
                          ))}
                          <hr className="dark:border-gray-600" />
                          <h4 className="font-semibold flex items-center gap-2">
                            <Pill size={16} /> Log Obat
                          </h4>
                          {data.medications.length > 0 ? (
                            data.medications.map((m) => (
                              <div key={m.id} className="flex items-center">
                                <Checkbox
                                  id={`med-${m.id}`}
                                  checked={!!dailyLog.medLog[m.id]}
                                  onCheckedChange={() =>
                                    handleCheckboxChange("medLog", m.id)
                                  }
                                />
                                <label
                                  htmlFor={`med-${m.id}`}
                                  className="ml-2 text-sm"
                                >
                                  {m.name}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">
                              Belum ada obat. Tambahkan di kolom kanan.
                            </p>
                          )}
                          <hr className="dark:border-gray-600" />
                          <div className="flex gap-2">
                            <Input
                              placeholder="Sistolik"
                              type="number"
                              value={dailyLog.vitals.sys}
                              onChange={(e) =>
                                updateDailyLog("vitals", {
                                  ...dailyLog.vitals,
                                  sys: e.target.value,
                                })
                              }
                            />
                            <Input
                              placeholder="Diastolik"
                              type="number"
                              value={dailyLog.vitals.dia}
                              onChange={(e) =>
                                updateDailyLog("vitals", {
                                  ...dailyLog.vitals,
                                  dia: e.target.value,
                                })
                              }
                            />
                            <Input
                              placeholder="Nadi"
                              type="number"
                              value={dailyLog.vitals.hr}
                              onChange={(e) =>
                                updateDailyLog("vitals", {
                                  ...dailyLog.vitals,
                                  hr: e.target.value,
                                })
                              }
                            />
                          </div>
                          <hr className="dark:border-gray-600 !my-6" />
                          <h3 className="font-bold">Log Aktivitas Harian</h3>
                          <div className="space-y-2">
                            {dailyLog.activities.map((act) => (
                              <div
                                key={act.id}
                                className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md"
                              >
                                <span className="text-sm">
                                  {act.type} -{" "}
                                  <strong>{act.duration} menit</strong>
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => deleteActivityHandler(act.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                            {dailyLog.activities.length === 0 && (
                              <p className="text-xs text-gray-500">
                                Belum ada aktivitas tercatat hari ini.
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 items-center">
                            <Select
                              value={newActivityType}
                              onValueChange={setNewActivityType}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih aktivitas..." />
                              </SelectTrigger>
                              <SelectContent>
                                {commonActivities.map((act) => (
                                  <SelectItem key={act.id} value={act.id}>
                                    {act.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              className="w-28"
                              placeholder="Menit"
                              type="number"
                              value={newActivityDuration}
                              onChange={(e) =>
                                setNewActivityDuration(e.target.value)
                              }
                            />
                            <Button size="icon" onClick={addActivityHandler}>
                              <PlusCircle className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-bold">
                            Pelacak Gejala & Catatan
                          </h3>
                          {commonSymptoms.map((s) => (
                            <div key={s.id} className="flex items-center">
                              <Checkbox
                                id={`sym-${s.id}`}
                                checked={!!dailyLog.symptoms[s.id]}
                                onCheckedChange={() =>
                                  handleCheckboxChange("symptoms", s.id)
                                }
                              />
                              <label
                                htmlFor={`sym-${s.id}`}
                                className="ml-2 text-sm"
                              >
                                {s.label}
                              </label>
                            </div>
                          ))}
                          <hr className="dark:border-gray-600 !my-6" />
                          <h3 className="font-bold">
                            Level Stres / Mood Hari Ini
                          </h3>
                          <div className="flex justify-around items-center bg-slate-100 dark:bg-slate-900/50 p-2 rounded-lg">
                            {moodOptions.map((mood) => (
                              <button
                                key={mood.id}
                                title={mood.label}
                                onClick={() => setMoodHandler(mood.id as Mood)}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                  dailyLog.mood === mood.id
                                    ? "bg-red-200 dark:bg-red-500/50 scale-125"
                                    : "hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                              >
                                <span className="text-2xl">{mood.icon}</span>
                              </button>
                            ))}
                          </div>
                          <hr className="dark:border-gray-600 !my-6" />
                          <h3 className="font-bold">Catatan Harian</h3>
                          <Textarea
                            className="h-28"
                            placeholder="Catat perasaan, aktivitas, atau pertanyaan untuk dokter..."
                            value={dailyLog.notes}
                            onChange={(e) =>
                              updateDailyLog("notes", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 p-4 bg-slate-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <h4 className="font-bold flex items-center text-red-800 dark:text-red-300">
                          <Info className="h-5 w-5 mr-2" /> Info:{" "}
                          {profileData.label}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                          {profileData.info}
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="link"
                              className="p-0 h-auto text-red-600"
                            >
                              Pelajari Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{profileData.label}</DialogTitle>
                            </DialogHeader>
                            <h4 className="font-semibold">Pemicu Umum:</h4>
                            <p className="text-sm">
                              {profileData.details.triggers}
                            </p>
                            <h4 className="font-semibold mt-4">
                              Kapan Harus Menghubungi Dokter:
                            </h4>
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">
                              {profileData.details.whenToCallDoctor}
                            </p>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <h3 className="font-bold">Manajemen Daftar Obat</h3>
                      {data.medications.map((med) => (
                        <div
                          key={med.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>
                            {med.name} ({med.dosage})
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMedication(med.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nama Obat Baru"
                          value={newMedName}
                          onChange={(e) => setNewMedName(e.target.value)}
                        />
                        <Input
                          placeholder="Dosis (cth: 5mg)"
                          value={newMedDosage}
                          onChange={(e) => setNewMedDosage(e.target.value)}
                        />
                      </div>
                      <Button onClick={addMedication} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Obat
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BrainCircuit /> AI Insight Engine
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {insights.length > 0 ? (
                          insights.map((insight, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.2 }}
                              className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
                                insight.type === "warning"
                                  ? "bg-amber-100 dark:bg-amber-900/30"
                                  : "bg-slate-100 dark:bg-slate-900/50"
                              }`}
                            >
                              {insight.type === "warning" ? (
                                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <Sparkles className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                              )}
                              <p>{insight.text}</p>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            Belum ada insight. Terus catat data Anda setiap
                            hari!
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award /> Streak & Pencapaian
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Flame className="h-10 w-10 text-orange-500" />
                          <div>
                            <p className="text-3xl font-bold">
                              {streaks.logging}
                            </p>
                            <p className="text-sm text-gray-500">
                              Hari Logging Beruntun
                            </p>
                          </div>
                        </div>
                        <hr className="dark:border-gray-600" />
                        <div
                          className={`flex items-center justify-center gap-2 transition-opacity ${
                            achievements.activityGoal
                              ? "opacity-100"
                              : "opacity-40"
                          }`}
                        >
                          <TrendingUp className="h-8 w-8 text-green-500" />
                          <p className="text-sm">
                            Target Aktivitas Mingguan Tercapai
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 /> Analisis Tanda Vital
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Rentang:</span>
                          {[7, 30, 90].map((range) => (
                            <Button
                              key={range}
                              size="sm"
                              variant={
                                dateRange === range ? "default" : "outline"
                              }
                              onClick={() => setDateRange(range as 7 | 30 | 90)}
                            >
                              {range} Hari
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analysisData}
                          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-gray-200 dark:stroke-gray-700"
                          />
                          <XAxis
                            dataKey="shortDate"
                            tick={{ fontSize: 12 }}
                            className="fill-gray-600 dark:fill-gray-400"
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            className="fill-gray-600 dark:fill-gray-400"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(2px)",
                              border: "1px solid #ddd",
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: 14 }} />
                          <Line
                            type="monotone"
                            dataKey="sys"
                            name="Sistolik"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="dia"
                            name="Diastolik"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="hr"
                            name="Nadi"
                            stroke="#f97316"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Printer /> Laporan Kesehatan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Buat ringkasan data kesehatan Anda untuk dicetak atau
                          disimpan.
                        </p>
                        <Button onClick={exportData} className="w-full">
                          Cetak / Simpan Laporan
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShieldCheck /> Cadangkan & Pulihkan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          ref={backupTextRef}
                          className="h-20"
                          placeholder="Klik 'Backup' untuk buat kode. Tempel kode di sini lalu klik 'Restore'."
                        />
                        <div className="flex gap-4 mt-2">
                          <Button onClick={handleBackup} className="w-full">
                            <CloudUpload className="mr-2 h-4 w-4" /> Backup
                          </Button>
                          <Button
                            onClick={handleRestore}
                            variant="outline"
                            className="w-full"
                          >
                            <CloudDownload className="mr-2 h-4 w-4" /> Restore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AritmiaCommandCenter;
