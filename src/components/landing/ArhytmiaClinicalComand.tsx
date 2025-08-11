import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle,
  Dna,
  Heart,
  HeartCrack,
  HeartPulse,
  RadioTower,
  RotateCcw,
  Stethoscope,
  Zap,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- TIPE DATA & STRUKTUR (FIXED & LENGKAP) ---
type EKGPattern =
  | "normal"
  | "afib"
  | "aflutter"
  | "svt"
  | "vt_mono"
  | "vt_poly"
  | "vfib"
  | "brady"
  | "first_degree_block"
  | "third_degree_block"
  | "asystole"
  | "pvc";
type InterventionType =
  | "vagal"
  | "adenosine"
  | "amiodarone"
  | "beta_blocker"
  | "cardioversion"
  | "defibrillation"
  | "cpr"
  | "atropine"
  | "pacemaker";
type VitalSigns = { bpm: number; bp: string; spo2: number; stable: boolean };

interface CaseStudy {
  id: string;
  title: string;
  arrhythmiaType: EKGPattern;
  icon: React.ElementType; // <-- Icon akan kita pakai sekarang
  patient: {
    name: string;
    age: number;
    background: string;
    initialSymptoms: string;
  };
  initialVitals: VitalSigns;
  ekgDetails: {
    rhythm: string;
    p_wave: string;
    pr_interval: string;
    qrs_complex: string;
  };
  interventions: {
    [key in InterventionType]?: {
      success: boolean;
      outcomeDescription: string;
      resultingVitals: VitalSigns;
      resultingEKG: EKGPattern;
    };
  };
  learningPoints: string[];
  longTermManagement: string;
}

// --- DATABASE EKG PATHS (LENGKAP) ---
const EKG_PATHS_EXT = {
  normal:
    "M0 15 L20 15 L22 10 L26 20 L28 15 L32 17 L35 15 L65 15 L67 10 L71 20 L73 15 L77 17 L80 15 L100 15",
  afib: "M0 15 q2 2 4 0 t4 -1 t4 2 t4 -2 l2 -10 l2 10 q2 1 4 -1 t4 2 t4 -3 q2 2 4 0 t4 -1 t4 2",
  svt: "M0 15 L8 15 L10 5 L12 25 L14 15 L22 15 L24 5 L26 25 L28 15 L36 15 L38 5 L40 25 L42 15 L50 15",
  vt_mono:
    "M0 15 L5 15 L10 25 L15 5 L20 25 L25 5 L30 25 L35 5 L40 25 L45 5 L50 25 L55 5 L60 15 L100 15",
  vfib: "M0 15 q2 3 4 0 t4 -2 t4 3 t4 -1 q2 -3 4 0 t4 1 t4 -2 t4 2 q2 2 4 0 t4 -1 t4 3 t4 -2",
  brady:
    "M0 15 L30 15 L32 10 L36 20 L38 15 L42 17 L45 15 L90 15 L92 10 L96 20 L98 15 L100 15",
  asystole: "M0 15 L100 15",
  aflutter:
    "M0 15 l2 4 l2-4 l2 4 l2-4 l2 4 l2-4 l5 -8 l5 18 l5-10 l2 4 l2-4 l2 4 l2-4 l2 4 l2-4 l5 -8 l5 18 l5-10 l2 4 l2-4",
  vt_poly:
    "M0 15 l5 15 l5-20 l5 25 l5-25 l5 20 l5-15 l5 10 l5-5 l5 15 l5-20 l5 25 l5-25 l5 20",
  first_degree_block:
    "M0 15 L25 15 L27 10 L31 20 L33 15 L37 17 L40 15 L70 15 L72 10 L76 20 L78 15 L82 17 L85 15 L100 15",
  third_degree_block:
    "M0 15 l5-3 l5 3 l20 0 l5-3 l5 3 l5-10 l5 20 l5-12 l20 0 l5-3 l5 3",
  pvc: "M0 15 L20 15 L22 10 L26 20 L28 15 L35 15 L40 25 L45 0 L50 20 L55 15 L85 15 L87 10 L91 20 L93 15 L100 15",
};

