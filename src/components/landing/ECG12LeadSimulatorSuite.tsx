// alvinfrs/kardiologiku-landing-page/src/components/ECGClinicalSimulatorSuite.tsx

import { useState, useEffect, useMemo, useCallback } from "react";
import { Play, Pause, RotateCcw, Stethoscope } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

// --- STRUKTUR DATA YANG SANGAT KOMPLEKS & DETAIL ---
interface ECGPoint {
  x: number;
  y: number;
}

interface LeadData {
  name: string;
  data: ECGPoint[];
  color: string;
}

interface ERProtocol {
  stable: string[];
  unstable: string[];
  notes?: string;
}

interface RhythmInfo {
  id: string;
  label: string;
  defaultBPM: number;
  description: string;
  pathophysiology: string;
  ekgCharacteristics: string[];
  erProtocol: ERProtocol;
  differentialDiagnosis: string[];
}

// --- DATABASE RITME JANTUNG YANG SANGAT DETAIL (MEDICAL-GRADE) ---
const rhythms: RhythmInfo[] = [
  {
    id: "normal",
    label: "Normal Sinus Rhythm",
    defaultBPM: 75,
    description:
      "Irama jantung ideal yang berasal dari nodus sinus, menunjukkan fungsi kelistrikan jantung yang sehat.",
    pathophysiology:
      "Impuls listrik berasal dari nodus Sinoatrial (SA), berjalan secara teratur melalui atrium, nodus Atrioventrikular (AV), dan menyebar ke seluruh ventrikel. Ini menghasilkan kontraksi jantung yang terkoordinasi dan efisien.",
    ekgCharacteristics: [
      "Laju: 60-100 bpm",
      "Irama: Teratur",
      "Gelombang P: Normal, tegak, mendahului setiap QRS",
      "Interval PR: 0.12-0.20 detik",
      "Kompleks QRS: Sempit (<0.12 detik)",
    ],
    erProtocol: {
      stable: ["Observasi. Tidak ada intervensi akut yang diperlukan."],
      unstable: [
        "Pasien dengan irama sinus normal seharusnya tidak stabil karena ritme itu sendiri. Cari dan tangani penyebab lain (H's & T's: Hipovolemia, Hipoksia, dll.).",
      ],
      notes: "Ini adalah baseline sehat untuk perbandingan klinis.",
    },
    differentialDiagnosis: [
      "Sinus Aritmia (variasi pernapasan normal pada orang muda)",
    ],
  },
  {
    id: "atrial_fib",
    label: "Atrial Fibrillation (AFib)",
    defaultBPM: 130,
    description:
      "Irama atrium yang kacau, cepat, dan tidak teratur. Penyebab umum stroke.",
    pathophysiology:
      "Beberapa sirkuit re-entry ektopik di atrium menembak secara acak dan sangat cepat (~400-600 kali per menit). Nodus AV, dengan periode refrakternya, memblokir sebagian besar impuls ini, menghasilkan respons ventrikel yang sangat tidak teratur (irregularly irregular).",
    ekgCharacteristics: [
      "Laju: Atrium 400-600, Ventrikel bervariasi (jika >100 bpm disebut RVR - Rapid Ventricular Response)",
      "Irama: Irregularly irregular",
      "Gelombang P: Tidak ada, digantikan oleh gelombang fibrilasi (f waves) yang kasar atau halus",
      "Interval PR: Tidak dapat diukur",
      "Kompleks QRS: Biasanya sempit",
    ],
    erProtocol: {
      stable: [
        "Kontrol laju (Rate Control): Beta-blocker (Metoprolol 2.5-5mg IV) atau Calcium Channel Blocker (Diltiazem 0.25mg/kg IV).",
        "Pertimbangkan kontrol irama (Rhythm Control) jika onset baru < 48 jam.",
        "Antikoagulasi berdasarkan skor CHA₂DS₂-VASc.",
      ],
      unstable: [
        "Kardioversi listrik tersinkronisasi segera (mulai 120-200J Biphasic).",
      ],
      notes:
        "Prioritaskan kontrol laju dan antikoagulasi untuk mencegah stroke.",
    },
    differentialDiagnosis: [
      "Multifocal Atrial Tachycardia (MAT)",
      "Atrial Flutter dengan blok variabel",
    ],
  },
  {
    id: "tachycardia",
    label: "Supraventricular Tachycardia (SVT)",
    defaultBPM: 180,
    description:
      "Detak jantung sangat cepat yang berasal dari sirkuit listrik di atas ventrikel.",
    pathophysiology:
      "Umumnya disebabkan oleh sirkuit re-entry yang melibatkan nodus AV (AVNRT) atau jalur aksesori (AVRT). Sirkuit ini menciptakan loop listrik yang berputar sangat cepat, membajak ritme normal.",
    ekgCharacteristics: [
      "Laju: 150-250 bpm",
      "Irama: Sangat teratur",
      "Gelombang P: Sulit dilihat, sering terkubur dalam gelombang T atau muncul setelah QRS (retrograde)",
      "QRS: Sempit (<0.12 detik)",
    ],
    erProtocol: {
      stable: [
        "Manuver vagal (Valsalva, carotid sinus massage).",
        "Jika gagal, Adenosine 6mg IV push cepat. Dapat diulang dengan dosis 12mg.",
      ],
      unstable: [
        "Kardioversi listrik tersinkronisasi (mulai 50-100J Biphasic).",
      ],
      notes: "Adenosine dapat menyebabkan jeda asistol singkat yang normal.",
    },
    differentialDiagnosis: [
      "Takikardia Sinus",
      "Atrial Flutter dengan blok 2:1",
    ],
  },
  {
    id: "vtach",
    label: "Ventricular Tachycardia (VT)",
    defaultBPM: 180,
    description:
      "Irama cepat dan lebar yang berasal dari ventrikel, berpotensi mengancam nyawa.",
    pathophysiology:
      "Sirkuit re-entry atau fokus otomatis abnormal di dalam jaringan parut ventrikel (sering pasca-infark) mengambil alih fungsi pacu jantung. Ini menyebabkan kontraksi ventrikel yang cepat dan tidak efisien, menurunkan curah jantung.",
    ekgCharacteristics: [
      "Laju: 100-250 bpm",
      "Irama: Biasanya teratur",
      "Gelombang P: Sulit dilihat, sering terdisosiasi dari QRS (AV dissociation)",
      "Kompleks QRS: Lebar (>0.12 detik)",
    ],
    erProtocol: {
      stable: [
        "Obat anti-aritmia: Amiodarone 150mg IV selama 10 menit, atau Procainamide.",
        "Konsultasi kardiologi segera.",
      ],
      unstable: ["Kardioversi listrik tersinkronisasi (mulai 100J Biphasic)."],
      notes:
        "Jika tanpa nadi (pulseless VT), perlakukan seperti VFib (defibrilasi, CPR).",
    },
    differentialDiagnosis: [
      "SVT dengan konduksi aberan (bundle branch block)",
      "Hiperkalemia",
      "Torsades de Pointes",
    ],
  },
  {
    id: "vfib",
    label: "Ventricular Fibrillation (VFib)",
    defaultBPM: 300,
    description:
      "Aktivitas listrik ventrikel yang kacau total, menyebabkan henti jantung.",
    pathophysiology:
      "Aktivitas listrik yang sangat cepat, tidak teratur, dan kacau dari berbagai lokasi di ventrikel menyebabkan otot jantung hanya bergetar (fibrilasi) tanpa bisa memompa darah.",
    ekgCharacteristics: [
      "Laju: Tidak terukur",
      "Irama: Sangat tidak teratur, kacau",
      "Gelombang P: Tidak ada",
      "QRS: Tidak ada, hanya gelombang fibrilasi kasar atau halus",
    ],
    erProtocol: {
      stable: ["Tidak mungkin stabil."],
      unstable: [
        "DEFIBRILASI SEGERA (200J Biphasic).",
        "Mulai CPR berkualitas tinggi.",
        "Epinefrin 1mg IV/IO setiap 3-5 menit.",
        "Amiodarone 300mg IV/IO setelah shock ketiga.",
      ],
      notes:
        "Setiap detik sangat berharga. Prioritas utama adalah CPR dan defibrilasi.",
    },
    differentialDiagnosis: [
      "Artefak (jika pasien sadar)",
      "Torsades de Pointes",
    ],
  },
  {
    id: "pvc",
    label: "Premature Ventricular Contractions (PVC)",
    defaultBPM: 80,
    description: "Denyut ekstra dari ventrikel yang mengganggu irama normal.",
    pathophysiology:
      "Fokus ektopik di ventrikel mengalami depolarisasi secara prematur, menyebabkan kontraksi ventrikel yang tidak terkoordinasi sebelum waktunya.",
    ekgCharacteristics: [
      "Irama: Irama dasar teratur diselingi denyut prematur",
      "Gelombang P: Tidak ada sebelum PVC",
      "QRS: Lebar dan aneh untuk PVC",
      "Terdapat jeda kompensasi (compensatory pause) setelah PVC",
    ],
    erProtocol: {
      stable: [
        "Biasanya tidak memerlukan penanganan darurat. Cari pemicu (kafein, stres, hipokalemia).",
        "Jika sangat sering atau simptomatik, pertimbangkan Beta-blocker.",
      ],
      unstable: [
        "Jarang menyebabkan instabilitas kecuali pada 'R on T phenomenon' yang dapat memicu VT/VF.",
      ],
    },
    differentialDiagnosis: ["Aberrant SVT", "Ventricular Escape Beat"],
  },
  {
    id: "brugada",
    label: "Brugada Pattern",
    defaultBPM: 70,
    description: "Pola EKG genetik yang berisiko henti jantung.",
    pathophysiology:
      "Kelainan kanal ion natrium pada jantung yang diwariskan, menyebabkan gradien tegangan abnormal di epikardium ventrikel kanan, terutama saat fase awal repolarisasi.",
    ekgCharacteristics: [
      "ST elevasi tipe 'coved' (>2mm) di sadapan V1-V2",
      "Diikuti oleh gelombang T negatif",
      "EKG dapat berubah-ubah (dinamis)",
    ],
    erProtocol: {
      stable: [
        "Observasi, hindari obat pemicu (lihat Brugadadrugs.org), tangani demam secara agresif.",
        "Rujuk ke ahli elektrofisiologi untuk stratifikasi risiko.",
      ],
      unstable: [
        "Jika terjadi VT/VF, tangani sesuai protokol ACLS (defibrilasi).",
      ],
    },
    differentialDiagnosis: [
      "Perikarditis",
      "Blok cabang berkas kanan (RBBB)",
      "Emboli Paru",
    ],
  },
  {
    id: "bradycardia",
    label: "Sinus Bradycardia",
    defaultBPM: 45,
    description: "Irama sinus yang lebih lambat dari normal (<60 bpm).",
    pathophysiology:
      "Nodus SA menembak lebih lambat dari biasanya. Bisa fisiologis (atlet) atau patologis (disfungsi nodus SA, hipotiroidisme, efek obat).",
    ekgCharacteristics: [
      "Laju: <60 bpm",
      "Irama: Teratur",
      "Gelombang P: Normal, mendahului setiap QRS",
      "QRS: Sempit",
    ],
    erProtocol: {
      stable: ["Observasi jika asimtomatik."],
      unstable: [
        "Atropine 1mg IV bolus, dapat diulang setiap 3-5 menit (maks 3mg).",
        "Jika atropin tidak efektif: Pacing transkutan atau infus Dopamin/Epinefrin.",
      ],
      notes: "Jangan menunda pacing jika pasien sangat tidak stabil.",
    },
    differentialDiagnosis: ["AV Block", "Junctional Rhythm"],
  },
  {
    id: "heart_block",
    label: "Complete Heart Block (3rd Degree)",
    defaultBPM: 35,
    description: "Disosiasi total antara aktivitas atrium dan ventrikel.",
    pathophysiology:
      "Tidak ada sama sekali impuls dari atrium yang dapat melewati nodus AV ke ventrikel. Atrium dan ventrikel berdetak secara independen, dengan ventrikel didorong oleh 'escape rhythm' yang lambat dari junctional atau ventrikel.",
    ekgCharacteristics: [
      "Laju: Atrium > Ventrikel",
      "Irama: Gelombang P teratur, QRS teratur, tapi tidak berhubungan (AV dissociation)",
      "Gelombang P: Normal",
      "Interval PR: Bervariasi",
      "QRS: Bisa sempit (junctional escape) atau lebar (ventricular escape)",
    ],
    erProtocol: {
      stable: ["Sangat jarang stabil, siapkan intervensi."],
      unstable: [
        "Pacing transkutan segera adalah terapi utama.",
        "Atropine bisa dicoba tetapi seringkali tidak efektif.",
        "Infus Dopamin/Epinefrin sambil menunggu pemasangan pacemaker transvenous.",
      ],
      notes: "Ini adalah kondisi yang sangat berisiko tinggi asistol.",
    },
    differentialDiagnosis: [
      "AV Dissociation karena VT",
      "Severe Sinus Bradycardia",
    ],
  },
  {
    id: "ist",
    label: "Inappropriate Sinus Tachycardia (IST)",
    defaultBPM: 115,
    description: "Takikardia sinus tanpa pemicu fisiologis yang jelas.",
    pathophysiology:
      "Disfungsi sistem saraf otonom yang menyebabkan nodus SA terlalu sensitif atau memiliki otomatisitas yang meningkat, menghasilkan laju jantung istirahat yang tinggi.",
    ekgCharacteristics: [
      "Laju: >100 bpm saat istirahat",
      "Irama: Teratur",
      "Gelombang P: Morfologi sinus normal",
      "QRS: Sempit",
    ],
    erProtocol: {
      stable: [
        "Ini adalah kondisi kronis, bukan darurat akut. Yakinkan pasien.",
        "Singkirkan penyebab sekunder (anemia, hipertiroid).",
        "Terapi jangka panjang: Ivabradine atau Beta-blocker.",
      ],
      unstable: ["Sangat jarang. Cari penyebab lain."],
    },
    differentialDiagnosis: [
      "Takikardia Sinus Fisiologis",
      "Atrial Tachycardia",
    ],
  },
  {
    id: "atrial_flutter",
    label: "Atrial Flutter",
    defaultBPM: 150,
    description: "Irama atrium yang cepat dan teratur.",
    pathophysiology:
      "Satu sirkuit re-entry besar, biasanya di atrium kanan, berputar dengan kecepatan ~300 bpm. Nodus AV biasanya memblokir impuls dalam rasio tetap (mis. 2:1), menghasilkan laju ventrikel ~150 bpm.",
    ekgCharacteristics: [
      "Laju: Atrium ~300 bpm, Ventrikel ~150 (blok 2:1) atau bervariasi",
      "Irama: Biasanya teratur",
      "Gelombang P: Digantikan oleh gelombang 'sawtooth' (flutter waves)",
      "QRS: Sempit",
    ],
    erProtocol: {
      stable: [
        "Sama seperti AFib: Kontrol laju dengan Diltiazem atau Metoprolol.",
      ],
      unstable: [
        "Kardioversi listrik tersinkronisasi. Sangat sensitif, seringkali hanya butuh energi rendah (mulai 50J).",
      ],
    },
    differentialDiagnosis: ["SVT", "Atrial Tachycardia"],
  },
  {
    id: "torsades",
    label: "Torsades de Pointes",
    defaultBPM: 250,
    description: "VT polimorfik dengan sumbu QRS yang 'berpilin'.",
    pathophysiology:
      "Terjadi pada kondisi interval QT yang memanjang. Dipicu oleh 'early afterdepolarizations' yang menyebabkan VT polimorfik dimana polaritas QRS tampak berputar mengelilingi garis isoelektrik.",
    ekgCharacteristics: [
      "Laju: 200-300 bpm",
      "Irama: Tidak teratur",
      "QRS: Lebar, polimorfik, dengan amplitudo yang berosilasi",
    ],
    erProtocol: {
      stable: ["Tidak mungkin stabil untuk waktu lama."],
      unstable: [
        "MAGNESIUM SULFATE 2g IV selama 5-10 menit, bahkan jika level magnesium normal.",
        "Jika tanpa nadi, defibrilasi.",
        "Hentikan semua obat yang memperpanjang QT.",
      ],
      notes: "Magnesium adalah terapi utama.",
    },
    differentialDiagnosis: ["VFib", "VT polimorfik lainnya"],
  },
  {
    id: "first_degree_av",
    label: "First Degree AV Block",
    defaultBPM: 65,
    description: "Perlambatan konduksi dari atrium ke ventrikel.",
    pathophysiology:
      "Perlambatan konduksi melalui nodus AV, menyebabkan interval PR memanjang.",
    ekgCharacteristics: [
      "Irama: Teratur",
      "Interval PR: Memanjang dan konstan (>0.20 detik)",
    ],
    erProtocol: {
      stable: [
        "Biasanya jinak dan tidak memerlukan pengobatan akut. Tinjau ulang obat-obatan pasien.",
      ],
      unstable: ["Sangat jarang. Cari penyebab lain."],
    },
    differentialDiagnosis: ["Irama sinus normal dengan PR borderline"],
  },
  {
    id: "mobitz_i",
    label: "Mobitz Type I (Wenckebach)",
    defaultBPM: 55,
    description: "Blok AV derajat 2 dengan pemanjangan PR progresif.",
    pathophysiology:
      "Kelelahan progresif pada nodus AV. Setiap impuls berturut-turut membutuhkan waktu lebih lama untuk lewat, hingga akhirnya satu impuls terblokir sepenuhnya.",
    ekgCharacteristics: [
      "Irama: Regularly irregular",
      "Interval PR: Semakin memanjang hingga satu gelombang P tidak diikuti QRS",
    ],
    erProtocol: {
      stable: [
        "Observasi jika asimtomatik. Hentikan obat yang memperlambat nodus AV.",
      ],
      unstable: ["Atropine bisa efektif. Pacing jika bradikardia berat."],
    },
    differentialDiagnosis: ["Mobitz Type II"],
  },
  {
    id: "mobitz_ii",
    label: "Mobitz Type II",
    defaultBPM: 40,
    description: "Blok AV derajat 2 dengan dropped beat yang tidak terduga.",
    pathophysiology:
      "Blok terjadi di bawah nodus AV (infranodal). Ini adalah penyakit 'semua atau tidak sama sekali' dimana beberapa impuls terblokir tanpa peringatan.",
    ekgCharacteristics: [
      "Irama: Bisa teratur atau tidak",
      "Interval PR: Konstan untuk detak yang terkonduksi",
      "Beberapa gelombang P tidak diikuti QRS secara tiba-tiba",
    ],
    erProtocol: {
      stable: [
        "Sangat berisiko tinggi menjadi blok total. Pemasangan pacemaker transkutan dan siapkan untuk transvenous.",
      ],
      unstable: [
        "JANGAN gunakan Atropine (bisa memperburuk blok). Langsung ke Pacing transkutan.",
      ],
    },
    differentialDiagnosis: [
      "Mobitz Type I",
      "Atrial Fibrillation dengan laju lambat",
    ],
  },
  {
    id: "junctional",
    label: "Junctional Rhythm",
    defaultBPM: 50,
    description: "Irama yang berasal dari AV node.",
    pathophysiology:
      "Ketika nodus SA gagal berfungsi, nodus AV mengambil alih sebagai pacu jantung. Laju intrinsiknya adalah 40-60 bpm.",
    ekgCharacteristics: [
      "Laju: 40-60 bpm",
      "Irama: Teratur",
      "Gelombang P: Bisa terbalik, tidak ada, atau setelah QRS",
      "QRS: Sempit",
    ],
    erProtocol: {
      stable: ["Cari penyebab (mis. toksisitas Digoxin, iskemia)."],
      unstable: ["Atropine. Pacing jika perlu."],
    },
    differentialDiagnosis: ["Sinus Bradycardia", "Idioventricular Rhythm"],
  },
  {
    id: "wpw",
    label: "Wolff-Parkinson-White (WPW)",
    defaultBPM: 85,
    description: "Adanya jalur listrik tambahan (accessory pathway).",
    pathophysiology:
      "Jalur Kent adalah jalur listrik tambahan yang menghubungkan atrium dan ventrikel, melewati nodus AV. Ini menyebabkan pra-eksitasi ventrikel.",
    ekgCharacteristics: [
      "Interval PR: Pendek (<0.12s)",
      "Kompleks QRS: Lebar karena adanya Delta Wave (slurring pada awal QRS)",
    ],
    erProtocol: {
      stable: [
        "Jika mengalami SVT (AVRT), tangani seperti SVT. Jika mengalami AFib, JANGAN berikan agen pemblokir nodus AV (Adenosine, Verapamil) karena dapat meningkatkan konduksi ke ventrikel dan memicu VFib.",
      ],
      unstable: ["Kardioversi listrik."],
    },
    differentialDiagnosis: ["Blok cabang berkas kiri (LBBB)"],
  },
];

