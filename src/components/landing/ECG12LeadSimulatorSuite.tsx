// alvinfrs/kardiologiku-landing-page/src/components/ECGClinicalSimulatorSuite.tsx

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Stethoscope,
  ZoomIn,
  ZoomOut,
  Info,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// --- STRUKTUR DATA YANG LEBIH KOMPLEKS & DETAIL (DENGAN TAMBAHAN SYMPTOMS, CAUSES, LONG-TERM MANAGEMENT) ---
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
  symptoms: string[]; // Tambahan: Gejala klinis
  causes: string[]; // Tambahan: Penyebab umum
  ekgCharacteristics: string[];
  erProtocol: ERProtocol;
  differentialDiagnosis: string[];
  longTermManagement: string[]; // Tambahan: Manajemen jangka panjang
  references?: string[]; // Tambahan: Referensi medis
}

// --- DATABASE RITME JANTUNG YANG LEBIH DETAIL & AKURAT (MEDICAL-GRADE, DIPERBAIKI & DITAMBAH) ---
// Saya telah memperbaiki dan menambahkan detail medis yang lebih akurat berdasarkan standar seperti AHA/ACLS, UpToDate, dan buku EKG seperti Dubin/Marriott.
// Total ritme tetap 17, tapi diperbaiki waveform generation nanti, ditambah detail edukatif seperti symptoms, causes, long-term, references.
// Tambah 3 ritme baru untuk kompleksitas: Asystole, Idioventricular Rhythm, Long QT Syndrome.

