// src/components/landing/AritmiaCommandCenter.tsx

import React, { useState, useEffect, useRef } from "react";
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

type ProfileKey = keyof typeof careProfiles;
type Medication = { id: string; name: string; dosage: string };
type DailyLog = {
  checklist: { [taskId: string]: boolean };
  medLog: { [medId: string]: boolean };
  symptoms: { [symptomId: string]: boolean };
  vitals: { sys: string; dia: string; hr: string };
  notes: string;
};
type UserGoals = { targetSys: string; targetDia: string; activityGoal: string };
type AppData = {
  profile: ProfileKey;
  medications: Medication[];
  goals: UserGoals;
  dailyLogs: { [date: string]: DailyLog };
};

const AritmiaCommandCenter = () => {
  const [data, setData] = useState<AppData>({
    profile: "general",
    medications: [],
    goals: { targetSys: "130", targetDia: "80", activityGoal: "5" },
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

  const todayString = currentDate.toISOString().split("T")[0];
  const dailyLog: DailyLog = data.dailyLogs[todayString] || {
    checklist: {},
    medLog: {},
    symptoms: {},
    vitals: { sys: "", dia: "", hr: "" },
    notes: "",
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
    const newLog = { ...currentLog, [id]: !currentLog[id] };
    updateDailyLog(type, newLog);
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

  const exportData = () => {
    let summary = `<html><head><title>Laporan Kesehatan Jantung - ${todayString}</title><style>body{font-family:sans-serif;line-height:1.6;padding:20px}table{width:100%;border-collapse:collapse;margin-top:1em}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background-color:#f2f2f2}.header{text-align:center;border-bottom:2px solid #333;margin-bottom:20px}</style></head><body>`;
    summary += `<div class="header"><h1>Laporan Kesehatan Jantung</h1><h2>Profil Perawatan: ${
      careProfiles[data.profile].label
    }</h2><p>Periode Laporan: 7 Hari Terakhir</p></div>`;

    analysisData.forEach(({ date, log }) => {
      if (log) {
        summary += `<h3>Laporan untuk ${date}</h3>`;
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
            .join(", ") || "Tidak ada gejala tercatat"
        }</td></tr>`;
        summary += `<tr><td><b>Obat Diminum</b></td><td>${
          data.medications
            .filter((m) => log.medLog[m.id])
            .map((m) => `${m.name} (${m.dosage})`)
            .join(", ") || "Tidak ada obat tercatat"
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
    if (backupTextRef.current && backupTextRef.current.value) {
      if (
        window.confirm(
          "Yakin ingin menimpa data saat ini dengan data dari backup? Aksi ini tidak bisa dibatalkan."
        )
      ) {
        try {
          setData(JSON.parse(atob(backupTextRef.current.value)));
          showToast("Data berhasil dipulihkan!");
        } catch (e) {
          // DI SINI PERBAIKANNYA
          console.error("Proses restore gagal:", e);
          showToast("Gagal memulihkan. Kode backup tidak valid!");
        }
      }
    }
  };

  const profileData = careProfiles[data.profile];
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();
  const analysisData = weekDates.map((date) => ({
    date,
    log: data.dailyLogs[date],
  }));
  const totalActivity = analysisData.reduce(
    (acc, { log }) => acc + (log?.checklist["gen1"] ? 1 : 0),
    0
  );
  const symptomFrequency = commonSymptoms.map((s) => ({
    label: s.label,
    count: analysisData.reduce(
      (acc, { log }) => acc + (log?.symptoms[s.id] ? 1 : 0),
      0
    ),
  }));

  return (
    <section
      id="care-hub"
      className="py-20 sm:py-24 bg-slate-100 dark:bg-black/20"
    >
      {toast.show && (
        <div className="fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-pulse">
          {toast.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-gray-900/50 p-6 border-b dark:border-gray-700">
            <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <HeartPulse />
              Aritmia Command Center
            </CardTitle>
            <CardDescription className="text-center mt-2 dark:text-gray-400">
              Platform personal untuk manajemen, analisis, dan edukasi kesehatan
              jantung Anda.
            </CardDescription>
            <div className="mt-4 flex justify-center border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("daily")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "daily"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Data Harian
              </button>
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "analysis"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Analisis & Laporan
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {activeTab === "daily" && (
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
                        defaultValue={data.profile}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t dark:border-gray-700">
                    <div className="space-y-3">
                      <h3 className="font-bold flex items-center gap-2">
                        <ClipboardList />
                        Checklist & Tanda Vital
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
                        <Pill size={16} />
                        Log Obat
                      </h4>
                      {data.medications.map((m) => (
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
                      ))}
                      <hr className="dark:border-gray-600" />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Sistolik"
                          type="number"
                          value={dailyLog.vitals.sys}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateDailyLog("vitals", {
                              ...dailyLog.vitals,
                              hr: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold">Pelacak Gejala & Catatan</h3>
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
                      <hr className="dark:border-gray-600" />
                      <Textarea
                        className="h-40"
                        placeholder="Catat perasaan, aktivitas, atau pertanyaan untuk dokter..."
                        value={dailyLog.notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          updateDailyLog("notes", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-bold flex items-center text-red-800 dark:text-red-300">
                      <Info className="h-5 w-5 mr-2" />
                      Info: {profileData.label}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewMedName(e.target.value)
                      }
                    />
                    <Input
                      placeholder="Dosis (cth: 5mg)"
                      value={newMedDosage}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewMedDosage(e.target.value)
                      }
                    />
                  </div>
                  <Button onClick={addMedication} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Obat
                  </Button>
                </div>
              </div>
            )}
            {activeTab === "analysis" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border dark:border-gray-700 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <TrendingUp />
                      Target & Pencapaian
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="w-1/3 text-sm">Target TD</label>
                        <div className="flex gap-2">
                          <Input
                            value={data.goals.targetSys}
                            onChange={(e) =>
                              updateData("goals", {
                                ...data.goals,
                                targetSys: e.target.value,
                              })
                            }
                            placeholder="Sys"
                          />
                          <Input
                            value={data.goals.targetDia}
                            onChange={(e) =>
                              updateData("goals", {
                                ...data.goals,
                                targetDia: e.target.value,
                              })
                            }
                            placeholder="Dia"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="w-1/3 text-sm">
                          Target Aktivitas
                        </label>
                        <Input
                          value={data.goals.activityGoal}
                          onChange={(e) =>
                            updateData("goals", {
                              ...data.goals,
                              activityGoal: e.target.value,
                            })
                          }
                          placeholder="kali/minggu"
                        />
                      </div>
                      <div className="pt-2 border-t dark:border-gray-600">
                        <h4 className="font-semibold text-sm">
                          Progres Minggu Ini:
                        </h4>
                        <p className="text-sm">
                          Aktivitas Olahraga: {totalActivity} dari{" "}
                          {data.goals.activityGoal} kali tercapai.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border dark:border-gray-700 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <BarChart3 />
                      Frekuensi Gejala
                    </h3>
                    <div className="space-y-2">
                      {symptomFrequency.map((s) => (
                        <div
                          key={s.label}
                          className="grid grid-cols-3 items-center gap-2"
                        >
                          <span className="text-sm truncate">{s.label}</span>
                          <div className="col-span-2 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                            <div
                              className="bg-orange-500 h-4 rounded-full text-white text-xs flex items-center justify-center"
                              style={{ width: `${(s.count / 7) * 100}%` }}
                            >
                              {s.count > 0 ? s.count : ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4 border dark:border-gray-700 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">
                    Analisis Tanda Vital (7 Hari)
                  </h3>
                  <div className="flex justify-around items-end h-40 border-b-2 border-gray-300 dark:border-gray-600 mt-4">
                    {analysisData.map(({ date, log }) => (
                      <div
                        key={date}
                        className="text-center group w-1/7 relative"
                      >
                        <div
                          style={{
                            height: `${
                              log?.vitals?.sys
                                ? Math.max(0, parseInt(log.vitals.sys) - 60)
                                : 0
                            }px`,
                          }}
                          className="bg-blue-500 w-4 mx-auto rounded-t transition-all hover:bg-blue-400"
                          title={`Sistolik: ${log?.vitals?.sys || "N/A"}`}
                        ></div>
                        <div
                          style={{
                            height: `${
                              log?.vitals?.dia
                                ? Math.max(0, parseInt(log.vitals.dia) - 40)
                                : 0
                            }px`,
                          }}
                          className="bg-sky-400 w-4 mx-auto rounded-t mt-1 transition-all hover:bg-sky-300"
                          title={`Diastolik: ${log?.vitals?.dia || "N/A"}`}
                        ></div>
                        <p className="text-xs mt-1">
                          {new Date(date + "T00:00:00").toLocaleDateString(
                            "id-ID",
                            { weekday: "short" }
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border dark:border-gray-700 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Printer />
                      Laporan Kesehatan
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Buat ringkasan data kesehatan Anda untuk dicetak atau
                      disimpan, sangat berguna saat bertemu dokter.
                    </p>
                    <Button onClick={exportData} className="w-full">
                      Cetak / Simpan Laporan
                    </Button>
                  </div>
                  <div className="p-4 border dark:border-gray-700 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <ShieldCheck />
                      Cadangkan & Pulihkan
                    </h3>
                    <Textarea
                      ref={backupTextRef}
                      className="h-20"
                      placeholder="Klik 'Backup' untuk buat kode. Tempel kode di sini lalu klik 'Restore'."
                    />
                    <div className="flex gap-4 mt-2">
                      <Button onClick={handleBackup} className="w-full">
                        <CloudUpload className="mr-2 h-4 w-4" />
                        Backup
                      </Button>
                      <Button
                        onClick={handleRestore}
                        variant="outline"
                        className="w-full"
                      >
                        <CloudDownload className="mr-2 h-4 w-4" />
                        Restore
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AritmiaCommandCenter;