const leads = [
  { name: "I", color: "#ff6b6b" },
  { name: "II", color: "#4ecdc4" },
  { name: "III", color: "#45b7d1" },
  { name: "aVR", color: "#96ceb4" },
  { name: "aVL", color: "#feca57" },
  { name: "aVF", color: "#ff9ff3" },
  { name: "V1", color: "#54a0ff" },
  { name: "V2", color: "#5f27cd" },
  { name: "V3", color: "#00d2d3" },
  { name: "V4", color: "#ff6348" },
  { name: "V5", color: "#2ed573" },
  { name: "V6", color: "#ffa502" },
];

const ECG12LeadSimulatorSuite = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentRhythm, setCurrentRhythm] = useState("normal");
  const [heartRate, setHeartRate] = useState(75);
  const [leadsData, setLeadsData] = useState<LeadData[]>([]);

  const selectedRhythmInfo = useMemo(() => {
    return rhythms.find((r) => r.id === currentRhythm) || rhythms[0];
  }, [currentRhythm]);

  useEffect(() => {
    setHeartRate(selectedRhythmInfo.defaultBPM);
  }, [currentRhythm, selectedRhythmInfo.defaultBPM]);

  const generateECGData = useCallback(() => {
    const duration = 10;
    const samplingRate = 250;
    const totalPoints = duration * samplingRate;
    const beatsPerMinute = heartRate === 0 ? 1 : heartRate;
    const beatInterval = (60 / beatsPerMinute) * samplingRate;

    const newLeadsData: LeadData[] = leads.map((lead) => ({
      name: lead.name,
      color: lead.color,
      data: [],
    }));

    for (let i = 0; i < totalPoints; i++) {
      const beatPhase = (i % beatInterval) / beatInterval;

      leads.forEach((lead, leadIndex) => {
        let amplitude = 0;

        const p = (p_amp: number, p_dur: number, p_pos: number) =>
          p_amp *
          Math.max(0, Math.sin(((beatPhase - p_pos) / p_dur) * Math.PI));
        const qrs = (
          q_amp: number,
          r_amp: number,
          s_amp: number,
          qrs_dur: number,
          qrs_pos: number
        ) => {
          const qrsPhase = (beatPhase - qrs_pos) / qrs_dur;
          if (qrsPhase >= 0 && qrsPhase < 0.25)
            return -q_amp * Math.sin(qrsPhase * 4 * Math.PI);
          if (qrsPhase >= 0.25 && qrsPhase < 0.5)
            return r_amp * Math.sin((qrsPhase - 0.25) * 4 * Math.PI);
          if (qrsPhase >= 0.5 && qrsPhase < 1)
            return -s_amp * Math.sin((qrsPhase - 0.5) * 2 * Math.PI);
          return 0;
        };
        const t = (t_amp: number, t_dur: number, t_pos: number) =>
          t_amp *
          Math.max(0, Math.sin(((beatPhase - t_pos) / t_dur) * Math.PI));

        switch (currentRhythm) {
          case "normal":
          case "bradycardia":
          case "tachycardia":
            amplitude =
              p(5, 0.1, 0.1) + qrs(5, 30, 10, 0.1, 0.25) + t(10, 0.2, 0.4);
            break;
          case "atrial_fib": {
            amplitude = (Math.random() - 0.5) * 8; // Fibrillatory waves
            const irregularBeatInterval =
              beatInterval * (0.7 + Math.random() * 0.6);
            if (i % Math.round(irregularBeatInterval) < 0.1 * samplingRate) {
              amplitude += qrs(5, 30, 10, 0.1, 0.25);
            }
            break;
          }
          case "vtach": {
            const qrs_dur = 0.2; // QRS lebar
            const qrs_pos = 0.1;
            const qrsPhase = (beatPhase - qrs_pos) / qrs_dur;
            let qrs_amp = 0;
            if (qrsPhase >= 0 && qrsPhase < 1) {
              // Kombinasi gelombang untuk bentuk yang tidak simetris
              const upstroke = Math.pow(qrsPhase * 2, 0.5) * 40;
              const downstroke = Math.pow(1 - qrsPhase, 2) * -30;
              qrs_amp = upstroke + downstroke;
            }
            // Tambahkan sedikit variasi T-wave discordance
            const t_wave =
              -10 * Math.max(0, Math.sin(((beatPhase - 0.4) / 0.3) * Math.PI));
            amplitude = qrs_amp + t_wave + (Math.random() - 0.5) * 3;
            break;
          }
          case "vfib":
            amplitude = (Math.random() - 0.5) * 35 + Math.sin(i * 0.5) * 8;
            break;
          case "asystole":
            amplitude = (Math.random() - 0.5) * 1.5;
            break;
          default:
            amplitude =
              p(5, 0.1, 0.1) + qrs(5, 30, 10, 0.1, 0.25) + t(10, 0.2, 0.4);
            break;
          case "torsades": {
            // 2 detik pertama: sinus dengan prolonged QT
            const prolongedQTSecs = 2;
            const prolongedQTPoints = prolongedQTSecs * samplingRate;
            if (i < prolongedQTPoints) {
              // Sinus dengan QT panjang (T wave lebih lambat)
              amplitude =
                p(5, 0.1, 0.1) + qrs(5, 30, 10, 0.1, 0.25) + t(10, 0.35, 0.65); // t_pos digeser, t_dur diperpanjang
            } else {
              // TdP chaotic
              const tdpCycle = 220;
              const tdpPhase = ((i % tdpCycle) / tdpCycle) * 2 * Math.PI;
              const envelope = 28 + 22 * Math.sin(tdpPhase);

              const qrsWidth = 0.09 + Math.random() * 0.13;
              const qrsPos = 0.12 + Math.random() * 0.18;
              const qrsPhase = (beatPhase - qrsPos) / qrsWidth;
              let qrsAmp = 0;
              if (qrsPhase >= 0 && qrsPhase < 1) {
                if (Math.random() > 0.5) {
                  qrsAmp = Math.sin(qrsPhase * Math.PI) * envelope;
                } else {
                  qrsAmp = (1 - Math.abs(qrsPhase * 2 - 1)) * envelope;
                }
                if (Math.random() > 0.98) {
                  qrsAmp += (Math.random() - 0.5) * 40;
                }
              }
              const baselineNoise = (Math.random() - 0.5) * 10;
              const vfibComponent =
                Math.random() > 0.985 ? (Math.random() - 0.5) * 60 : 0;

              amplitude = qrsAmp + baselineNoise + vfibComponent;
            }
            break;
          }
        }

        const multipliers: { [key: string]: number } = {
          I: 0.8,
          II: 1.0,
          III: 0.2,
          aVR: -0.9,
          aVL: 0.4,
          aVF: 0.6,
          V1: -0.5,
          V2: -0.2,
          V3: 0.5,
          V4: 1.0,
          V5: 0.8,
          V6: 0.6,
        };
        amplitude *= multipliers[lead.name] || 1.0;

        newLeadsData[leadIndex].data.push({
          x: i,
          y: 50 - amplitude,
        });
      });
    }
    setLeadsData(newLeadsData);
  }, [currentRhythm, heartRate]);

  useEffect(() => {
    generateECGData();
  }, [generateECGData]);

  useEffect(() => {
    if (!isPlaying) return;
    const totalDuration = 10000;
    const intervalTime = 20;
    const increment = (intervalTime / totalDuration) * 100;

    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev + increment) % 100);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const renderECGLine = (lead: LeadData) => {
    if (!lead.data.length) return null;

    const totalPoints = lead.data.length;
    const viewWidthPoints = totalPoints / 5;
    const startIndex = Math.floor((currentTime / 100) * totalPoints);
    const endIndex = startIndex + viewWidthPoints;

    const visibleData = lead.data.slice(startIndex, endIndex);

    const pathD = visibleData
      .map((point, index) => {
        const xPos = (index / viewWidthPoints) * 300;
        return `${index === 0 ? "M" : "L"} ${xPos} ${point.y}`;
      })
      .join(" ");

    return (
      <div
        key={lead.name}
        className="relative bg-black dark:bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
      >
        <div className="absolute top-1 left-2 text-xs font-mono text-white z-10">
          {lead.name}
        </div>
        <svg
          width="100%"
          height="100"
          viewBox="0 0 300 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={`grid-${lead.name}`}
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="rgba(0, 255, 0, 0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="300" height="100" fill="url(#grid-${lead.name})" />

          {pathD && (
            <path d={pathD} fill="none" stroke={lead.color} strokeWidth="1.5" />
          )}
        </svg>
      </div>
    );
  };

  return (
    <section className="py-12 bg-gray-100 dark:bg-black">
      <Card className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 text-center">
          <CardTitle className="text-3xl lg:text-4xl font-extrabold">
            ECG Clinical Simulator Suite
          </CardTitle>
          <CardDescription className="text-base text-gray-500 dark:text-gray-400 mt-2">
            Platform simulasi EKG 12-sadapan interaktif untuk edukasi klinis
            dengan protokol penanganan darurat.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* --- Panel Kontrol & Informasi --- */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gray-50 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Stethoscope className="text-blue-500" />
                    Kontrol Simulasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white dark:text-white"
                    >
                      {isPlaying ? (
                        <Pause size={18} className="mr-2" />
                      ) : (
                        <Play size={18} className="mr-2" />
                      )}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentTime(0);
                        setIsPlaying(false);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white dark:text-white"
                    >
                      <RotateCcw size={18} className="mr-2" /> Reset
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pilih Irama Jantung
                    </label>
                    <Select
                      value={currentRhythm}
                      onValueChange={setCurrentRhythm}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        {rhythms.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Atur Detak Jantung (BPM):{" "}
                      <span className="font-bold text-lg text-green-500">
                        {heartRate}
                      </span>
                    </label>
                    <Slider
                      min={0}
                      max={320}
                      step={1}
                      value={[heartRate]}
                      onValueChange={(val) => setHeartRate(val[0])}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl">Analisis & Protokol</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="details">Detail Klinis</TabsTrigger>
                      <TabsTrigger value="protocol">Protokol IGD</TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="details"
                      className="mt-4 text-sm space-y-3 max-h-96 overflow-y-auto"
                    >
                      <div>
                        <strong className="text-gray-800 dark:text-gray-100">
                          Nama Irama:
                        </strong>{" "}
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          {selectedRhythmInfo.label}
                        </span>
                      </div>
                      <div>
                        <strong className="text-gray-800 dark:text-gray-100">
                          Patofisiologi:
                        </strong>{" "}
                        <p className="text-gray-600 dark:text-gray-300">
                          {selectedRhythmInfo.pathophysiology}
                        </p>
                      </div>
                      <div>
                        <strong className="text-gray-800 dark:text-gray-100">
                          Karakteristik EKG:
                        </strong>{" "}
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                          {selectedRhythmInfo.ekgCharacteristics.map(
                            (char, i) => (
                              <li key={i}>{char}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div>
                        <strong className="text-gray-800 dark:text-gray-100">
                          Diagnosis Banding:
                        </strong>{" "}
                        <p className="text-gray-600 dark:text-gray-300">
                          {selectedRhythmInfo.differentialDiagnosis.join(", ")}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="protocol"
                      className="mt-4 text-sm space-y-4 max-h-96 overflow-y-auto"
                    >
                      <div>
                        <h4 className="font-bold text-green-600 dark:text-green-400">
                          Pasien Stabil:
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                          {selectedRhythmInfo.erProtocol.stable.map(
                            (step, i) => (
                              <li key={i}>{step}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-red-500 dark:text-red-400">
                          Pasien Tidak Stabil:
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                          {selectedRhythmInfo.erProtocol.unstable.map(
                            (step, i) => (
                              <li key={i}>{step}</li>
                            )
                          )}
                        </ul>
                      </div>
                      {selectedRhythmInfo.erProtocol.notes && (
                        <div>
                          <strong className="text-yellow-500">
                            Catatan Penting:
                          </strong>{" "}
                          <p className="text-gray-600 dark:text-gray-300">
                            {selectedRhythmInfo.erProtocol.notes}
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* --- Grid EKG 12 Sadapan --- */}
            <div className="lg:col-span-2">
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence>
                  {leadsData.map((lead) => (
                    <motion.div
                      key={lead.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {renderECGLine(lead)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ECG12LeadSimulatorSuite;