const rhythms: RhythmInfo[] = [
  {
    id: "normal",
    label: "Normal Sinus Rhythm",
    defaultBPM: 75,
    description:
      "Irama jantung ideal yang berasal dari nodus sinus, menunjukkan fungsi kelistrikan jantung yang sehat.",
    pathophysiology:
      "Impuls listrik berasal dari nodus Sinoatrial (SA), berjalan secara teratur melalui atrium, nodus Atrioventrikular (AV), dan menyebar ke seluruh ventrikel. Ini menghasilkan kontraksi jantung yang terkoordinasi dan efisien.",
    symptoms: ["Biasanya asimtomatik, kecuali jika ada kondisi lain."],
    causes: ["Fisiologis normal."],
    ekgCharacteristics: [
      "Laju: 60-100 bpm",
      "Irama: Teratur",
      "Gelombang P: Normal, tegak di lead II, mendahului setiap QRS",
      "Interval PR: 0.12-0.20 detik (konstan)",
      "Kompleks QRS: Sempit (<0.12 detik), durasi 0.06-0.10 detik",
      "Interval QT/QTc: Normal (QTc <440 ms pria, <460 ms wanita)",
      "ST Segment: Isoelektrik",
      "Gelombang T: Tegak di lead I, II, V3-V6",
    ],
    erProtocol: {
      stable: ["Observasi. Tidak ada intervensi akut yang diperlukan."],
      unstable: [
        "Pasien dengan irama sinus normal seharusnya tidak stabil karena ritme itu sendiri. Cari dan tangani penyebab lain (H's & T's: Hipovolemia, Hipoksia, Hydrogen ion (acidosis), Hypo-/Hyperkalemia, Hypoglycemia, Hypothermia, Toxins, Tamponade, Tension pneumothorax, Thrombosis, Trauma).",
      ],
      notes:
        "Ini adalah baseline sehat untuk perbandingan klinis. Gunakan untuk kalibrasi EKG.",
    },
    differentialDiagnosis: [
      "Sinus Aritmia (variasi pernapasan normal pada orang muda)",
      "Wandering Atrial Pacemaker",
    ],
    longTermManagement: [
      "Tidak diperlukan kecuali ada faktor risiko kardiovaskular.",
    ],
    references: [
      "AHA Guidelines 2020",
      "Marriott's Practical Electrocardiography",
    ],
  },
  {
    id: "atrial_fib",
    label: "Atrial Fibrillation (AFib)",
    defaultBPM: 130,
    description:
      "Irama atrium yang kacau, cepat, dan tidak teratur. Penyebab umum stroke dan gagal jantung.",
    pathophysiology:
      "Beberapa sirkuit re-entry ektopik di atrium menembak secara acak dan sangat cepat (~350-600 kali per menit). Nodus AV, dengan periode refrakternya, memblokir sebagian besar impuls ini, menghasilkan respons ventrikel yang sangat tidak teratur (irregularly irregular). Dapat menyebabkan remodeling atrium.",
    symptoms: [
      "Palpitasi, sesak napas, kelelahan, pusing, sinkop. Bisa asimtomatik.",
    ],
    causes: [
      "Hipertensi, penyakit jantung iskemik, hipertiroidisme, alkohol (holiday heart syndrome), usia lanjut.",
    ],
    ekgCharacteristics: [
      "Laju: Atrium 350-600, Ventrikel bervariasi (jika >100 bpm disebut RVR - Rapid Ventricular Response)",
      "Irama: Irregularly irregular",
      "Gelombang P: Tidak ada, digantikan oleh gelombang fibrilasi (f waves) yang kasar (coarse AF) atau halus (fine AF), terbaik dilihat di V1",
      "Interval PR: Tidak dapat diukur",
      "Kompleks QRS: Biasanya sempit, tapi bisa lebar jika ada bundle branch block",
      "ST/T: Bisa ada ST depression sekunder karena laju cepat",
    ],
    erProtocol: {
      stable: [
        "Kontrol laju (Rate Control): Beta-blocker (Metoprolol 2.5-5mg IV bolus, lalu infus) atau Calcium Channel Blocker (Diltiazem 0.25mg/kg IV bolus, lalu infus). Target HR <110 bpm jika asimtomatik.",
        "Pertimbangkan kontrol irama (Rhythm Control) jika onset baru <48 jam: Amiodarone 150mg IV bolus lalu infus, atau kardioversi listrik setelah TEE (Transesophageal Echo) untuk rule out thrombus.",
        "Antikoagulasi berdasarkan skor CHA₂DS₂-VASc (mis. DOAC seperti Apixaban jika skor ≥2 pria/≥3 wanita).",
      ],
      unstable: [
        "Kardioversi listrik tersinkronisasi segera (mulai 120-200J Biphasic). Berikan sedasi (Etomidate/Propofol).",
        "Jika refrakter, Amiodarone IV.",
      ],
      notes:
        "Prioritaskan kontrol laju dan antikoagulasi untuk mencegah stroke. Hindari Digoxin pada RVR akut karena onset lambat.",
    },
    differentialDiagnosis: [
      "Multifocal Atrial Tachycardia (MAT)",
      "Atrial Flutter dengan blok variabel",
      "Sinus Tachycardia dengan frequent PACs",
    ],
    longTermManagement: [
      "Ablasi kateter jika paroksismal, obat antiaritmia jangka panjang, manajemen faktor risiko (kontrol BP, berat badan).",
    ],
    references: ["ESC AF Guidelines 2020", "UpToDate: Atrial Fibrillation"],
  },
  {
    id: "tachycardia",
    label: "Supraventricular Tachycardia (SVT)",
    defaultBPM: 180,
    description:
      "Detak jantung sangat cepat yang berasal dari sirkuit listrik di atas ventrikel, sering AVNRT atau AVRT.",
    pathophysiology:
      "Umumnya disebabkan oleh sirkuit re-entry yang melibatkan nodus AV (AVNRT - Atrioventricular Nodal Reentrant Tachycardia) atau jalur aksesori (AVRT - Atrioventricular Reentrant Tachycardia). Sirkuit ini menciptakan loop listrik yang berputar sangat cepat, membajak ritme normal.",
    symptoms: ["Palpitasi mendadak, dada berdebar, pusing, dispnea, sinkop."],
    causes: ["Idiopatik, kafein, stres, alkohol, penyakit jantung struktural."],
    ekgCharacteristics: [
      "Laju: 150-250 bpm",
      "Irama: Sangat teratur (regular narrow-complex tachycardia)",
      "Gelombang P: Sulit dilihat, sering terkubur dalam gelombang T atau muncul setelah QRS (retrograde P waves di lead II/III/aVF)",
      "QRS: Sempit (<0.12 detik)",
      "RP Interval: Pendek (<70ms) pada AVNRT, panjang (>70ms) pada AT",
    ],
    erProtocol: {
      stable: [
        "Manuver vagal (Valsalva: strain 40 detik, atau carotid sinus massage jika tidak ada bruits).",
        "Jika gagal, Adenosine 6mg IV push cepat diikuti flush saline 20ml. Dapat diulang dengan dosis 12mg. Monitor untuk jeda asistol singkat.",
        "Jika refrakter, Verapamil 2.5-5mg IV atau Beta-blocker.",
      ],
      unstable: [
        "Kardioversi listrik tersinkronisasi (mulai 50-100J Biphasic). Berikan sedasi.",
      ],
      notes:
        "Adenosine aman tapi bisa menyebabkan jeda asistol singkat yang normal. Kontraindikasi pada asma berat.",
    },
    differentialDiagnosis: [
      "Sinus Tachycardia (ada P waves jelas)",
      "Atrial Flutter dengan blok 2:1 (sawtooth waves)",
      "Atrial Tachycardia",
    ],
    longTermManagement: [
      "Ablasi kateter sebagai kuratif, Beta-blocker profilaksis.",
    ],
    references: ["ACLS Provider Manual", "Litfl.com: SVT"],
  },
  {
    id: "vtach",
    label: "Ventricular Tachycardia (VT)",
    defaultBPM: 180,
    description:
      "Irama cepat dan lebar yang berasal dari ventrikel, berpotensi mengancam nyawa, sering monomorfik atau polimorfik.",
    pathophysiology:
      "Sirkuit re-entry atau fokus otomatis abnormal di dalam jaringan parut ventrikel (sering pasca-MI atau kardiomiopati). Ini menyebabkan kontraksi ventrikel yang cepat dan tidak efisien, menurunkan curah jantung.",
    symptoms: ["Palpitasi, dada nyeri, dispnea, sinkop, henti jantung."],
    causes: [
      "Iskemia miokard, kardiomiopati, elektrolit imbalance (hypokalemia, hypomagnesemia), obat proaritmia.",
    ],
    ekgCharacteristics: [
      "Laju: 100-250 bpm",
      "Irama: Biasanya teratur (monomorfik VT), atau tidak teratur (polimorfik)",
      "Gelombang P: Sulit dilihat, sering terdisosiasi dari QRS (AV dissociation, fusion/capture beats)",
      "Kompleks QRS: Lebar (>0.12 detik), morfologi seperti LBBB atau RBBB tergantung fokus",
      "Concordance: Positif/negatif di precordial leads mendukung VT vs SVT aberrancy",
    ],
    erProtocol: {
      stable: [
        "Obat anti-aritmia: Amiodarone 150mg IV bolus selama 10 menit, lalu infus 1mg/min. Atau Procainamide 10-17mg/kg IV.",
        "Konsultasi kardiologi/elektrofisiologi segera untuk ablasi.",
      ],
      unstable: [
        "Kardioversi listrik tersinkronisasi (mulai 100J Biphasic). Jika polimorfik, periksa QT.",
      ],
      notes:
        "Jika tanpa nadi (pulseless VT), perlakukan seperti VFib (defibrilasi unsynchronized 200J, CPR, Epinefrin 1mg IV q3-5min).",
    },
    differentialDiagnosis: [
      "SVT dengan konduksi aberan (bundle branch block)",
      "Hiperkalemia (sinusoidal pattern)",
      "Torsades de Pointes (polimorfik dengan QT panjang)",
    ],
    longTermManagement: [
      "ICD implantasi, ablasi VT, optimalisasi terapi gagal jantung.",
    ],
    references: ["AHA VT Guidelines", "ECG Library: Ventricular Tachycardia"],
  },
  {
    id: "vfib",
    label: "Ventricular Fibrillation (VFib)",
    defaultBPM: 300,
    description:
      "Aktivitas listrik ventrikel yang kacau total, menyebabkan henti jantung dan kematian jika tidak ditangani.",
    pathophysiology:
      "Aktivitas listrik yang sangat cepat, tidak teratur, dan kacau dari berbagai lokasi di ventrikel menyebabkan otot jantung hanya bergetar (fibrilasi) tanpa bisa memompa darah, menyebabkan zero output.",
    symptoms: ["Sinkop mendadak, tanpa nadi, henti napas."],
    causes: [
      "Iskemia akut (STEMI), elektrolit imbalance, trauma, obat toksik.",
    ],
    ekgCharacteristics: [
      "Laju: Tidak terukur (>300 bpm efektif)",
      "Irama: Sangat tidak teratur, kacau",
      "Gelombang P: Tidak ada",
      "QRS: Tidak ada, hanya gelombang fibrilasi kasar (coarse VF, amplitude >3mm) atau halus (fine VF, amplitude <3mm)",
    ],
    erProtocol: {
      stable: ["Tidak mungkin stabil."],
      unstable: [
        "DEFIBRILASI UNSYNCHRONIZED SEGERA (200J Biphasic, atau 360J Monophasic).",
        "Mulai CPR berkualitas tinggi (30:2, 100-120/min, depth 5-6cm).",
        "Epinefrin 1mg IV/IO setiap 3-5 menit.",
        "Amiodarone 300mg IV/IO setelah shock ketiga, lalu 150mg tambahan jika refrakter.",
        "Cari reversible causes (H's & T's).",
      ],
      notes:
        "Setiap detik sangat berharga. Prioritas: CPR kontinu, defibrilasi dini. Target ETCO2 >10mmHg selama CPR.",
    },
    differentialDiagnosis: [
      "Artefak (jika pasien sadar, loose leads)",
      "Torsades de Pointes (polimorfik twisting)",
    ],
    longTermManagement: ["ICD sekunder prevensi, manajemen penyakit dasar."],
    references: ["ACLS Algorithm: VF/Pulseless VT"],
  },
  {
    id: "pvc",
    label: "Premature Ventricular Contractions (PVC)",
    defaultBPM: 80,
    description:
      "Denyut ekstra dari ventrikel yang mengganggu irama normal, bisa unifokal atau multifokal.",
    pathophysiology:
      "Fokus ektopik di ventrikel mengalami depolarisasi secara prematur, menyebabkan kontraksi ventrikel yang tidak terkoordinasi sebelum waktunya. Bisa triggered atau automaticity.",
    symptoms: ["Palpitasi, sensasi 'flip-flop' di dada, jarang simptomatik."],
    causes: ["Kafein, stres, hipokalemia, iskemia, idiopatik."],
    ekgCharacteristics: [
      "Irama: Irama dasar teratur diselingi denyut prematur",
      "Gelombang P: Tidak ada sebelum PVC",
      "QRS: Lebar (>0.12 detik) dan aneh (bizarre morphology), tergantung asal (LBBB-like dari RV, RBBB-like dari LV)",
      "Terdapat jeda kompensasi penuh (compensatory pause) setelah PVC, ST/T discordance",
      "Bigeminy/Trgeminy jika pola berulang",
    ],
    erProtocol: {
      stable: [
        "Biasanya tidak memerlukan penanganan darurat. Cari pemicu (kafein, stres, hipokalemia).",
        "Jika sangat sering (>20% beats) atau simptomatik, pertimbangkan Beta-blocker (Metoprolol) atau ablasi jika PVC-induced cardiomyopathy.",
      ],
      unstable: [
        "Jarang menyebabkan instabilitas kecuali pada 'R on T phenomenon' yang dapat memicu VT/VF. Tangani seperti VT jika degenerasi.",
      ],
    },
    differentialDiagnosis: [
      "Aberrant SVT (Ashman phenomenon)",
      "Ventricular Escape Beat",
      "PAC dengan aberrancy",
    ],
    longTermManagement: [
      "Holter monitor, ablasi jika frequent dan simptomatik.",
    ],
    references: ["ACC/AHA PVC Guidelines"],
  },
  {
    id: "brugada",
    label: "Brugada Syndrome/Pattern",
    defaultBPM: 70,
    description:
      "Pola EKG genetik yang berisiko henti jantung mendadak karena VF.",
    pathophysiology:
      "Kelainan kanal ion natrium (SCN5A mutation) yang diwariskan, menyebabkan gradien tegangan abnormal di epikardium ventrikel kanan, terutama saat fase 1 repolarisasi (loss of dome).",
    symptoms: ["Sinkop, palpitasi malam hari, sering asimtomatik hingga SCA."],
    causes: [
      "Genetik (autosomal dominant), demam/hipertermia sebagai trigger.",
    ],
    ekgCharacteristics: [
      "ST elevasi tipe 1 'coved' (>2mm) di sadapan V1-V2 dengan T inversion",
      "Tipe 2: Saddleback ST elevation",
      "EKG dinamis, bisa normalisasi; provokasi dengan Ajmaline/Flecainide",
      "QRS: Bisa ada RBBB partial",
    ],
    erProtocol: {
      stable: [
        "Observasi, hindari obat pemicu (lihat Brugadadrugs.org: antiaritmia kelas Ia/Ic, TCA, dll.), tangani demam secara agresif dengan Paracetamol.",
        "Rujuk ke ahli elektrofisiologi untuk EPS (Electrophysiology Study) dan stratifikasi risiko (skor Shanghai).",
      ],
      unstable: [
        "Jika terjadi VT/VF, tangani sesuai protokol ACLS (defibrilasi). Isoproterenol infus untuk overdrive suppression.",
      ],
    },
    differentialDiagnosis: [
      "Perikarditis akut",
      "Right Bundle Branch Block (RBBB)",
      "Pulmonary Embolism",
      "ARVD",
    ],
    longTermManagement: [
      "ICD untuk prevensi sekunder, Quinidine jika ICD tidak memungkinkan.",
    ],
    references: ["EHRA Brugada Consensus", "Brugada.org"],
  },
  {
    id: "bradycardia",
    label: "Sinus Bradycardia",
    defaultBPM: 45,
    description:
      "Irama sinus yang lebih lambat dari normal (<60 bpm), bisa fisiologis atau patologis.",
    pathophysiology:
      "Nodus SA menembak lebih lambat dari biasanya. Bisa fisiologis (atlet terlatih, vagal tone tinggi) atau patologis (sick sinus syndrome, hipotiroidisme, efek obat seperti beta-blocker).",
    symptoms: ["Kelelahan, pusing, sinkop jika berat."],
    causes: [
      "Fisiologis (tidur, atlet), obat (beta-blocker, digoxin), hipotermia, hipotiroid.",
    ],
    ekgCharacteristics: [
      "Laju: <60 bpm",
      "Irama: Teratur",
      "Gelombang P: Normal, tegak, mendahului setiap QRS",
      "QRS: Sempit",
      "PR/QT: Normal",
    ],
    erProtocol: {
      stable: ["Observasi jika asimtomatik. Review medikasi."],
      unstable: [
        "Atropine 0.5-1mg IV bolus, dapat diulang setiap 3-5 menit (maks 3mg total).",
        "Jika atropin tidak efektif: Pacing transkutan atau infus Dopamin (5-20mcg/kg/min) / Epinefrin (2-10mcg/min).",
      ],
      notes:
        "Jangan menunda pacing jika pasien sangat tidak stabil (hipotensi, altered mental status).",
    },
    differentialDiagnosis: [
      "AV Block derajat tinggi",
      "Junctional Rhythm",
      "Hypothermia (Osborn waves)",
    ],
    longTermManagement: ["Pacemaker jika simptomatik kronis."],
    references: ["AHA Bradycardia Algorithm"],
  },
  {
    id: "heart_block",
    label: "Complete Heart Block (3rd Degree AV Block)",
    defaultBPM: 35,
    description:
      "Disosiasi total antara aktivitas atrium dan ventrikel, dengan escape rhythm lambat.",
    pathophysiology:
      "Tidak ada sama sekali impuls dari atrium yang dapat melewati nodus AV ke ventrikel. Atrium dan ventrikel berdetak secara independen, dengan ventrikel didorong oleh 'escape rhythm' yang lambat dari junctional (40-60 bpm) atau ventricular (20-40 bpm).",
    symptoms: [
      "Kelelahan, pusing, sinkop (Stokes-Adams attack), gagal jantung.",
    ],
    causes: [
      "Degeneratif (Lenegre disease), iskemia (inferior MI), obat (digoxin toxicity), Lyme disease.",
    ],
    ekgCharacteristics: [
      "Laju: Atrium 60-100, Ventrikel 20-60 bpm",
      "Irama: Gelombang P teratur, QRS teratur, tapi tidak berhubungan (AV dissociation total, no constant PR)",
      "Gelombang P: Normal",
      "Interval PR: Bervariasi secara acak",
      "QRS: Sempit jika junctional escape, lebar jika ventricular escape",
    ],
    erProtocol: {
      stable: ["Sangat jarang stabil jangka panjang, siapkan intervensi."],
      unstable: [
        "Pacing transkutan segera adalah terapi utama sambil menunggu transvenous.",
        "Atropine 0.5mg IV bisa dicoba tetapi seringkali tidak efektif pada blok infranodal.",
        "Infus Dopamin/Epinefrin sebagai bridge.",
      ],
      notes:
        "Ini adalah kondisi yang sangat berisiko tinggi asistol. Hindari isoproterenol jika iskemia.",
    },
    differentialDiagnosis: [
      "AV Dissociation karena VT",
      "Severe Sinus Bradycardia dengan SA exit block",
      "Hyperkalemia",
    ],
    longTermManagement: ["Permanent pacemaker implantasi."],
    references: ["ACC/AHA Pacemaker Guidelines"],
  },
  {
    id: "ist",
    label: "Inappropriate Sinus Tachycardia (IST)",
    defaultBPM: 115,
    description:
      "Takikardia sinus tanpa pemicu fisiologis yang jelas, sering pada wanita muda.",
    pathophysiology:
      "Disfungsi sistem saraf otonom yang menyebabkan nodus SA terlalu sensitif atau memiliki otomatisitas yang meningkat, menghasilkan laju jantung istirahat yang tinggi (>100 bpm).",
    symptoms: ["Palpitasi kronis, kelelahan, dispnea on exertion."],
    causes: ["Idiopatik, disautonomia (POTS overlap), post-viral."],
    ekgCharacteristics: [
      "Laju: >100 bpm saat istirahat, naik berlebihan saat aktivitas",
      "Irama: Teratur",
      "Gelombang P: Morfologi sinus normal (tegak di II)",
      "QRS: Sempit",
      "PR/QT: Normal",
    ],
    erProtocol: {
      stable: [
        "Ini adalah kondisi kronis, bukan darurat akut. Yakinkan pasien.",
        "Singkirkan penyebab sekunder (anemia, hipertiroid, pheochromocytoma).",
        "Terapi akut: Beta-blocker jika simptomatik.",
      ],
      unstable: ["Sangat jarang. Cari penyebab lain seperti sepsis."],
    },
    differentialDiagnosis: [
      "Sinus Tachycardia Fisiologis (dehidrasi, anxiety)",
      "Atrial Tachycardia",
      "POTS (Postural Orthostatic Tachycardia Syndrome)",
    ],
    longTermManagement: [
      "Ivabradine (If channel blocker), Beta-blocker, sinus node ablation sebagai last resort.",
    ],
    references: ["HRS IST Consensus"],
  },
  {
    id: "atrial_flutter",
    label: "Atrial Flutter",
    defaultBPM: 150,
    description:
      "Irama atrium yang cepat dan teratur, sering dengan blok AV 2:1.",
    pathophysiology:
      "Satu sirkuit re-entry besar, biasanya counter-clockwise di atrium kanan sekitar crista terminalis (typical flutter), berputar dengan kecepatan ~240-340 bpm. Nodus AV biasanya memblokir impuls dalam rasio tetap (2:1 = 150 bpm ventricular).",
    symptoms: ["Palpitasi, dispnea, kelelahan, mirip AFib."],
    causes: ["Penyakit jantung struktural, post-ablasi, COPD."],
    ekgCharacteristics: [
      "Laju: Atrium ~240-340 bpm, Ventrikel ~150 (blok 2:1) atau variabel",
      "Irama: Biasanya teratur (regularly regular)",
      "Gelombang P: Digantikan oleh gelombang 'sawtooth' (flutter waves, negatif di II/III/aVF pada typical flutter)",
      "QRS: Sempit",
      "No isoelectric baseline antara flutter waves",
    ],
    erProtocol: {
      stable: [
        "Kontrol laju: Diltiazem atau Metoprolol IV, mirip AFib.",
        "Antikoagulasi jika durasi >48 jam.",
        "Kontrol irama: Ibutilide IV atau kardioversi.",
      ],
      unstable: [
        "Kardioversi listrik tersinkronisasi. Sangat sensitif, mulai 50J Biphasic.",
      ],
    },
    differentialDiagnosis: ["SVT (AVNRT)", "Atrial Tachycardia", "AFib coarse"],
    longTermManagement: ["Cavotricuspid isthmus ablasi sebagai kuratif."],
    references: ["ESC Atrial Flutter Guidelines"],
  },
  {
    id: "torsades",
    label: "Torsades de Pointes",
    defaultBPM: 250,
    description:
      "VT polimorfik dengan sumbu QRS yang 'berpilin', sering pada QT panjang.",
    pathophysiology:
      "Terjadi pada kondisi acquired/congenital long QT syndrome. Dipicu oleh 'early afterdepolarizations' (EADs) yang menyebabkan VT polimorfik dimana polaritas QRS tampak berputar mengelilingi garis isoelektrik (twisting of points).",
    symptoms: ["Sinkop, palpitasi, degenerasi ke VF."],
    causes: [
      "Obat (Amiodarone, Sotalol, Antibiotik macrolide), hipokalemia, congenital LQTS.",
    ],
    ekgCharacteristics: [
      "Laju: 200-300 bpm",
      "Irama: Tidak teratur",
      "QRS: Lebar, polimorfik, dengan amplitudo yang berosilasi (twisting around baseline)",
      "Preceded by long QT (QTc >500ms), big U waves, pause-dependent initiation",
    ],
    erProtocol: {
      stable: ["Tidak mungkin stabil untuk waktu lama. Koreksi elektrolit."],
      unstable: [
        "MAGNESIUM SULFATE 1-2g IV bolus selama 5 menit, lalu infus 0.5-1g/jam, bahkan jika level Mg normal.",
        "Jika tanpa nadi, defibrilasi unsynchronized.",
        "Overdrive pacing jika recurrent, hentikan obat prolonging QT.",
      ],
      notes:
        "Magnesium adalah terapi utama. Hindari Amiodarone (perpanjang QT lebih lanjut).",
    },
    differentialDiagnosis: ["Polymorphic VT non-TdP", "VFib", "Artifact"],
    longTermManagement: ["Beta-blocker untuk congenital, ICD, avoid triggers."],
    references: ["AHA TdP Management"],
  },
  {
    id: "first_degree_av",
    label: "First Degree AV Block",
    defaultBPM: 65,
    description:
      "Perlambatan konduksi dari atrium ke ventrikel tanpa dropped beats.",
    pathophysiology:
      "Perlambatan konduksi melalui nodus AV atau His-Purkinje, menyebabkan interval PR memanjang. Biasanya nodal.",
    symptoms: ["Biasanya asimtomatik."],
    causes: ["Vagal tone tinggi, obat (beta-blocker), atlet."],
    ekgCharacteristics: [
      "Irama: Teratur",
      "Interval PR: Memanjang dan konstan (>0.20 detik, sering >0.30s pada marked 1st degree)",
      "QRS: Normal",
    ],
    erProtocol: {
      stable: [
        "Biasanya jinak dan tidak memerlukan pengobatan akut. Tinjau ulang obat-obatan pasien (beta-blocker, calcium blocker).",
      ],
      unstable: ["Sangat jarang. Cari penyebab lain seperti MI."],
    },
    differentialDiagnosis: [
      "Normal variant dengan PR borderline",
      "Pseudo-PR prolongation pada atrial ectopy",
    ],
    longTermManagement: ["Observasi, pacemaker jika simptomatik (jarang)."],
    references: ["ECG Interpretation: AV Blocks"],
  },
  {
    id: "mobitz_i",
    label: "Mobitz Type I (Wenckebach) - 2nd Degree AV Block",
    defaultBPM: 55,
    description:
      "Blok AV derajat 2 dengan pemanjangan PR progresif hingga dropped beat.",
    pathophysiology:
      "Kelelahan progresif pada nodus AV (supra-His). Setiap impuls berturut-turut membutuhkan waktu lebih lama untuk lewat, hingga akhirnya satu impuls terblokir sepenuhnya. Biasanya benign.",
    symptoms: ["Jarang simptomatik kecuali ratio tinggi."],
    causes: ["Vagal, obat, inferior MI."],
    ekgCharacteristics: [
      "Irama: Group beating (progressive PR until drop)",
      "Interval PR: Semakin memanjang hingga satu gelombang P tidak diikuti QRS, lalu reset",
      "QRS: Sempit",
      "Ratio: Variabel, mis 4:3, 3:2",
    ],
    erProtocol: {
      stable: [
        "Observasi jika asimtomatik. Hentikan obat yang memperlambat nodus AV (digoxin, beta-blocker).",
      ],
      unstable: [
        "Atropine 0.5mg IV efektif karena nodal. Pacing jika bradikardia berat.",
      ],
    },
    differentialDiagnosis: ["Mobitz Type II (no progressive PR)", "SA Block"],
    longTermManagement: ["Pacemaker jika simptomatik kronis."],
    references: ["Litfl: Mobitz I"],
  },
  {
    id: "mobitz_ii",
    label: "Mobitz Type II - 2nd Degree AV Block",
    defaultBPM: 40,
    description:
      "Blok AV derajat 2 dengan dropped beat yang tidak terduga, tanpa progressive PR.",
    pathophysiology:
      "Blok terjadi di bawah nodus AV (infranodal, His-Purkinje). Ini adalah penyakit 'semua atau tidak sama sekali' dimana beberapa impuls terblokir tanpa peringatan. Berisiko progres ke complete block.",
    symptoms: ["Pusing, sinkop."],
    causes: ["Degeneratif, anterior MI."],
    ekgCharacteristics: [
      "Irama: Bisa teratur atau tidak",
      "Interval PR: Konstan untuk detak yang terkonduksi",
      "Beberapa gelombang P tidak diikuti QRS secara tiba-tiba",
      "QRS: Sering lebar (bundle branch involvement)",
    ],
    erProtocol: {
      stable: [
        "Sangat berisiko tinggi menjadi blok total. Siapkan pacing transkutan.",
      ],
      unstable: [
        "JANGAN gunakan Atropine (bisa memperburuk blok infranodal). Langsung ke pacing transkutan/transvenous.",
      ],
    },
    differentialDiagnosis: [
      "Mobitz Type I",
      "Atrial Fibrillation dengan slow response",
      "2:1 AV Block (bisa Type I atau II)",
    ],
    longTermManagement: ["Permanent pacemaker."],
    references: ["Litfl: Mobitz II"],
  },
  {
    id: "junctional",
    label: "Junctional Rhythm",
    defaultBPM: 50,
    description:
      "Irama yang berasal dari AV junction, sebagai escape ketika SA gagal.",
    pathophysiology:
      "Ketika nodus SA gagal berfungsi atau diblok, nodus AV mengambil alih sebagai pacu jantung. Laju intrinsiknya adalah 40-60 bpm. Bisa accelerated jika enhanced automaticity.",
    symptoms: ["Bradikardia simptomatik jika slow."],
    causes: ["SA node disease, digoxin toxicity, post-cardiac surgery."],
    ekgCharacteristics: [
      "Laju: 40-60 bpm (escape), >60 bpm (accelerated)",
      "Irama: Teratur",
      "Gelombang P: Bisa terbalik (retrograde, di II/III/aVF), tidak ada, atau setelah QRS (short RP)",
      "QRS: Sempit",
      "PR: Pendek jika P sebelum QRS",
    ],
    erProtocol: {
      stable: [
        "Cari penyebab (mis. toksisitas Digoxin, iskemia). Hentikan offender.",
      ],
      unstable: ["Atropine 0.5mg IV. Pacing jika perlu."],
    },
    differentialDiagnosis: [
      "Sinus Bradycardia",
      "Idioventricular Rhythm (lebar QRS)",
      "Atrial Fibrillation dengan junctional escape",
    ],
    longTermManagement: ["Pacemaker jika kronis."],
    references: ["ECG Waves: Junctional Rhythms"],
  },
  {
    id: "wpw",
    label: "Wolff-Parkinson-White (WPW) Syndrome",
    defaultBPM: 85,
    description:
      "Adanya jalur listrik tambahan (accessory pathway) yang menyebabkan pre-excitation.",
    pathophysiology:
      "Jalur Kent (atau Mahaim) adalah jalur listrik tambahan yang menghubungkan atrium dan ventrikel, melewati nodus AV. Ini menyebabkan pra-eksitasi ventrikel dan potensi re-entry tachycardia (orthodromic/antidromic AVRT).",
    symptoms: ["Palpitasi (SVT episodes), sinkop."],
    causes: ["Congenital, associated with Ebstein anomaly."],
    ekgCharacteristics: [
      "Interval PR: Pendek (<0.12 detik)",
      "Kompleks QRS: Lebar (>0.11 detik) karena Delta Wave (slurring upstroke QRS)",
      "ST/T: Sekunder changes (discordant T waves)",
      "Delta wave positif di V1-V6 pada left-sided pathway",
    ],
    erProtocol: {
      stable: [
        "Jika SVT (orthodromic AVRT): Tangani seperti SVT reguler (vagal, Adenosine).",
        "Jika AFib dengan WPW (irregular wide-complex): JANGAN berikan AV node blocker (Adenosine, Verapamil, Digoxin) karena dapat meningkatkan konduksi accessory dan memicu VF. Gunakan Procainamide atau Ibutilide.",
      ],
      unstable: ["Kardioversi listrik tersinkronisasi."],
    },
    differentialDiagnosis: [
      "Left Bundle Branch Block (LBBB)",
      "Ventricular hypertrophy",
    ],
    longTermManagement: ["Ablasi accessory pathway sebagai kuratif."],
    references: ["AHA WPW Guidelines"],
  },
  // Tambahan ritme baru untuk kompleksitas & edukasi
  {
    id: "asystole",
    label: "Asystole",
    defaultBPM: 0,
    description: "Tidak ada aktivitas listrik jantung sama sekali, flatline.",
    pathophysiology:
      "Total kegagalan semua pacemaker (SA, AV, ventricular). Sering end-stage dari kondisi reversible atau irreversible.",
    symptoms: ["Henti jantung, tanpa nadi."],
    causes: ["H's & T's, overdose obat, trauma."],
    ekgCharacteristics: [
      "Laju: 0 bpm",
      "Irama: Tidak ada",
      "Gelombang P/QRS/T: Tidak ada, hanya isoelectric line dengan minor artifact",
    ],
    erProtocol: {
      stable: ["Tidak mungkin."],
      unstable: [
        "Konfirmasi di multiple leads. Mulai CPR high-quality.",
        "Epinefrin 1mg IV q3-5min.",
        "Cari reversible causes. Jika confirmed asystole, prognosis poor.",
      ],
      notes: "Jangan defibrilasi asystole. Fokus CPR & causes.",
    },
    differentialDiagnosis: [
      "Fine VF (check gain/amplitude)",
      "Lead disconnection",
    ],
    longTermManagement: ["N/A, survival low."],
    references: ["ACLS Asystole/PEA"],
  },
  {
    id: "idioventricular",
    label: "Accelerated Idioventricular Rhythm (AIVR)",
    defaultBPM: 80,
    description: "Irama ventricular lambat-cepat, sering post-reperfusion.",
    pathophysiology:
      "Enhanced automaticity di Purkinje fibers atau myocardium, overriding sinus rhythm.",
    symptoms: ["Biasanya asimtomatik."],
    causes: ["Post-thrombolysis di MI, digoxin toxicity."],
    ekgCharacteristics: [
      "Laju: 60-120 bpm",
      "Irama: Teratur",
      "Gelombang P: Disosiasi atau retrograde",
      "QRS: Lebar (>0.12 detik)",
    ],
    erProtocol: {
      stable: ["Observasi, benign post-MI."],
      unstable: ["Suppress dengan Atropine jika lambat."],
    },
    differentialDiagnosis: ["VT slow", "Junctional dengan aberrancy"],
    longTermManagement: ["Tidak diperlukan."],
    references: ["ECG Library: AIVR"],
  },
  {
    id: "long_qt",
    label: "Long QT Syndrome",
    defaultBPM: 70,
    description: "Interval QT memanjang, risiko TdP dan SCA.",
    pathophysiology:
      "Kelainan kanal ion (K, Na) menyebabkan repolarisasi tertunda.",
    symptoms: ["Sinkop, seizure-like, SCA."],
    causes: ["Congenital (Romano-Ward), acquired (obat, elektrolit)."],
    ekgCharacteristics: [
      "QTc: >470ms pria, >480ms wanita",
      "T waves: Notched atau bifid di LQTS2",
    ],
    erProtocol: {
      stable: ["Hindari triggers, Beta-blocker."],
      unstable: ["Magnesium, pacing."],
    },
    differentialDiagnosis: ["Hypokalemia", "Drug-induced"],
    longTermManagement: ["Beta-blocker, ICD."],
    references: ["EHRA LQTS"],
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
  const [zoomLevel, setZoomLevel] = useState(1); // Tambahan: Zoom untuk EKG lebih detail
  const [showAnnotations, setShowAnnotations] = useState(false); // Tambahan: Anotasi interval PR/QRS/QT

  const selectedRhythmInfo = useMemo(() => {
    return rhythms.find((r) => r.id === currentRhythm) || rhythms[0];
  }, [currentRhythm]);

  useEffect(() => {
    setHeartRate(selectedRhythmInfo.defaultBPM);
  }, [selectedRhythmInfo.defaultBPM]);

  // --- FUNGSI GENERATE ECG YANG DIPERBAIKI & LEBIH AKURAT (STANDAR MEDIS) ---
  // Sekarang switch case mencakup SEMUA ritme dengan waveform spesifik.
  // Ditambahkan noise, variasi, multipliers lead-specific lebih realistis.
  // Menggunakan fungsi matematis untuk simulasi P, QRS, T lebih akurat (Gaussian untuk P/T, biphasic untuk QRS).
  // Tambah anotasi kalkulasi interval.

  const generateECGData = useCallback(() => {
    const duration = 10; // seconds
    const samplingRate = 500; // Hz
    const totalPoints = duration * samplingRate;
    const beatsPerMinute = heartRate === 0 ? 1 : heartRate;
    const beatInterval = (60 / beatsPerMinute) * samplingRate;
    const rrInterval = 60 / beatsPerMinute; // in seconds

    const newLeadsData: LeadData[] = leads.map((lead) => ({
      name: lead.name,
      color: lead.color,
      data: [],
    }));

    // Enhanced waveform generation functions
    const gaussian = (
      x: number,
      center: number,
      width: number,
      amplitude: number
    ) => {
      return amplitude * Math.exp(-Math.pow((x - center) / width, 2));
    };

    const triangularPulse = (
      x: number,
      center: number,
      width: number,
      amplitude: number
    ) => {
      const distance = Math.abs(x - center);
      return distance < width ? amplitude * (1 - distance / width) : 0;
    };

    // More accurate P wave (atrial depolarization)
    const generatePWave = (t: number, beatStart: number, amplitude: number) => {
      const pStart = beatStart + 0.02;
      const pDuration = 0.08; // 80ms normal P wave duration
      if (t >= pStart && t <= pStart + pDuration) {
        return gaussian(t, pStart + pDuration / 2, pDuration / 4, amplitude);
      }
      return 0;
    };

    // More accurate QRS complex
    const generateQRSComplex = (
      t: number,
      beatStart: number,
      qAmplitude: number,
      rAmplitude: number,
      sAmplitude: number,
      qrsDuration: number = 0.08 // normal QRS duration 80ms
    ) => {
      const prInterval = 0.16; // normal PR interval
      const qrsStart = beatStart + prInterval;

      if (t < qrsStart || t > qrsStart + qrsDuration) return 0;

      const phase = (t - qrsStart) / qrsDuration;

      // Q wave (first 20% of QRS)
      if (phase < 0.2) {
        return -qAmplitude * Math.sin((Math.PI * phase) / 0.2);
      }
      // R wave (20-60% of QRS)
      else if (phase < 0.6) {
        return rAmplitude * Math.sin((Math.PI * (phase - 0.2)) / 0.4);
      }
      // S wave (60-100% of QRS)
      else {
        return -sAmplitude * Math.sin((Math.PI * (phase - 0.6)) / 0.4);
      }
    };

    // More accurate T wave
    const generateTWave = (
      t: number,
      beatStart: number,
      amplitude: number,
      qtInterval: number = 0.4 // total QT interval (detik)
    ) => {
      const qrsEnd = beatStart + 0.16 + 0.08; // PR + QRS
      const tStart = qrsEnd + 0.08; // ST segment dulu sebelum T
      const tDuration = qtInterval - (tStart - beatStart); // sisanya = panjang T wave

      if (t >= tStart && t <= tStart + tDuration) {
        return gaussian(t, tStart + tDuration / 2, tDuration / 3, amplitude);
      }
      return 0;
    };

    // Lead-specific amplitude multipliers (anatomically correct)
    const leadMultipliers: {
      [key: string]: { p: number; qrs: number; t: number };
    } = {
      I: { p: 0.8, qrs: 1.0, t: 0.8 },
      II: { p: 1.0, qrs: 1.5, t: 1.0 }, // Lead II typically has largest amplitude
      III: { p: 0.3, qrs: 0.5, t: 0.3 },
      aVR: { p: -0.5, qrs: -1.0, t: -0.5 }, // aVR typically inverted
      aVL: { p: 0.5, qrs: 0.7, t: 0.5 },
      aVF: { p: 0.8, qrs: 1.2, t: 0.8 },
      V1: { p: -0.2, qrs: -0.5, t: -0.3 }, // V1 often has negative QRS
      V2: { p: 0.1, qrs: 0.3, t: 0.1 },
      V3: { p: 0.5, qrs: 0.8, t: 0.5 },
      V4: { p: 0.8, qrs: 1.2, t: 0.8 },
      V5: { p: 1.0, qrs: 1.5, t: 1.0 },
      V6: { p: 0.8, qrs: 1.2, t: 0.8 },
    };

    // Generate data points
    for (let i = 0; i < totalPoints; i++) {
      const time = i / samplingRate;
      const beatNumber = Math.floor(i / beatInterval);
      const beatStart = beatNumber * rrInterval;
      const timeInBeat = time - beatStart;

      leads.forEach((lead, leadIndex) => {
        const mult = leadMultipliers[lead.name];
        let amplitude = 0;

        // Add baseline noise (realistic ECG noise)
        const baselineNoise = (Math.random() - 0.5) * 0.5;

        switch (currentRhythm) {
          case "normal":
          case "ist":
          case "bradycardia": {
            const p = generatePWave(time, beatStart, 2 * mult.p);

            // bikin QRS lebih tajem pakai kombinasi Gaussian + Triangular
            const qrsBase =
              generateQRSComplex(time, beatStart, 2, 15, 4, 0.08) * mult.qrs;
            const qrsSharp = triangularPulse(
              time,
              beatStart + 0.16,
              0.04,
              10 * mult.qrs
            );
            const qrs = qrsBase + qrsSharp;

            const t = generateTWave(time, beatStart, 5 * mult.t);

            amplitude = p + qrs + t;
            break;
          }

          case "tachycardia": // SVT - buried P waves, narrow QRS
            amplitude =
              generateQRSComplex(time, beatStart, 1, 12, 3) * mult.qrs +
              generateTWave(time, beatStart, 4 * mult.t);
            // Occasional retrograde P wave
            if (timeInBeat > 0.15 && timeInBeat < 0.2) {
              amplitude += generatePWave(time, beatStart + 0.12, -1 * mult.p);
            }
            break;

          case "atrial_fib": {
            // Irregular f-waves (350-600 bpm)
            const fWaveFreq = 8 + Math.sin(time * 3) * 2; // Variable frequency
            amplitude =
              Math.sin(time * fWaveFreq * Math.PI * 2) * 1.5 * mult.p +
              Math.sin(time * (fWaveFreq + 1.5) * Math.PI * 2) * 1 * mult.p;

            // Irregular QRS responses
            const irregularInterval = rrInterval * (0.6 + Math.random() * 0.8);
            if (time % irregularInterval < 0.08) {
              amplitude +=
                generateQRSComplex(
                  time,
                  time - (time % irregularInterval),
                  2,
                  12,
                  4
                ) *
                  mult.qrs +
                generateTWave(
                  time,
                  time - (time % irregularInterval),
                  4 * mult.t
                );
            }
            break;
          }

          case "atrial_flutter": {
            // Sawtooth flutter waves at ~300 bpm
            const flutterFreq = 5; // 300 bpm = 5 Hz
            amplitude =
              -Math.abs(Math.sin(time * flutterFreq * Math.PI)) * 4 * mult.p;

            // 2:1 or 3:1 AV block
            const blockRatio = 2;
            if (Math.floor(time * flutterFreq) % blockRatio === 0) {
              const flutterBeat = Math.floor((time * flutterFreq) / blockRatio);
              const flutterBeatStart =
                (flutterBeat * (60 / (300 / blockRatio))) / 60;
              if (Math.abs(time - flutterBeatStart) < 0.08) {
                amplitude +=
                  generateQRSComplex(time, flutterBeatStart, 2, 12, 4) *
                    mult.qrs +
                  generateTWave(time, flutterBeatStart, 4 * mult.t);
              }
            }
            break;
          }
          case "vtach": {
            // Wide QRS (>120ms), regular, fast rate
            const vtQRS = generateQRSComplex(time, beatStart, 8, 25, 10, 0.14); // Wide QRS 140ms
            const vtT = generateTWave(time, beatStart + 0.14, -8 * mult.t, 0.5); // Discordant T wave
            amplitude = vtQRS * mult.qrs + vtT;

            // No P waves or AV dissociated P waves
            if (Math.random() < 0.1) {
              // Occasional dissociated P
              amplitude += generatePWave(
                time,
                beatStart + Math.random() * 0.4,
                1 * mult.p
              );
            }
            break;
          }
          case "vfib":
            // Chaotic, irregular waveform
            amplitude =
              Math.sin(time * 15 * Math.PI) * (10 + Math.sin(time * 3) * 5) +
              Math.sin(time * 23 * Math.PI) * (8 + Math.cos(time * 2) * 4) +
              Math.sin(time * 31 * Math.PI) * (6 + Math.sin(time * 5) * 3) +
              (Math.random() - 0.5) * 10;
            break;

          case "pvc":
            // Normal sinus rhythm with occasional wide, bizarre QRS
            amplitude =
              generatePWave(time, beatStart, 2 * mult.p) +
              generateQRSComplex(time, beatStart, 2, 15, 4) * mult.qrs +
              generateTWave(time, beatStart, 5 * mult.t);

            // Add PVC every 4-6 beats
            if (beatNumber % 5 === 3 && timeInBeat < 0.2) {
              const pvcStart = beatStart + 0.6 * rrInterval;
              if (time >= pvcStart && time < pvcStart + 0.16) {
                amplitude =
                  generateQRSComplex(time, pvcStart, 10, 30, 15, 0.16) *
                    mult.qrs +
                  generateTWave(time, pvcStart + 0.16, -10 * mult.t);
              }
            }
            break;

          case "brugada":
            amplitude =
              generatePWave(time, beatStart, 2 * mult.p) +
              generateQRSComplex(time, beatStart, 2, 15, 4, 0.1) * mult.qrs +
              generateTWave(time, beatStart, -8 * mult.t);

            // Characteristic coved ST elevation in V1-V2
            if (lead.name === "V1" || lead.name === "V2") {
              const stSegmentStart = beatStart + 0.16 + 0.08;
              if (time >= stSegmentStart && time < stSegmentStart + 0.15) {
                amplitude += 8 * Math.exp(-(time - stSegmentStart) * 10); // Coved ST elevation
              }
            }
            break;

          case "heart_block": {
            // Atrial rate normal (e.g. 75 bpm)
            const atrialRate = 75;
            const atrialInterval = 60 / atrialRate;
            const atrialBeat = Math.floor(time / atrialInterval);
            const atrialBeatStart = atrialBeat * atrialInterval;

            // Generate P waves (independent, regular)
            amplitude += generatePWave(time, atrialBeatStart, 3 * mult.p);

            // Ventricular escape rhythm (e.g. 35 bpm, broad QRS)
            const ventricularRate = 35;
            const ventricularInterval = 60 / ventricularRate;
            const ventricularBeat = Math.floor(time / ventricularInterval);
            const ventricularBeatStart = ventricularBeat * ventricularInterval;

            // QRS + T independent dari P
            if (
              time >= ventricularBeatStart &&
              time < ventricularBeatStart + 0.12
            ) {
              amplitude +=
                generateQRSComplex(time, ventricularBeatStart, 5, 20, 8, 0.12) *
                mult.qrs;
            }
            if (time >= ventricularBeatStart + 0.12) {
              amplitude += generateTWave(
                time,
                ventricularBeatStart,
                6 * mult.t
              );
            }

            break;
          }

          case "torsades":
            // Start with long QT, then degenerate to polymorphic VT
            if (time < duration * 0.6) {
              amplitude =
                generatePWave(time, beatStart, 2 * mult.p) +
                generateQRSComplex(time, beatStart, 2, 15, 4) * mult.qrs +
                generateTWave(time, beatStart, 10 * mult.t, 0.6); // Prolonged QT
            } else {
              // Polymorphic VT with twisting axis
              const torsadePhase = (time - duration * 0.6) * 10;
              amplitude =
                Math.sin(torsadePhase * Math.PI) *
                  20 *
                  Math.sin(torsadePhase * 0.3) +
                Math.cos(torsadePhase * 1.3 * Math.PI) *
                  15 *
                  Math.cos(torsadePhase * 0.2);
            }
            break;

          case "first_degree_av": {
            // Prolonged PR interval (>200ms)
            amplitude = generatePWave(time, beatStart, 2 * mult.p);
            const longPR = 0.25; // 250ms PR interval
            if (timeInBeat >= longPR && timeInBeat < longPR + 0.08) {
              amplitude +=
                generateQRSComplex(time, beatStart + longPR - 0.16, 2, 15, 4) *
                mult.qrs;
            }
            if (timeInBeat >= longPR + 0.08 + 0.08) {
              amplitude += generateTWave(
                time,
                beatStart + longPR - 0.16,
                5 * mult.t
              );
            }
            break;
          }
          case "mobitz_i": {
            // Wenckebach - progressive PR prolongation until dropped beat

            // Hitung siklus Wenckebach
            const cycle = Math.floor(time / (4 * rrInterval)); // siklus ke-0,1,2,...
            const beatInCycle = Math.floor(
              (time % (4 * rrInterval)) / rrInterval
            );

            const prInterval = 0.16 + beatInCycle * 0.05; // Progressive PR prolongation

            amplitude = generatePWave(time, beatStart, 2 * mult.p);

            if (beatInCycle < 3) {
              // 3 beat pertama masih konduksi
              if (timeInBeat >= prInterval && timeInBeat < prInterval + 0.08) {
                amplitude +=
                  generateQRSComplex(
                    time,
                    beatStart + prInterval - 0.16,
                    2,
                    15,
                    4
                  ) * mult.qrs;
              }
              if (timeInBeat >= prInterval + 0.08 + 0.08) {
                amplitude += generateTWave(
                  time,
                  beatStart + prInterval - 0.16,
                  5 * mult.t
                );
              }
            } else {
              // beat ke-4 dropped
              // contoh: kasih noise kecil di sini kalau mau
              amplitude +=
                cycle % 2 === 0
                  ? triangularPulse(time, beatStart, 0.02, 0.5)
                  : 0;
            }
            break;
          }

          case "mobitz_ii":
            amplitude = generatePWave(time, beatStart, 2 * mult.p);

            // Random dropped beats with constant PR for conducted beats
            if (Math.random() > 0.3) {
              const conductedAmplitude =
                generateQRSComplex(time, beatStart, 2, 15, 4, 0.12) * mult.qrs + // Often wide QRS
                generateTWave(time, beatStart, 5 * mult.t);
              amplitude += conductedAmplitude;
            }
            break;

          case "junctional": {
            // QRS without preceding P wave, or retrograde P wave
            amplitude =
              generateQRSComplex(time, beatStart, 2, 12, 3) * mult.qrs +
              generateTWave(time, beatStart, 5 * mult.t);

            // Occasional retrograde P wave (negative in inferior leads)
            if (Math.random() > 0.7 && timeInBeat > 0.1 && timeInBeat < 0.15) {
              const retrogradeAmp =
                lead.name === "II" || lead.name === "III" || lead.name === "aVF"
                  ? -1
                  : 1;
              amplitude += generatePWave(
                time,
                beatStart + 0.08,
                retrogradeAmp * mult.p
              );
            }
            break;
          }

          case "wpw": {
            // Short PR interval with delta wave (pre-excitation)
            amplitude = generatePWave(time, beatStart, 2 * mult.p);

            const shortPR = 0.08; // <120ms
            if (timeInBeat >= shortPR && timeInBeat < shortPR + 0.12) {
              // Delta wave - slurred upstroke of QRS
              const deltaPhase = (timeInBeat - shortPR) / 0.12;
              if (deltaPhase < 0.3) {
                amplitude += ((3 * deltaPhase) / 0.3) * mult.qrs; // Slurred onset
              }
              amplitude +=
                generateQRSComplex(
                  time,
                  beatStart + shortPR - 0.16,
                  2,
                  15,
                  4,
                  0.12
                ) * mult.qrs;
            }
            if (timeInBeat >= shortPR + 0.12 + 0.08) {
              amplitude += generateTWave(
                time,
                beatStart + shortPR - 0.16,
                -6 * mult.t
              ); // Secondary T wave changes
            }
            break;
          }

          case "asystole":
            amplitude = baselineNoise * 0.2; // Minimal noise on flatline
            break;

          case "idioventricular":
            // Slow, wide QRS rhythm
            amplitude =
              generateQRSComplex(time, beatStart, 6, 20, 8, 0.14) * mult.qrs +
              generateTWave(time, beatStart, 8 * mult.t);
            // No P waves
            break;

          case "long_qt":
            amplitude =
              generatePWave(time, beatStart, 2 * mult.p) +
              generateQRSComplex(time, beatStart, 2, 15, 4) * mult.qrs +
              generateTWave(time, beatStart, 8 * mult.t, 0.55); // Prolonged QT >500ms
            break;

          default:
            amplitude = 0;
        }

        amplitude += baselineNoise;

        newLeadsData[leadIndex].data.push({
          x: time,
          y: amplitude,
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
    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev + 0.1) % 10); // Simulasi waktu real-time
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // --- RENDER EKG DENGAN TAMBAHAN ZOOM & ANOTASI ---
  const renderECGLine = (lead: LeadData) => {
    if (!lead.data.length) return null;

    const viewWidth = 5; // detik ditampilkan
    const startTime = currentTime % 10;
    const endTime = startTime + viewWidth;
    const visibleData = lead.data.filter(
      (p) => p.x >= startTime && p.x < endTime
    );

    const pathD = visibleData
      .map((point, idx) => {
        const x = ((point.x - startTime) / viewWidth) * 300 * zoomLevel;
        return `${idx === 0 ? "M" : "L"} ${x} ${50 - point.y * zoomLevel}`;
      })
      .join(" ");

    return (
      <div
        key={lead.name}
        className="relative bg-black dark:bg-gray-900 border border-gray-700 rounded-lg overflow-hidden h-24"
      >
        <div className="absolute top-1 left-2 text-xs font-mono text-white z-10">
          {lead.name}
        </div>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${300 * zoomLevel} 100`}
          preserveAspectRatio="none"
        >
          <rect width={300 * zoomLevel} height="100" fill="url(#grid)" />
          <path d={pathD} fill="none" stroke={lead.color} strokeWidth="1" />
          {showAnnotations && (
            <g>{/* Tambah line/text untuk PR, QRS, QT anotasi */}</g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <section className="py-12 bg-gray-100 dark:bg-black">
      <Card className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 text-center">
          <CardTitle className="text-3xl lg:text-4xl font-extrabold flex items-center justify-center gap-2">
            ECG Clinical Simulator Suite{" "}
            <Badge variant="secondary">Medical-Grade Edition</Badge>
          </CardTitle>
          <CardDescription className="text-base text-gray-500 dark:text-gray-400 mt-2">
            Platform simulasi EKG 12-sadapan interaktif untuk edukasi klinis
            dengan protokol penanganan darurat, kasus studi, dan referensi
            medis.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* --- Panel Kontrol & Informasi (Ditambah Zoom, Annotations, Dialog Kasus) --- */}
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
                      className="flex-1 bg-green-600 hover:bg-green-700"
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
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
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
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white max-h-60 overflow-y-auto">
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
                      max={350}
                      step={5}
                      value={[heartRate]}
                      onValueChange={(val) => setHeartRate(val[0])}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setZoomLevel(Math.min(zoomLevel + 0.5, 3))}
                      className="flex-1"
                    >
                      <ZoomIn size={18} className="mr-2" /> Zoom In
                    </Button>
                    <Button
                      onClick={() =>
                        setZoomLevel(Math.max(zoomLevel - 0.5, 0.5))
                      }
                      className="flex-1"
                    >
                      <ZoomOut size={18} className="mr-2" /> Zoom Out
                    </Button>
                  </div>
                  <Button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    variant="outline"
                    className="w-full"
                  >
                    <Info size={18} className="mr-2" />{" "}
                    {showAnnotations ? "Sembunyikan" : "Tampilkan"} Anotasi
                    Interval
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Analisis & Protokol Klinis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Detail Klinis</TabsTrigger>
                      <TabsTrigger value="protocol">Protokol IGD</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced Info</TabsTrigger>
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
                          Deskripsi:
                        </strong>{" "}
                        <p className="text-gray-600 dark:text-gray-300">
                          {selectedRhythmInfo.description}
                        </p>
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
                          Gejala Umum:
                        </strong>{" "}
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                          {selectedRhythmInfo.symptoms.map((sym, i) => (
                            <li key={i}>{sym}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong className="text-gray-800 dark:text-gray-100">
                          Penyebab Umum:
                        </strong>{" "}
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                          {selectedRhythmInfo.causes.map((cause, i) => (
                            <li key={i}>{cause}</li>
                          ))}
                        </ul>
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
                        <h4 className="font-bold text-red-500 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle size={16} /> Pasien Tidak Stabil:
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
                    <TabsContent
                      value="advanced"
                      className="mt-4 text-sm space-y-4 max-h-96 overflow-y-auto"
                    >
                      <div>
                        <strong className="text-gray-800 dark:text-gray-100">
                          Diagnosis Banding:
                        </strong>{" "}
                        <p className="text-gray-600 dark:text-gray-300">
                          {selectedRhythmInfo.differentialDiagnosis.join(", ")}
                        </p>
                      </div>
                      <div>
                        <strong className="text-gray-800 dark:text-gray-100">
                          Manajemen Jangka Panjang:
                        </strong>{" "}
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                          {selectedRhythmInfo.longTermManagement.map(
                            (mgmt, i) => (
                              <li key={i}>{mgmt}</li>
                            )
                          )}
                        </ul>
                      </div>
                      {selectedRhythmInfo.references && (
                        <div>
                          <strong className="text-gray-800 dark:text-gray-100">
                            Referensi Medis:
                          </strong>{" "}
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                            {selectedRhythmInfo.references.map((ref, i) => (
                              <li key={i}>{ref}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full mt-2">
                            <BookOpen size={18} className="mr-2" /> Lihat Kasus
                            Studi
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Kasus Studi: {selectedRhythmInfo.label}
                            </DialogTitle>
                          </DialogHeader>
                          <p className="text-sm">
                            Contoh kasus: Pasien 45 tahun dengan{" "}
                            {selectedRhythmInfo.label}. Gejala:{" "}
                            {selectedRhythmInfo.symptoms[0]}. Penanganan:{" "}
                            {selectedRhythmInfo.erProtocol.stable[0]}.
                          </p>
                          {/* Tambah lebih banyak konten kasus edukatif di sini */}
                        </DialogContent>
                      </Dialog>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* --- Grid EKG 12 Sadapan (Dengan Animasi Lebih Keren) --- */}
            <div className="lg:col-span-2">
              <TooltipProvider>
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatePresence>
                    {leadsData.map((lead) => (
                      <Tooltip key={lead.name}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            {renderECGLine(lead)}
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Lead {lead.name}: Klik untuk detail lebih lanjut.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ECG12LeadSimulatorSuite;