// --- DATABASE KASUS KLINIS LENGKAP (12 KASUS) ---
const clinicalCases: CaseStudy[] = [
  {
    id: "svt_case",
    title: "SVT pada Mahasiswi",
    icon: Zap,
    arrhythmiaType: "svt",
    patient: {
      name: "Anita",
      age: 22,
      background: "Mahasiswi, sering konsumsi kopi.",
      initialSymptoms: "Berdebar sangat cepat, pusing saat presentasi.",
    },
    initialVitals: { bpm: 180, bp: "100/70", spo2: 98, stable: true },
    ekgDetails: {
      rhythm: "Regular, narrow-complex",
      p_wave: "Tidak terlihat",
      pr_interval: "N/A",
      qrs_complex: "Sempit",
    },
    interventions: {
      vagal: {
        success: true,
        outcomeDescription:
          "Manuver vagal berhasil mengembalikan irama normal.",
        resultingVitals: { bpm: 75, bp: "110/75", spo2: 99, stable: true },
        resultingEKG: "normal",
      },
      adenosine: {
        success: true,
        outcomeDescription:
          "Adenosine 6mg IV menghentikan SVT setelah jeda singkat.",
        resultingVitals: { bpm: 80, bp: "115/78", spo2: 99, stable: true },
        resultingEKG: "normal",
      },
    },
    learningPoints: [
      "SVT umum pada orang muda.",
      "Manuver vagal adalah pertolongan pertama.",
      "Adenosine sangat efektif di UGD.",
    ],
    longTermManagement:
      "Edukasi pemicu, pilihan obat harian atau ablasi kateter untuk penyembuhan.",
  },
  {
    id: "afib_case",
    title: "AFib RVR",
    icon: HeartPulse,
    arrhythmiaType: "afib",
    patient: {
      name: "Ibu Retno",
      age: 68,
      background: "Pensiunan, hipertensi.",
      initialSymptoms: "Lelah, debaran tak beraturan, sesak napas.",
    },
    initialVitals: { bpm: 140, bp: "150/90", spo2: 95, stable: true },
    ekgDetails: {
      rhythm: "Irregularly irregular",
      p_wave: "Tidak ada",
      pr_interval: "N/A",
      qrs_complex: "Sempit",
    },
    interventions: {
      beta_blocker: {
        success: true,
        outcomeDescription: "Metoprolol berhasil menurunkan laju detak.",
        resultingVitals: { bpm: 90, bp: "130/80", spo2: 97, stable: true },
        resultingEKG: "afib",
      },
      cardioversion: {
        success: true,
        outcomeDescription: "Kardioversi elektrik mengembalikan irama sinus.",
        resultingVitals: { bpm: 80, bp: "125/80", spo2: 98, stable: true },
        resultingEKG: "normal",
      },
    },
    learningPoints: [
      "AFib ditandai irama 'irregularly irregular'.",
      "Tujuan awal adalah kontrol laju detak.",
      "Pencegahan stroke adalah kunci.",
    ],
    longTermManagement:
      "Antikoagulasi, kontrol tekanan darah, dan strategi rate/rhythm control.",
  },
  {
    id: "vt_case",
    title: "VT pada Pasien Post-MI",
    icon: AlertTriangle,
    arrhythmiaType: "vt_mono",
    patient: {
      name: "Pak Heru",
      age: 65,
      background: "Riwayat serangan jantung.",
      initialSymptoms: "Pingsan, lalu sadar dengan debaran kuat.",
    },
    initialVitals: { bpm: 200, bp: "80/50", spo2: 92, stable: false },
    ekgDetails: {
      rhythm: "Regular, wide-complex",
      p_wave: "Disosiasi AV",
      pr_interval: "N/A",
      qrs_complex: "Lebar",
    },
    interventions: {
      amiodarone: {
        success: true,
        outcomeDescription:
          "Amiodarone IV mengkonversi VT menjadi irama normal.",
        resultingVitals: { bpm: 85, bp: "110/70", spo2: 98, stable: true },
        resultingEKG: "normal",
      },
      cardioversion: {
        success: true,
        outcomeDescription:
          "Kardioversi 100J berhasil mengembalikan irama sinus.",
        resultingVitals: { bpm: 80, bp: "120/75", spo2: 99, stable: true },
        resultingEKG: "normal",
      },
    },
    learningPoints: [
      "VT tidak stabil adalah darurat medis.",
      "Kardioversi adalah terapi pilihan.",
      "Penyebab umum adalah jaringan parut jantung.",
    ],
    longTermManagement: "Pemasangan ICD untuk pencegahan kematian mendadak.",
  },
  {
    id: "vfib_case",
    title: "Henti Jantung (V-Fib)",
    icon: HeartCrack,
    arrhythmiaType: "vfib",
    patient: {
      name: "Bapak Anto",
      age: 55,
      background: "Perokok berat, nyeri dada.",
      initialSymptoms: "Kolaps, tidak ada nadi, tidak bernapas.",
    },
    initialVitals: { bpm: 0, bp: "0/0", spo2: 0, stable: false },
    ekgDetails: {
      rhythm: "Chaotic",
      p_wave: "Tidak ada",
      pr_interval: "N/A",
      qrs_complex: "Tidak ada",
    },
    interventions: {
      cpr: {
        success: true,
        outcomeDescription: "CPR menjaga sirkulasi ke organ vital.",
        resultingVitals: { bpm: 0, bp: "60/palp", spo2: 80, stable: false },
        resultingEKG: "vfib",
      },
      defibrillation: {
        success: true,
        outcomeDescription:
          "Defibrilasi 200J adalah satu-satunya cara menghentikan V-Fib.",
        resultingVitals: { bpm: 90, bp: "100/60", spo2: 95, stable: true },
        resultingEKG: "normal",
      },
    },
    learningPoints: [
      "V-Fib adalah henti jantung.",
      "Intervensi kunci: CPR dan defibrilasi cepat.",
      "Setiap menit penundaan mengurangi harapan hidup.",
    ],
    longTermManagement:
      "Atasi penyebab (serangan jantung), pemasangan ICD untuk pencegahan sekunder.",
  },
  {
    id: "brady_case",
    title: "Bradikardia Simptomatik",
    icon: Activity,
    arrhythmiaType: "brady",
    patient: {
      name: "Ibu Sri",
      age: 72,
      background: "Sering pusing dan hampir pingsan.",
      initialSymptoms: "Pusing berat, detak jantung sangat lambat.",
    },
    initialVitals: { bpm: 40, bp: "90/60", spo2: 96, stable: false },
    ekgDetails: {
      rhythm: "Regular, slow",
      p_wave: "Normal",
      pr_interval: "Normal",
      qrs_complex: "Sempit",
    },
    interventions: {
      atropine: {
        success: true,
        outcomeDescription:
          "Atropine 0.5mg IV meningkatkan detak jantung sementara.",
        resultingVitals: { bpm: 65, bp: "110/70", spo2: 98, stable: true },
        resultingEKG: "normal",
      },
      pacemaker: {
        success: true,
        outcomeDescription:
          "Pacu jantung eksternal menaikkan detak jantung ke 70 bpm.",
        resultingVitals: { bpm: 70, bp: "120/80", spo2: 99, stable: true },
        resultingEKG: "normal",
      },
    },
    learningPoints: [
      "Bradikardia simptomatik perlu penanganan segera.",
      "Atropine adalah obat lini pertama.",
      "Pacu jantung adalah solusi definitif.",
    ],
    longTermManagement: "Pemasangan alat pacu jantung permanen.",
  },
  {
    id: "aflutter_case",
    title: "Atrial Flutter",
    icon: RadioTower,
    arrhythmiaType: "aflutter",
    patient: {
      name: "Bapak Tono",
      age: 60,
      background: "Penyakit paru kronis (PPOK).",
      initialSymptoms: "Debaran cepat dan teratur, mudah lelah.",
    },
    initialVitals: { bpm: 150, bp: "130/80", spo2: 94, stable: true },
    ekgDetails: {
      rhythm: "Regular (2:1 block)",
      p_wave: "Pola gigi gergaji (sawtooth)",
      pr_interval: "N/A",
      qrs_complex: "Sempit",
    },
    interventions: {
      beta_blocker: {
        success: true,
        outcomeDescription:
          "Beta-blocker memperlambat konduksi AV, menurunkan detak nadi.",
        resultingVitals: { bpm: 80, bp: "125/75", spo2: 96, stable: true },
        resultingEKG: "aflutter",
      },
      cardioversion: {
        success: true,
        outcomeDescription:
          "Kardioversi elektrik 50J berhasil mengembalikan irama sinus.",
        resultingVitals: { bpm: 70, bp: "120/70", spo2: 98, stable: true },
        resultingEKG: "normal",
      },
    },
    learningPoints: [
      "EKG khas 'sawtooth'.",
      "Risiko stroke mirip AFib.",
      "Sangat responsif terhadap ablasi kateter.",
    ],
    longTermManagement:
      "Antikoagulasi, kontrol laju, dan pertimbangan ablasi kateter dengan tingkat keberhasilan >95%.",
  },
  {
    id: "torsades_case",
    title: "Torsades de Pointes",
    icon: AlertTriangle,
    arrhythmiaType: "vt_poly",
    patient: {
      name: "Dewi",
      age: 45,
      background: "Memulai antibiotik baru, kadar kalium rendah.",
      initialSymptoms: "Episode pusing parah berulang dan pingsan.",
    },
    initialVitals: { bpm: 220, bp: "70/40", spo2: 90, stable: false },
    ekgDetails: {
      rhythm: "Polymorphic VT, berpilin",
      p_wave: "Tidak ada",
      pr_interval: "N/A",
      qrs_complex: "Lebar, berubah-ubah",
    },
    interventions: {
      defibrillation: {
        success: true,
        outcomeDescription:
          "Pemberian Magnesium Sulfat IV adalah terapi utama dan berhasil menghentikan aritmia. Defibrilasi jika nadi hilang.",
        resultingVitals: { bpm: 60, bp: "100/60", spo2: 98, stable: true },
        resultingEKG: "normal",
      },
    },
    learningPoints: [
      "Dipicu oleh QT panjang dan elektrolit rendah.",
      "Magnesium Sulfat adalah obat pilihan pertama.",
      "Identifikasi dan hentikan obat pemicu.",
    ],
    longTermManagement:
      "Koreksi elektrolit, hindari obat yang memperpanjang QT, skrining Long QT Syndrome.",
  },
  {
    id: "pvc_case",
    title: "PVC Sering",
    icon: Heart,
    arrhythmiaType: "pvc",
    patient: {
      name: "Rian",
      age: 35,
      background: "Pekerja IT, minum 5 cangkir kopi sehari.",
      initialSymptoms: "Merasa jantung 'jedug' atau berhenti sejenak.",
    },
    initialVitals: { bpm: 80, bp: "120/80", spo2: 99, stable: true },
    ekgDetails: {
      rhythm: "Sinus dengan denyut ektopik ventrikel",
      p_wave: "Normal (pada denyut sinus)",
      pr_interval: "Normal",
      qrs_complex: "Sempit, dengan QRS lebar sesekali",
    },
    interventions: {
      beta_blocker: {
        success: true,
        outcomeDescription:
          "Beta-blocker dosis rendah mengurangi frekuensi PVC dan sensasi debaran.",
        resultingVitals: { bpm: 70, bp: "115/75", spo2: 99, stable: true },
        resultingEKG: "pvc",
      },
    },
    learningPoints: [
      "Sangat umum dan seringkali jinak.",
      "Pemicu utama: kafein, stres, kurang tidur.",
      "Menjadi perhatian jika >10% dari total detak atau ada penyakit jantung.",
    ],
    longTermManagement:
      "Mengurangi pemicu. Jika sangat simptomatik, bisa diberikan beta-blocker atau dilakukan ablasi.",
  },
  {
    id: "first_degree_block_case",
    title: "AV Block Derajat 1",
    icon: Stethoscope,
    arrhythmiaType: "first_degree_block",
    patient: {
      name: "Bapak Candra",
      age: 70,
      background: "Sehat, ditemukan saat check-up rutin.",
      initialSymptoms: "Tidak ada gejala sama sekali.",
    },
    initialVitals: { bpm: 65, bp: "130/80", spo2: 98, stable: true },
    ekgDetails: {
      rhythm: "Regular",
      p_wave: "Normal",
      pr_interval: "Memanjang (>0.20s)",
      qrs_complex: "Sempit",
    },
    interventions: {},
    learningPoints: [
      "Merupakan perlambatan konduksi, bukan blok total.",
      "Biasanya tidak berbahaya dan tidak memerlukan pengobatan.",
      "Perlu observasi berkala untuk melihat apakah berkembang.",
    ],
    longTermManagement:
      "Observasi tahunan. Hindari obat-obatan yang dapat memperlambat konduksi AV lebih lanjut.",
  },
  {
    id: "third_degree_block_case",
    title: "AV Block Total",
    icon: RadioTower,
    arrhythmiaType: "third_degree_block",
    patient: {
      name: "Nenek Ida",
      age: 80,
      background: "Riwayat penyakit jantung.",
      initialSymptoms:
        "Sangat lelah, pusing parah, hampir pingsan saat berdiri.",
    },
    initialVitals: { bpm: 35, bp: "85/50", spo2: 95, stable: false },
    ekgDetails: {
      rhythm: "Regular, sangat lambat",
      p_wave: "Normal, namun tidak berhubungan dengan QRS (disosiasi AV)",
      pr_interval: "Bervariasi",
      qrs_complex: "Lebar (escape rhythm)",
    },
    interventions: {
      pacemaker: {
        success: true,
        outcomeDescription:
          "Pacing transkutan segera meningkatkan detak jantung dan menstabilkan pasien.",
        resultingVitals: { bpm: 70, bp: "110/70", spo2: 98, stable: true },
        resultingEKG: "normal",
      },
    },
    learningPoints: [
      "Kondisi serius di mana sinyal atrium tidak sampai ke ventrikel.",
      "Menyebabkan bradikardia berat dan gejala signifikan.",
      "Alat pacu jantung adalah satu-satunya terapi efektif.",
    ],
    longTermManagement: "Pemasangan alat pacu jantung permanen seumur hidup.",
  },
  {
    id: "brugada_case",
    title: "Sindrom Brugada",
    icon: Dna,
    arrhythmiaType: "vt_poly",
    patient: {
      name: "Agus",
      age: 40,
      background: "Keluarga ada riwayat kematian mendadak.",
      initialSymptoms:
        "Pingsan saat tidur, dibangunkan oleh istri karena napas tersengal.",
    },
    initialVitals: { bpm: 70, bp: "120/80", spo2: 98, stable: true },
    ekgDetails: {
      rhythm: "Normal Sinus, dengan pola Brugada Tipe 1 di V1-V2",
      p_wave: "Normal",
      pr_interval: "Normal",
      qrs_complex: "ST elevasi 'coved type'",
    },
    interventions: {
      defibrillation: {
        success: true,
        outcomeDescription:
          "Pemasangan ICD adalah intervensi preventif utama untuk mencegah kematian mendadak jika VT/VF terjadi.",
        resultingVitals: { bpm: 70, bp: "120/80", spo2: 98, stable: true },
        resultingEKG: "normal",
      },
    },
    learningPoints: [
      "Kelainan genetik kanal ion natrium.",
      "Risiko tinggi henti jantung, terutama saat tidur atau demam.",
      "Demam harus ditangani secara agresif.",
    ],
    longTermManagement:
      "Pemasangan ICD pada pasien berisiko tinggi. Menghindari obat-obatan pemicu.",
  },
  {
    id: "asystole_case",
    title: "Asystole",
    icon: XCircle,
    arrhythmiaType: "asystole",
    patient: {
      name: "Tidak Dikenal",
      age: 0,
      background: "Ditemukan tidak sadar.",
      initialSymptoms: "Tidak ada respons, tidak ada nadi, tidak bernapas.",
    },
    initialVitals: { bpm: 0, bp: "0/0", spo2: 0, stable: false },
    ekgDetails: {
      rhythm: "Flatline",
      p_wave: "Tidak ada",
      pr_interval: "N/A",
      qrs_complex: "Tidak ada",
    },
    interventions: {
      cpr: {
        success: true,
        outcomeDescription:
          "CPR berkualitas tinggi dan epinefrin adalah satu-satunya tindakan. Mencari penyebab yang bisa diperbaiki (H's & T's).",
        resultingVitals: { bpm: 0, bp: "palp", spo2: 70, stable: false },
        resultingEKG: "asystole",
      },
      defibrillation: {
        success: false,
        outcomeDescription:
          "Asystole BUKAN irama yang bisa di-shock. Defibrilasi tidak akan membantu dan menunda CPR.",
        resultingVitals: { bpm: 0, bp: "0/0", spo2: 0, stable: false },
        resultingEKG: "asystole",
      },
    },
    learningPoints: [
      "Asystole adalah tidak adanya aktivitas listrik jantung.",
      "Ini BUKAN irama yang bisa di-shock.",
      "Fokus pada CPR berkualitas tinggi dan obat-obatan.",
    ],
    longTermManagement:
      "Prognosis sangat buruk. Fokus utama adalah mencari dan mengatasi penyebab yang mendasari.",
  },
];

// --- SUB-KOMPONEN EKG Visual (FIXED) ---
const EKGVisual: React.FC<{ path: string; bpm: number }> = ({ path, bpm }) => {
  const duration = bpm > 0 ? (60 / bpm) * 1.5 : 100;
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={[
            { x: 0, y: 15 },
            { x: 100, y: 15 },
          ]}
        >
          <XAxis type="number" dataKey="x" hide domain={[0, 100]} />
          <YAxis type="number" dataKey="y" hide domain={[0, 30]} />
          <Line
            type="monotone"
            dataKey="y"
            stroke="transparent"
            dot={false}
            isAnimationActive={false}
          />
          <foreignObject x="0" y="0" width="100%" height="100%">
            <motion.svg
              viewBox="0 0 100 30"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
            >
              <motion.path
                d={path}
                fill="none"
                stroke="#16a34a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 1, pathOffset: 1 }}
                animate={{ pathOffset: 0 }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.svg>
          </foreignObject>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- FIX UNTUK Web Audio API di TypeScript ---
interface CustomWindow extends Window {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
}

// --- KOMPONEN UTAMA (FIXED & LENGKAP) ---
const ArrhythmiaClinicalCommand: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [vitals, setVitals] = useState<VitalSigns | null>(null);
  const [ekg, setEKG] = useState<EKGPattern>("normal");
  const [log, setLog] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);

  const playBeep = useCallback(() => {
    if (!vitals || !vitals.bpm || vitals.bpm === 0) return;

    if (typeof window !== "undefined" && !audioCtx.current) {
      try {
        const customWindow = window as CustomWindow;
        const AudioContextClass =
          customWindow.AudioContext ?? customWindow.webkitAudioContext;

        if (!AudioContextClass) {
          console.error("Web Audio API is not supported in this browser.");
          return;
        }

        audioCtx.current = new AudioContextClass();
      } catch (e) {
        console.error("Web Audio API initialization failed.", e);
        return;
      }
    }

    if (!audioCtx.current) return;

    const oscillator = audioCtx.current.createOscillator();
    const gainNode = audioCtx.current.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);

    oscillator.type = vitals.stable ? "sine" : "sawtooth";
    oscillator.frequency.setValueAtTime(
      vitals.stable ? 880 : 440,
      audioCtx.current.currentTime
    );
    gainNode.gain.setValueAtTime(0.3, audioCtx.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.current.currentTime + 0.1
    );

    oscillator.start(audioCtx.current.currentTime);
    oscillator.stop(audioCtx.current.currentTime + 0.1);
  }, [vitals]);

  useEffect(() => {
    if (!vitals || !vitals.bpm || isFinished) return;
    const intervalId = setInterval(playBeep, 60000 / vitals.bpm);
    return () => clearInterval(intervalId);
  }, [vitals, playBeep, isFinished]);

  const handleSelectCase = (caseStudy: CaseStudy) => {
    setSelectedCase(caseStudy);
    setVitals(caseStudy.initialVitals);
    setEKG(caseStudy.arrhythmiaType);
    setLog([
      `Kasus dimulai: ${caseStudy.patient.name}, ${caseStudy.patient.age} tahun. Gejala: "${caseStudy.patient.initialSymptoms}"`,
    ]);
    setIsFinished(false);
  };

  const handleIntervention = (intervention: InterventionType) => {
    if (!selectedCase || isFinished) return;
    const result = selectedCase.interventions[intervention];
    if (result) {
      setVitals(result.resultingVitals);
      setEKG(result.resultingEKG);
      setLog((prev) => [
        ...prev,
        `> INTERVENSI: ${intervention.toUpperCase()}. Hasil: ${
          result.outcomeDescription
        }`,
      ]);
      if (result.success) {
        setIsFinished(true);
        setLog((prev) => [...prev, `STATUS: Pasien Stabil. Skenario Selesai.`]);
      }
    } else {
      setLog((prev) => [
        ...prev,
        `> INTERVENSI: ${intervention.toUpperCase()}. Hasil: Tidak ada efek atau kontraindikasi.`,
      ]);
    }
  };

  const resetSimulation = () => {
    setSelectedCase(null);
  };

  return (
    <section
      id="clinical-command"
      className="py-24 sm:py-32 bg-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <BrainCircuit className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Arrhythmia Clinical Command
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Masuki lab simulasi klinis. Diagnosis kasus, ambil tindakan
            intervensi, dan lihat dampaknya secara real-time.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedCase ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-2xl font-bold text-center mb-8">
                Pilih Studi Kasus Klinis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {clinicalCases.map((c) => (
                  <motion.div key={c.id} whileHover={{ y: -5, scale: 1.03 }}>
                    <Card
                      onClick={() => handleSelectCase(c)}
                      className="bg-gray-800 border-gray-700 h-full flex flex-col hover:border-red-500 cursor-pointer"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <c.icon className="h-6 w-6 text-red-400" /> {c.title}
                        </CardTitle>
                        <Badge variant="destructive" className="w-fit">
                          {c.arrhythmiaType.replace("_", " ").toUpperCase()}
                        </Badge>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-400">
                          {c.patient.background}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="simulation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold">{selectedCase.title}</h3>
                  <p className="text-gray-400">
                    Pasien: {selectedCase.patient.name},{" "}
                    {selectedCase.patient.age} tahun
                  </p>
                </div>
                <Button onClick={resetSimulation} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" /> Pilih Kasus Lain
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-black border-2 border-gray-700 h-full">
                    <CardHeader className="flex flex-row justify-between items-center p-4 border-b border-gray-700">
                      <CardTitle className="text-lg text-green-400 font-mono">
                        LIVE EKG MONITOR
                      </CardTitle>
                      {vitals && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-lg">
                          <span
                            className={cn(
                              "transition-colors",
                              vitals.bpm > 100 || vitals.bpm < 60
                                ? "text-red-400 animate-pulse"
                                : "text-green-400"
                            )}
                          >
                            HR: {vitals.bpm}
                          </span>
                          <span
                            className={cn(
                              "transition-colors",
                              !vitals.stable
                                ? "text-red-400 animate-pulse"
                                : "text-green-400"
                            )}
                          >
                            BP: {vitals.bp}
                          </span>
                          <span
                            className={cn(
                              "transition-colors",
                              vitals.spo2 < 95
                                ? "text-yellow-400 animate-pulse"
                                : "text-green-400"
                            )}
                          >
                            SpO2: {vitals.spo2}%
                          </span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-48">
                        {vitals && (
                          <EKGVisual
                            path={EKG_PATHS_EXT[ekg]}
                            bpm={vitals.bpm}
                          />
                        )}
                      </div>
                      <div className="text-xs font-mono grid grid-cols-2 gap-x-4 mt-2">
                        <p>
                          <span className="text-gray-400">Rhythm:</span>{" "}
                          {selectedCase.ekgDetails.rhythm}
                        </p>
                        <p>
                          <span className="text-gray-400">P wave:</span>{" "}
                          {selectedCase.ekgDetails.p_wave}
                        </p>
                        <p>
                          <span className="text-gray-400">PR interval:</span>{" "}
                          {selectedCase.ekgDetails.pr_interval}
                        </p>
                        <p>
                          <span className="text-gray-400">QRS complex:</span>{" "}
                          {selectedCase.ekgDetails.qrs_complex}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle>Panel Intervensi</CardTitle>
                      <CardDescription>
                        Pilih tindakan medis yang tepat.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                      {selectedCase.interventions &&
                        Object.keys(selectedCase.interventions).map((key) => (
                          <Button
                            key={key}
                            variant="destructive"
                            onClick={() =>
                              handleIntervention(key as InterventionType)
                            }
                            disabled={isFinished}
                          >
                            {key.replace("_", " ")}
                          </Button>
                        ))}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>Log Tindakan & Status</CardTitle>
                  </CardHeader>
                  <CardContent className="h-48 overflow-y-auto custom-scrollbar">
                    <AnimatePresence>
                      {log.map((l, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "text-sm font-mono border-b border-gray-700/50 py-1",
                            l.startsWith("> INTERVENSI") && "text-yellow-300",
                            l.startsWith("STATUS") && "text-green-300 font-bold"
                          )}
                        >
                          {l}
                        </motion.p>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                <AnimatePresence>
                  {isFinished && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="bg-green-900/50 border-green-700 h-full">
                        <CardHeader>
                          <CardTitle className="text-green-400 flex items-center gap-2">
                            <CheckCircle /> Debrief Klinis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm h-48 overflow-y-auto custom-scrollbar">
                          <div>
                            <h4 className="font-bold">
                              Poin Pembelajaran Kunci:
                            </h4>
                            <ul className="list-disc list-inside text-gray-300">
                              {selectedCase.learningPoints.map((p) => (
                                <li key={p}>{p}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold">
                              Manajemen Jangka Panjang:
                            </h4>
                            <p className="text-gray-300">
                              {selectedCase.longTermManagement}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ArrhythmiaClinicalCommand;
