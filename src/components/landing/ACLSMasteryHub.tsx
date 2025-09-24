// src/components/landing/ACLSMasteryHub.tsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player/youtube";
import {
  Zap,
  HelpCircle,
  HeartPulse,
  Award,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BrainCircuit,
  Users,
  Pill,
  Stethoscope,
  BarChart,
  FileText,
  Globe,
  Search,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// --- DATA LEBIH KOMPREHENSIF DAN LENGKAP SESUAI STANDAR AHA 2020/2025 UPDATES ---
const aclsDrugs = [
  {
    name: "Adenosine",
    class: "Antiaritmia Kelas V",
    mechanism:
      "Memperlambat konduksi melalui nodus AV, menginterupsi sirkuit re-entry.",
    dosage:
      "Dosis pertama: 6 mg IV bolus cepat (1-3 detik). Dosis kedua: 12 mg jika perlu. Dosis ketiga: 12 mg jika masih diperlukan.",
    use: "SVT QRS sempit reguler stabil. Tidak direkomendasikan untuk AF/A-flutter ireguler.",
    pearls:
      "Efek samping transient (flushing, nyeri dada, bradikardia) adalah normal. Ikuti dengan flush saline 20 mL. Kontraindikasi: asma aktif, blok AV derajat 2/3 tanpa pacemaker.",
    contraindications: "Asma, blok AV derajat tinggi, sindrom sick sinus.",
    sideEffects: "Asistol transient, flushing, dispnea.",
    references: "AHA ACLS Guidelines 2020: Section 7.3",
  },
  {
    name: "Amiodarone",
    class: "Antiaritmia Kelas III",
    mechanism:
      "Memperpanjang fase 3 potensial aksi jantung (repolarisasi), blokade kanal K+, Na+, Ca2+.",
    dosage:
      "Henti jantung (VT/VF): 300 mg IV/IO bolus, dapat diulang 150 mg sekali. Takikardia stabil: 150 mg IV selama 10 menit, diikuti infus 1 mg/menit selama 6 jam, lalu 0.5 mg/menit.",
    use: "VT/VF refrakter, takiaritmia atrial/ventrikel stabil/tidak stabil.",
    pearls:
      "Dapat menyebabkan hipotensi dan bradikardia. Waktu paruh sangat panjang (hingga 58 hari). Monitor fungsi tiroid dan paru.",
    contraindications: "Bradikardia berat, blok AV tanpa pacemaker, kehamilan.",
    sideEffects: "Hipotensi, bradikardia, toksisitas paru, hipotiroidisme.",
    references: "AHA ACLS Guidelines 2020: Section 7.4",
  },
  {
    name: "Atropine Sulfate",
    class: "Antikolinergik",
    mechanism:
      "Meningkatkan laju sinus dengan memblokir efek vagal pada nodus SA dan AV.",
    dosage:
      "0.5 mg IV setiap 3-5 menit, dosis maksimal total 3 mg (0.04 mg/kg).",
    use: "Bradikardia simtomatik, toksisitas organofosfat.",
    pearls:
      "Tidak efektif pada blok AV derajat II Tipe Mobitz II atau blok AV derajat III. Gunakan pacing sebagai gantinya. Dapat memperburuk iskemia miokard.",
    contraindications: "Glukoma sudut sempit, miastenik gravis.",
    sideEffects: "Takikardia, mulut kering, penglihatan kabur, retensi urin.",
    references: "AHA ACLS Guidelines 2020: Section 6.2",
  },
  {
    name: "Dopamine",
    class: "Inotropik/Vasopresor",
    mechanism:
      "Stimulasi reseptor adrenergik: dosis rendah (dopaminergik), sedang (beta-1), tinggi (alfa-1).",
    dosage:
      "Infus IV 5-20 mcg/kg/menit, titrasi sesuai respons tekanan darah dan perfusi.",
    use: "Bradikardia simtomatik (setelah atropine gagal), hipotensi dengan tanda syok kardiogenik/hipovolemik.",
    pearls:
      "Dapat menyebabkan takiaritmia. Perlu jalur IV sentral untuk dosis tinggi. Monitor tanda ekstravasasi.",
    contraindications: "Hipovolemia tidak terkoreksi, feokromositoma.",
    sideEffects: "Takikardia, hipertensi, mual, aritmia ventrikel.",
    references: "AHA ACLS Guidelines 2020: Section 6.3",
  },
  {
    name: "Epinephrine",
    class: "Inotropik/Vasopresor",
    mechanism:
      "Stimulasi kuat reseptor alfa dan beta adrenergik, meningkatkan kontraktilitas, laju jantung, dan vasokonstriksi.",
    dosage:
      "Henti jantung: 1 mg IV/IO setiap 3-5 menit. Bradikardia/Hipotensi: Infus 2-10 mcg/menit. Anafilaksis: 0.3-0.5 mg IM.",
    use: "Henti jantung (semua ritme), bradikardia simtomatik berat, anafilaksis, syok septik.",
    pearls:
      "Meningkatkan kerja jantung dan konsumsi oksigen miokard. Gunakan dengan hati-hati pada pasien dengan penyakit jantung koroner.",
    contraindications: "Tidak ada kontraindikasi absolut pada henti jantung.",
    sideEffects: "Hipertensi, takikardia, iskemia miokard, tremor.",
    references: "AHA ACLS Guidelines 2020: Section 5.1",
  },
  {
    name: "Lidocaine",
    class: "Antiaritmia Kelas IB",
    mechanism:
      "Memblokir kanal natrium, menekan otomatisitas ventrikel dan re-entry.",
    dosage:
      "Henti jantung (VT/VF): 1-1.5 mg/kg IV/IO bolus, ulang 0.5-0.75 mg/kg (maks 3 mg/kg). Takikardia stabil: Infus 1-4 mg/menit.",
    use: "Alternatif Amiodarone pada VT/VF refrakter, VT stabil.",
    pearls:
      "Perhatikan tanda toksisitas SSP (kebingungan, kejang, tinnitus). Kurangi dosis pada pasien lansia atau gagal hati.",
    contraindications: "Alergi lidocaine, blok AV derajat tinggi.",
    sideEffects: "Kejang, parestesia, hipotensi.",
    references: "AHA ACLS Guidelines 2020: Section 7.5",
  },
  {
    name: "Magnesium Sulfate",
    class: "Elektrolit",
    mechanism:
      "Kofaktor penting dalam transpor elektrolit, menstabilkan membran sel, memblokir kanal kalsium.",
    dosage:
      "Torsades de Pointes: 1-2 gram IV dilarutkan dalam 10 mL D5W selama 5-20 menit. Hipomagnesemia: 2-4 gram IV.",
    use: "Torsades de Pointes (TdP), hipomagnesemia dengan aritmia, eklampsia.",
    pearls:
      "Pemberian terlalu cepat dapat menyebabkan hipotensi dan asistol. Monitor refleks tendon dan respirasi.",
    contraindications: "Blok AV, miastenik gravis.",
    sideEffects: "Hipotensi, flushing, depresan SSP.",
    references: "AHA ACLS Guidelines 2020: Section 7.6",
  },
  {
    name: "Procainamide",
    class: "Antiaritmia Kelas IA",
    mechanism:
      "Memblokir kanal natrium, memperlambat konduksi, memperpanjang refrakter.",
    dosage:
      "Infus 20-50 mg/menit hingga aritmia teratasi, hipotensi, atau dosis total 17 mg/kg tercapai. Infus pemeliharaan: 1-4 mg/menit.",
    use: "Takiaritmia stabil (AF, A-flutter, VT). Alternatif pada SVT refrakter.",
    pearls:
      "Hentikan jika QRS melebar >50% atau QT memanjang. Monitor untuk sindrom lupus-like.",
    contraindications: "Blok AV, gagal jantung berat.",
    sideEffects: "Hipotensi, proaritmia, agranulositosis.",
    references: "AHA ACLS Guidelines 2020: Section 7.7",
  },
  {
    name: "Beta-Blockers (e.g., Metoprolol, Esmolol)",
    class: "Antiaritmia Kelas II",
    mechanism:
      "Memblokir reseptor beta-1 adrenergik, menurunkan laju jantung, konduksi AV, dan kontraktilitas.",
    dosage:
      "Metoprolol: 5 mg IV lambat setiap 5 menit, maks 15 mg. Esmolol: Bolus 500 mcg/kg, infus 50 mcg/kg/menit.",
    use: "Takikardia QRS sempit reguler/ireguler stabil, kontrol laju pada AF/A-flutter, ACS.",
    pearls:
      "Hindari pada gagal jantung dekompensata, bradikardia berat, atau asma. Esmolol memiliki onset cepat dan waktu paruh pendek.",
    contraindications: "Asma, COPD berat, blok AV.",
    sideEffects: "Bradikardia, hipotensi, bronkospasme.",
    references: "AHA ACLS Guidelines 2020: Section 7.2",
  },
  {
    name: "Calcium Channel Blockers (e.g., Diltiazem, Verapamil)",
    class: "Antiaritmia Kelas IV",
    mechanism:
      "Memblokir kanal kalsium, memperlambat konduksi nodus AV dan SA.",
    dosage:
      "Diltiazem: 0.25 mg/kg IV selama 2 menit, ulang 0.35 mg/kg jika perlu. Verapamil: 2.5-5 mg IV selama 2 menit.",
    use: "Kontrol laju pada AF/A-flutter stabil, SVT sempit stabil.",
    pearls:
      "Hindari pada pasien dengan sindrom Wolff-Parkinson-White (WPW) atau gagal jantung. Monitor untuk hipotensi.",
    contraindications: "WPW dengan AF, gagal jantung sistolik.",
    sideEffects: "Hipotensi, bradikardia, edema.",
    references: "AHA ACLS Guidelines 2020: Section 7.1",
  },
  {
    name: "Vasopressin",
    class: "Vasopresor",
    mechanism:
      "Vasokonstriksi non-adrenergik melalui reseptor V1, meningkatkan tekanan darah.",
    dosage:
      "Henti jantung: 40 unit IV/IO sekali, sebagai alternatif epinephrine pertama.",
    use: "Henti jantung (VF/VT refrakter), syok vasodilator.",
    pearls:
      "Efek vasoconstrictor kuat tanpa peningkatan miokard oksigen seperti epinephrine. Tidak lagi direkomendasikan rutin sejak 2015, tapi masih opsional.",
    contraindications: "Hipotensi iskemik.",
    sideEffects: "Iskemia usus, hipertensi.",
    references: "AHA ACLS Guidelines 2020: Section 5.2 (Optional)",
  },
  // Tambah lebih banyak obat untuk kelengkapan
  {
    name: "Sodium Bicarbonate",
    class: "Buffer",
    mechanism: "Meneutralisasi asidosis dengan meningkatkan pH darah.",
    dosage:
      "1 mEq/kg IV bolus, ulang 0.5 mEq/kg setiap 10 menit berdasarkan ABG.",
    use: "Henti jantung dengan asidosis metabolik berat, hiperkalemia, toksisitas TCA.",
    pearls:
      "Gunakan hanya jika terbukti asidosis (ABG). Dapat memperburuk hiperkapnia.",
    contraindications: "Asidosis respiratorik.",
    sideEffects: "Hipernatremia, alkalosis metabolik.",
    references: "AHA ACLS Guidelines 2020: Section 5.3",
  },
];

const quizScenarios = [
  {
    id: "svt_stable",
    title: "Skenario 1: Takikardia QRS Sempit Stabil",
    initial: {
      scenario:
        "Wanita 30 tahun datang dengan keluhan berdebar-debar sejak 1 jam yang lalu. Sadar penuh, sedikit cemas. Tanda vital: TD 130/80 mmHg, HR 170/menit, RR 20/menit, SpO2 99%. Tidak ada riwayat jantung.",
      ekgRhythm: "svt",
      question:
        "Anda melihat monitor EKG menunjukkan takikardia QRS sempit reguler. Apa langkah PERTAMA yang paling sesuai?",
      options: [
        "Segera lakukan kardioversi sinkronisasi",
        "Berikan Adenosine 6 mg IV bolus cepat",
        "Lakukan manuver vagal (Valsalva atau karotis massage)",
        "Berikan Amiodarone 150 mg IV infus",
      ],
      correctAnswer: 2,
      feedback:
        "Benar. Untuk takikardia QRS sempit reguler yang stabil, manuver vagal adalah intervensi non-invasif pertama yang direkomendasikan oleh AHA. Ini aman dan sering efektif.",
      references: "AHA ACLS 2020: Tachycardia Algorithm",
    },
    steps: [
      {
        trigger: 2, // Jika benar
        scenario:
          "Manuver Valsalva dilakukan, tapi irama tidak berubah. Pasien tetap stabil hemodinamik. Tidak ada tanda syok.",
        ekgRhythm: "svt",
        question: "Apa intervensi selanjutnya?",
        options: [
          "Ulangi manuver vagal hingga 3 kali",
          "Berikan Adenosine 6 mg IV cepat diikuti flush",
          "Berikan Beta-blocker seperti Metoprolol 5 mg IV",
          "Konsultasi kardiolog untuk ablasi",
        ],
        correctAnswer: 1,
        feedback:
          "Tepat. Adenosine adalah obat lini pertama setelah manuver vagal gagal. Ini membantu mendiagnosis dan mengobati SVT re-entry.",
        references: "AHA ACLS 2020: Section 7.3",
      },
      {
        trigger: 1, // Jika salah (Adenosine duluan)
        scenario:
          "Adenosine diberikan, irama kembali ke sinus. Pasien stabil. Namun, protokol menyarankan pendekatan bertahap.",
        ekgRhythm: "sinus",
        question: "Apa yang seharusnya dicoba sebelum obat?",
        options: [
          "Memberikan oksigen suplemental",
          "Manuver vagal non-invasif",
          "Memasang defib pad",
          "Tidak ada, Adenosine sudah benar",
        ],
        correctAnswer: 1,
        feedback:
          "Manuver vagal seharusnya dicoba terlebih dahulu untuk menghindari efek samping obat yang tidak perlu.",
        references: "AHA ACLS 2020: Tachycardia with Pulse",
      },
      // Tambah step tambahan untuk kompleksitas
      {
        trigger: 1, // Lanjutan dari Adenosine
        scenario:
          "Setelah Adenosine, pasien mengalami asistol transient 5 detik, tapi pulih. Ini normal untuk Adenosine.",
        ekgRhythm: "asystole_transient",
        question: "Apa observasi selanjutnya?",
        options: [
          "Ulangi Adenosine 12 mg jika rekurens",
          "Monitor selama 24 jam di ICU",
          "Berikan cairan IV maintenance",
          "Rujuk ke elektrofisiologi",
        ],
        correctAnswer: 0,
        feedback:
          "Jika SVT berulang, ulangi Adenosine dengan dosis lebih tinggi. Monitor ketat diperlukan.",
        references: "AHA Guidelines",
      },
    ],
  },
  {
    id: "brady_unstable",
    title: "Skenario 2: Bradikardia Simtomatik Tidak Stabil",
    initial: {
      scenario:
        "Pria 75 tahun ditemukan hampir pingsan di rumah. Kulit pucat, dingin, berkeringat. Riwayat infark miokard. Tanda vital: TD 70/40 mmHg, HR 35/menit, RR 16/menit, SpO2 92%.",
      ekgRhythm: "bradycardia",
      question:
        "Pasien menunjukkan tanda tidak stabil (hipotensi, altered mental status). Apa intervensi farmakologis PERTAMA?",
      options: [
        "Epinephrine infus 2-10 mcg/menit",
        "Dopamine infus 5-20 mcg/kg/menit",
        "Atropine 1 mg IV bolus",
        "Tunggu hasil lab dan observasi",
      ],
      correctAnswer: 2,
      feedback:
        "Benar. Atropine adalah lini pertama untuk bradikardia simtomatik. Dosis awal 1 mg, dapat diulang hingga total 3 mg.",
      references: "AHA ACLS 2020: Bradycardia Algorithm",
    },
    steps: [
      {
        trigger: 2,
        scenario:
          "Atropine 1 mg diberikan, HR naik ke 45/menit, TD 80/50 mmHg. Pasien masih pusing dan lemah.",
        ekgRhythm: "bradycardia_partial",
        question: "Respons tidak adekuat. Apa langkah prioritas selanjutnya?",
        options: [
          "Ulangi Atropine 1 mg IV",
          "Siapkan transcutaneous pacing (TCP) segera",
          "Berikan Amiodarone untuk stabilisasi",
          "Bolus cairan normal saline 500 mL",
        ],
        correctAnswer: 1,
        feedback:
          "Tepat. Pacing transkutan adalah intervensi kunci ketika atropine gagal pada bradikardia tidak stabil.",
        references: "AHA ACLS 2020: Section 6.4",
      },
      // Tambah step
      {
        trigger: 1,
        scenario:
          "TCP dimulai pada 60 bpm, output 80 mA. Pasien merespons, HR 60/menit, TD 100/60 mmHg.",
        ekgRhythm: "paced_rhythm",
        question: "Apa tindakan lanjutan?",
        options: [
          "Konsultasi kardiolog untuk pacemaker permanen",
          "Hentikan TCP segera",
          "Berikan sedasi jika pasien tidak nyaman",
          "Kedua A dan C",
        ],
        correctAnswer: 3,
        feedback:
          "TCP sering tidak nyaman, berikan sedasi. Rujuk untuk evaluasi pacemaker.",
        references: "AHA Guidelines",
      },
    ],
  },
  {
    id: "vf_arrest",
    title: "Skenario 3: Henti Jantung - Ventricular Fibrillation",
    initial: {
      scenario:
        "Laki-laki 60 tahun kolaps di gym. Tidak responsif, tidak bernapas, tidak ada denyut nadi. Witnessed arrest.",
      ekgRhythm: "vf",
      question: "Apa langkah pertama setelah konfirmasi henti jantung?",
      options: [
        "Mulai CPR berkualitas tinggi",
        "Berikan Epinephrine 1 mg IV",
        "Defibrilasi segera dengan 200 J",
        "Intubasi endotrakeal",
      ],
      correctAnswer: 2,
      feedback:
        "Benar untuk witnessed VF: Defibrilasi segera. Jika unwitnessed, mulai CPR 2 menit dulu.",
      references: "AHA ACLS 2020: Cardiac Arrest Algorithm",
    },
    steps: [
      {
        trigger: 2,
        scenario: "Defibrilasi dilakukan, tapi VF persisten. CPR dilanjutkan.",
        ekgRhythm: "vf_persistent",
        question: "Apa obat pertama setelah defib?",
        options: [
          "Amiodarone 300 mg IV",
          "Epinephrine 1 mg IV",
          "Lidocaine 1.5 mg/kg IV",
          "Magnesium 2 g IV",
        ],
        correctAnswer: 1,
        feedback: "Epinephrine diberikan setiap 3-5 menit selama CPR.",
        references: "AHA ACLS 2020: Section 5",
      },
      {
        trigger: 1,
        scenario: "Epinephrine diberikan. Setelah 2 menit CPR, ritme VF lagi.",
        ekgRhythm: "vf",
        question: "Langkah selanjutnya?",
        options: [
          "Defibrilasi lagi, lalu Amiodarone 300 mg IV",
          "Ulangi Epinephrine",
          "Berikan Sodium Bicarbonate",
          "Cek reversible causes (Hs and Ts)",
        ],
        correctAnswer: 0,
        feedback: "Defib ulang, lalu antiaritmia seperti Amiodarone.",
        references: "AHA Guidelines",
      },
    ],
  },
  {
    id: "torsades",
    title: "Skenario 4: Torsades de Pointes",
    initial: {
      scenario:
        "Wanita 50 tahun dengan riwayat QT prolong, tiba-tiba pingsan. Monitor menunjukkan TdP dengan pulsa lemah.",
      ekgRhythm: "torsades",
      question: "Apa intervensi prioritas?",
      options: [
        "Defibrilasi unsynchronized",
        "Magnesium Sulfate 2 g IV",
        "Amiodarone 150 mg IV",
        "Pacing overdrive",
      ],
      correctAnswer: 1,
      feedback:
        "Magnesium adalah pengobatan pilihan untuk TdP, bahkan jika level Mg normal.",
      references: "AHA ACLS 2020: Polymorphic VT",
    },
    steps: [
      {
        trigger: 1,
        scenario:
          "Magnesium diberikan, ritme stabil ke sinus. QT masih prolong.",
        ekgRhythm: "sinus_qt_prolong",
        question: "Tindakan pencegahan rekurens?",
        options: [
          "Hindari obat QT-prolonging",
          "Berikan Beta-blocker",
          "Monitor elektrolit",
          "Semua di atas",
        ],
        correctAnswer: 3,
        feedback:
          "Manajemen komprehensif termasuk koreksi elektrolit dan hindari trigger.",
        references: "AHA Guidelines",
      },
    ],
  },
  {
    id: "afib_rvr",
    title: "Skenario 5: Atrial Fibrillation dengan RVR",
    initial: {
      scenario:
        "68-year-old male with a history of hypertension presents with palpitations and shortness of breath. He is alert but anxious. Vitals: BP 110/70, HR 140 (irregularly irregular), RR 22, SpO2 96%.",
      ekgRhythm: "af",
      question:
        "The EKG shows atrial fibrillation with rapid ventricular response (RVR). The patient is stable. What is the most appropriate initial treatment?",
      options: [
        "Amiodarone 150mg IV",
        "Synchronized cardioversion",
        "Diltiazem 0.25mg/kg IV",
        "Immediate defibrillation",
      ],
      correctAnswer: 2,
      feedback:
        "For stable AF with RVR, rate control is the priority. Calcium channel blockers (like Diltiazem) or beta-blockers are first-line agents.",
      references:
        "2019 AHA/ACC/HRS Focused Update of the 2014 AHA/ACC/HRS Guideline for the Management of Patients With Atrial Fibrillation - Circulation",
    },
    steps: [],
  },
  {
    id: "wpw",
    title: "Skenario 6: Wolff-Parkinson-White Syndrome",
    initial: {
      scenario:
        "A 22-year-old female presents with a history of recurrent palpitations. Her baseline EKG shows a short PR interval and a delta wave. She is currently asymptomatic.",
      ekgRhythm: "wpw",
      question: "What is the primary concern in a patient with WPW syndrome?",
      options: [
        "Risk of developing complete heart block.",
        "Risk of sudden cardiac death due to rapid conduction to the ventricles during AF.",
        "High risk of stroke.",
        "Development of Brugada syndrome.",
      ],
      correctAnswer: 1,
      feedback:
        "The accessory pathway in WPW can conduct atrial impulses at a very high rate during AF, leading to VF and sudden cardiac death.",
      references:
        "2015 ACC/AHA/HRS Guideline for the Management of Adult Patients With Supraventricular Tachycardia - JACC",
    },
    steps: [],
  },
  {
    id: "brugada",
    title: "Skenario 7: Brugada Syndrome",
    initial: {
      scenario:
        "A 40-year-old man of Southeast Asian descent is evaluated after a syncopal episode. His brother died suddenly at a young age. His EKG shows a coved ST-segment elevation in V1-V2.",
      ekgRhythm: "brugada",
      question:
        "What is the most effective long-term treatment for a symptomatic patient with Brugada syndrome?",
      options: [
        "Lifelong beta-blocker therapy.",
        "Implantable Cardioverter-Defibrillator (ICD).",
        "Catheter ablation.",
        "Amiodarone.",
      ],
      correctAnswer: 1,
      feedback:
        "An ICD is the only proven therapy to prevent sudden cardiac death in symptomatic Brugada syndrome patients.",
      references:
        "Brugada syndrome: a review of the literature - Journal of Arrhythmia",
    },
    steps: [],
  },
  {
    id: "aflutter",
    title: "Skenario 8: Atrial Flutter",
    initial: {
      scenario:
        "A 70-year-old male with a history of COPD presents with palpitations. EKG shows a regular, narrow-complex tachycardia at 150 bpm with a sawtooth pattern in leads II, III, and aVF.",
      ekgRhythm: "aflutter",
      question:
        "This is a classic presentation of Atrial Flutter with 2:1 block. If the patient is stable, what is a primary goal of management?",
      options: [
        "Immediate cardioversion.",
        "Rate control with a beta-blocker or calcium channel blocker.",
        "Administering adenosine to terminate the rhythm.",
        "Starting anticoagulation immediately.",
      ],
      correctAnswer: 1,
      feedback:
        "In stable atrial flutter, the initial goal is to control the ventricular rate. Anticoagulation is also crucial but rate control is the immediate priority.",
      references: "2019 AHA/ACC/HRS Focused Update for Atrial Fibrillation",
    },
    steps: [],
  },
  {
    id: "mobitz2",
    title: "Skenario 9: Mobitz II Second-Degree AV Block",
    initial: {
      scenario:
        "An 80-year-old female presents with recurrent syncope. Her EKG shows a heart rate of 40 bpm with a constant PR interval but intermittently dropped QRS complexes.",
      ekgRhythm: "second_degree_av_block_2",
      question: "What is the most appropriate next step in management?",
      options: [
        "Administer atropine.",
        "Observe and monitor.",
        "Prepare for transcutaneous pacing and consult cardiology for a permanent pacemaker.",
        "Start a dopamine infusion.",
      ],
      correctAnswer: 2,
      feedback:
        "Mobitz II is a high-degree block and is often a precursor to complete heart block. It is unstable and requires pacing.",
      references: "AHA ACLS 2020: Bradycardia Algorithm",
    },
    steps: [],
  },
];

// --- EKG Canvas Component ---
const EKGCanvas: React.FC<{
  rhythm: string;
  width?: number;
  height?: number;
}> = ({ rhythm, width = 500, height = 150 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const startTime = useRef(Date.now());

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Background grid
    ctx.strokeStyle = "#2a3a2a";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < width; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // EKG line
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const now = Date.now();
    const elapsedTime = (now - startTime.current) / 1000; // in seconds

    const speed = 100; // pixels per second
    const dataWindow = width / speed; // seconds
    const startIndex = Math.max(
      0,
      Math.floor((elapsedTime - dataWindow) * speed)
    );

    for (let i = 0; i < width; i++) {
      const dataIndex = startIndex + i;
      const y = getEKGPoint(rhythm, dataIndex, height);
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    ctx.stroke();

    animationFrameId.current = requestAnimationFrame(draw);
  }, [rhythm, width, height]);

  useEffect(() => {
    startTime.current = Date.now();
    animationFrameId.current = requestAnimationFrame(draw);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [draw]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
};

function getEKGPoint(type: string, i: number, height: number): number {
  const centerY = height / 2;
  const amplitude = height / 4;
  const beatLength = 100; // points per beat

  const x = i % beatLength;

  let y = 0;

  switch (type) {
    case "sinus":
      y = normalSinus(x);
      break;
    case "svt":
      y = svt(x, beatLength);
      break;
    case "vf":
      y = vf(i);
      break;
    case "bradycardia":
      y = bradycardia(i, beatLength);
      break;
    case "torsades":
      y = torsades(i);
      break;
    case "asystole_transient":
      y = i < 500 ? 0 : normalSinus(x);
      break;
    case "bradycardia_partial":
      y = bradycardia(i, beatLength, 0.7);
      break;
    case "paced_rhythm":
      y = pacedRhythm(x);
      break;
    case "vf_persistent":
      y = vf(i, 1.5);
      break;
    case "sinus_qt_prolong":
      y = normalSinus(x, 1.2);
      break;
    case "af":
      y = af(i);
      break;
    case "wpw":
      y = wpw(x);
      break;
    case "vt":
      y = vt(x, beatLength);
      break;
    case "brugada":
      y = brugada(x);
      break;
    case "aflutter":
      y = aflutter(i);
      break;
    case "junctional":
      y = junctional(x);
      break;
    case "first_degree_av_block":
      y = first_degree_av_block(x);
      break;
    case "second_degree_av_block_1":
      y = second_degree_av_block_1(i, beatLength);
      break;
    case "second_degree_av_block_2":
      y = second_degree_av_block_2(i, beatLength);
      break;
    case "third_degree_av_block":
      y = third_degree_av_block(i, beatLength);
      break;
    default:
      y = normalSinus(x);
  }

  return centerY - y * amplitude;
}

// --- EKG Waveform Functions ---
function normalSinus(x: number, qtFactor = 1): number {
  let y = 0;
  // P wave
  if (x > 10 && x < 20) y += 0.2 * Math.sin(((x - 10) / 10) * Math.PI);
  // QRS
  if (x > 30 && x < 32) y -= (x - 30) * 0.2;
  if (x >= 32 && x < 35) y += (x - 32) * 0.8 - 0.4;
  if (x >= 35 && x < 38) y -= (x - 35) * 0.5 - 2;
  // T wave
  if (x > 50 * qtFactor && x < 80 * qtFactor)
    y += 0.4 * Math.sin(((x - 50 * qtFactor) / (30 * qtFactor)) * Math.PI);
  return y;
}

function svt(x: number, len: number): number {
  const shortLen = len / 2;
  const currentX = x % shortLen;
  return normalSinus(currentX);
}

function vf(i: number, amp = 1): number {
  const noise1 = (Math.random() - 0.5) * 0.4;
  const noise2 = (Math.random() - 0.5) * 0.2;
  const signal =
    Math.sin(i * 0.1) * 0.5 +
    Math.sin(i * 0.23) * 0.3 +
    Math.sin(i * 0.51) * 0.2;
  return (signal + noise1 + noise2) * amp;
}

function bradycardia(i: number, len: number, factor = 1.5): number {
  const longLen = len * factor;
  const currentI = i % longLen;
  if (currentI < len) {
    return normalSinus(currentI % len);
  }
  return 0;
}

function torsades(i: number): number {
  const freq = 0.1;
  const modFreq = 0.01;
  return Math.sin(i * freq) * (1 + Math.sin(i * modFreq));
}

function pacedRhythm(x: number): number {
  let y = 0;
  // Pacing spike
  if (x > 28 && x < 30) y = 2.5;
  // QRS
  if (x > 30 && x < 32) y -= (x - 30) * 0.2;
  if (x >= 32 && x < 35) y += (x - 32) * 0.8 - 0.4;
  if (x >= 35 && x < 38) y -= (x - 35) * 0.5 - 2;
  // T wave
  if (x > 50 && x < 80) y += 0.4 * Math.sin(((x - 50) / 30) * Math.PI);
  return y;
}

function af(i: number): number {
  const fibrillatoryWave =
    Math.sin(i * 0.9) * 0.1 +
    Math.sin(i * 2.1) * 0.1 +
    (Math.random() - 0.5) * 0.15;
  if (Math.random() > 0.98) {
    // Irregularly trigger a QRS
    return normalSinus(i % 100) + fibrillatoryWave;
  }
  return fibrillatoryWave;
}

function vt(x: number, beatLength: number): number {
  const shortLen = beatLength / 2;
  const currentX = x % shortLen;
  let y = 0;
  // Wide QRS
  if (currentX > 10 && currentX < 40) {
    y = Math.sin(((currentX - 10) / 30) * Math.PI) * 2;
  }
  return y;
}

function wpw(x: number): number {
  let y = 0;
  // P wave
  if (x > 10 && x < 20) y += 0.2 * Math.sin(((x - 10) / 10) * Math.PI);
  // Delta wave + QRS
  if (x > 25 && x < 30) y += (x - 25) * 0.1; // Delta wave
  if (x > 30 && x < 32) y -= (x - 30) * 0.2;
  if (x >= 32 && x < 35) y += (x - 32) * 0.8 - 0.4;
  if (x >= 35 && x < 38) y -= (x - 35) * 0.5 - 2;
  // T wave
  if (x > 50 && x < 80) y += 0.4 * Math.sin(((x - 50) / 30) * Math.PI);
  return y;
}

function brugada(x: number): number {
  let y = 0;
  // P wave
  if (x > 10 && x < 20) y += 0.2 * Math.sin(((x - 10) / 10) * Math.PI);
  // QRS
  if (x > 30 && x < 32) y -= (x - 30) * 0.2;
  if (x >= 32 && x < 35) y += (x - 32) * 0.8 - 0.4;
  if (x >= 35 && x < 38) y -= (x - 35) * 0.5 - 2;
  // Coved ST elevation and inverted T wave
  if (x > 38 && x < 80) {
    y += 0.6 * Math.exp(-(x - 38) / 10) * Math.cos((x - 38) / 5);
  }
  return y;
}

function aflutter(i: number): number {
  const sawtooth = ((i % 25) / 25) * 0.5 - 0.25;
  let qrs = 0;
  if (i % 100 > 30 && i % 100 < 38) {
    qrs = normalSinus(i % 100);
  }
  return sawtooth + qrs;
}

function junctional(x: number): number {
  let y = 0;
  // No P wave
  // QRS
  if (x > 30 && x < 32) y -= (x - 30) * 0.2;
  if (x >= 32 && x < 35) y += (x - 32) * 0.8 - 0.4;
  if (x >= 35 && x < 38) y -= (x - 35) * 0.5 - 2;
  // T wave
  if (x > 50 && x < 80) y += 0.4 * Math.sin(((x - 50) / 30) * Math.PI);
  return y;
}

function first_degree_av_block(x: number): number {
  return normalSinus(x, 1.5); // Use qtFactor to simulate long PR
}

function second_degree_av_block_1(i: number, beatLength: number): number {
  const beat = Math.floor(i / beatLength);
  const x = i % beatLength;
  const pr_prolongation = (beat % 4) * 0.2;
  if (beat % 4 === 3) {
    // Drop beat
    // P wave only
    if (x > 10 && x < 20) return 0.2 * Math.sin(((x - 10) / 10) * Math.PI);
    return 0;
  }
  return normalSinus(x, 1 + pr_prolongation);
}

function second_degree_av_block_2(i: number, beatLength: number): number {
  const beat = Math.floor(i / beatLength);
  const x = i % beatLength;
  if (beat % 3 === 2) {
    // Drop beat
    // P wave only
    if (x > 10 && x < 20) return 0.2 * Math.sin(((x - 10) / 10) * Math.PI);
    return 0;
  }
  return normalSinus(x);
}

function third_degree_av_block(i: number, beatLength: number): number {
  const p_wave_x = i % (beatLength / 2);
  const qrs_x = i % Math.floor(beatLength * 1.5);
  let y = 0;
  // P waves at their own rate
  if (p_wave_x > 10 && p_wave_x < 20)
    y += 0.2 * Math.sin(((p_wave_x - 10) / 10) * Math.PI);
  // QRS at its own rate
  if (qrs_x > 30 && qrs_x < 38) {
    y += junctional(qrs_x);
  }
  return y;
}

// --- SUB-KOMPONEN BARU DAN DIPERLUAS ---

const IntroTab: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen /> Pengantar ACLS Aritmia - Standar AHA Terbaru
        </CardTitle>
        <CardDescription>
          Memahami dasar-dasar penanganan darurat gangguan irama jantung sesuai
          American Heart Association (AHA) Guidelines 2020 dengan update 2025.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p>
          <strong>Advanced Cardiovascular Life Support (ACLS)</strong> adalah
          protokol standar untuk menangani emergensi kardiovaskular, termasuk
          aritmia mengancam jiwa, henti jantung, dan syok. Fokus pada
          identifikasi cepat ritme EKG, penilaian stabilitas pasien, dan
          intervensi tepat waktu untuk meningkatkan survival rate.
        </p>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Disclaimer Medis</AlertTitle>
          <AlertDescription>
            Konten ini untuk tujuan edukatif saja dan tidak menggantikan
            pelatihan ACLS resmi dari AHA atau lembaga terakreditasi. Selalu
            ikuti protokol institusi dan konsultasikan profesional medis.
          </AlertDescription>
        </Alert>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="principles">
            <AccordionTrigger>Prinsip Utama ACLS</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  High-quality CPR: Kompresi 100-120/menit, kedalaman 5-6 cm,
                  minim interrupsi.
                </li>
                <li>Defibrilasi dini untuk ritme shockable (VF/VT).</li>
                <li>
                  Manajemen airway lanjutan: ET tube atau supraglottic device.
                </li>
                <li>
                  Pencarian reversible causes: 5H (Hypoxia, Hypovolemia, H+ ion,
                  Hypo/Hyperkalemia, Hypothermia) & 5T (Toxins, Tamponade,
                  Tension pneumo, Thrombosis, Trauma).
                </li>
                <li>
                  Post-resuscitation care: Targeted temperature management, PCI
                  jika STEMI.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="updates">
            <AccordionTrigger>Update Terbaru 2025</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  Penekanan pada double sequential defibrillation untuk VF
                  refrakter.
                </li>
                <li>Integrasi AI untuk interpretasi EKG real-time.</li>
                <li>
                  Expanded role of point-of-care ultrasound (POCUS) in arrest.
                </li>
                <li>Focus on team dynamics and debriefing post-code.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="aspect-video rounded-lg overflow-hidden border">
            <ReactPlayer
              url="https://youtu.be/VOxU2a7kMrk"
              width="100%"
              height="100%"
              controls
              light
            />
          </div>
          <div className="aspect-video rounded-lg overflow-hidden border">
            <ReactPlayer
              url="https://youtu.be/nfPss8VAS8c"
              width="100%"
              height="100%"
              controls
              light
            />{" "}
            {/* Video tambahan AHA ACLS overview */}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

type AlgorithmNodeProps = {
  title: string;
  content: React.ReactNode;
  color: string;
  onClick: () => void;
};

const AlgorithmNode: React.FC<AlgorithmNodeProps> = ({
  title,
  content,
  color,
  onClick,
}) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    className={cn("p-4 rounded-lg border-2 cursor-pointer", color)}
    onClick={onClick}
  >
    <h4 className="font-bold">{title}</h4>
    <p className="text-sm">{content}</p>
  </motion.div>
);

const InteractiveAlgorithmTab: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState("tachycardia");
  const [detail, setDetail] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const algorithms = {
    tachycardia: (
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <AlgorithmNode
          title="1. Identifikasi & Penilaian Awal"
          content="Jaga ABC, oksigen jika hipoksik, monitor vital signs, EKG 12-lead."
          color="border-gray-400"
          onClick={() =>
            setDetail({
              title: "Penilaian Awal",
              content:
                "Fokus pada stabilitas: TD <90 mmHg systolik, altered mental, syok, iskemia, HF. Gunakan POCUS jika tersedia.",
            })
          }
        />
        <div className="text-center font-bold">↓</div>
        <AlgorithmNode
          title="2. Stabil atau Tidak Stabil?"
          content="Tidak stabil: Hipotensi, AMS, syok, chest pain, acute HF."
          color="border-yellow-500"
          onClick={() =>
            setDetail({
              title: "Stabilitas",
              content:
                "Keputusan ini menentukan urgency. Tidak stabil → intervensi elektrik segera.",
            })
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-center font-semibold">TIDAK STABIL</h4>
            <AlgorithmNode
              title="3a. Kardioversi Sinkronisasi"
              content="Sedasi jika sadar. Energi: SVT/AF 50-100J, VT mono 100J, poly 200J."
              color="border-red-500"
              onClick={() =>
                setDetail({
                  title: "Kardioversi",
                  content: (
                    <div>
                      <p>Sinkronisasi dengan R-wave untuk hindari R-on-T.</p>
                      <strong>Dosis:</strong>
                      <ul>
                        <li>SVT: 50-100J</li>
                        <li>VT: 100J meningkat</li>
                      </ul>
                    </div>
                  ),
                })
              }
            />
            <AlgorithmNode
              title="4a. Jika Persisten"
              content="Cari reversible causes, konsultasi expert, pertimbangkan antiaritmia."
              color="border-red-600"
              onClick={() =>
                setDetail({
                  title: "Manajemen Persisten",
                  content:
                    "Ulangi kardioversi, berikan Amiodarone atau Procainamide.",
                })
              }
            />
          </div>
          <div className="space-y-2">
            <h4 className="text-center font-semibold">STABIL</h4>
            <AlgorithmNode
              title="3b. QRS Sempit (<0.12s) atau Lebar?"
              content="Sempit: Supraventrikular. Lebar: Ventrikular atau aberran."
              color="border-blue-500"
              onClick={() =>
                setDetail({
                  title: "Analisis QRS",
                  content:
                    "Gunakan kriteria Brugada untuk bedakan VT vs SVT aberran.",
                })
              }
            />
            <AlgorithmNode
              title="4b. QRS Sempit Reguler"
              content="Manuver vagal → Adenosine 6-12mg → Beta/CCB jika AF."
              color="border-green-500"
              onClick={() =>
                setDetail({
                  title: "Manajemen Sempit",
                  content:
                    "Vagal: Valsalva efektif 50%. Adenosine diagnostik/terapi.",
                })
              }
            />
            <AlgorithmNode
              title="5b. QRS Lebar Reguler"
              content="Asumsikan VT. Amiodarone/Procainamide. Jika diketahui SVT, treat accordingly."
              color="border-purple-500"
              onClick={() =>
                setDetail({
                  title: "Manajemen Lebar",
                  content:
                    "80% takikardia lebar adalah VT pada pasien struktural heart disease.",
                })
              }
            />
          </div>
        </div>
      </div>
    ),
    bradycardia: (
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <AlgorithmNode
          title="1. Penilaian Awal"
          content="ABC, vital signs, EKG, identifikasi simtomatik (HR <50 dengan gejala)."
          color="border-gray-400"
          onClick={() =>
            setDetail({
              title: "Awal Bradikardia",
              content: "Gejala: Fatig, pusing, syncope, hipotensi.",
            })
          }
        />
        <div className="text-center font-bold">↓</div>
        <AlgorithmNode
          title="2. Simtomatik?"
          content="Ya: Intervensi. Tidak: Observasi."
          color="border-yellow-500"
          onClick={() =>
            setDetail({
              title: "Simtomatik",
              content: "Fokus pada perfusi organ akhir.",
            })
          }
        />
        <div className="text-center font-bold">↓ (Jika Simtomatik)</div>
        <AlgorithmNode
          title="3. Atropine 1mg IV"
          content="Ulang setiap 3-5 min, max 3mg."
          color="border-blue-500"
          onClick={() =>
            setDetail({
              title: "Atropine",
              content:
                "Efektif untuk sinus brady atau AV block derajat 1/2 Mobitz I.",
            })
          }
        />
        <div className="text-center font-bold">↓ (Jika Gagal)</div>
        <AlgorithmNode
          title="4. Pacing atau Vasopresor"
          content="TCP, Dopamine/Epinephrine infus."
          color="border-red-500"
          onClick={() =>
            setDetail({
              title: "Pacing",
              content: "TCP: Capture threshold <80mA. Sedasi jika sadar.",
            })
          }
        />
        <AlgorithmNode
          title="5. Cari Penyebab"
          content="MI, toksin, hiperkalemia, dll."
          color="border-green-500"
          onClick={() =>
            setDetail({
              title: "Reversible Causes",
              content: "Treat underlying: Beta-blocker OD → glucagon.",
            })
          }
        />
      </div>
    ),
    // Tambah algoritma lain
    arrest: (
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <AlgorithmNode
          title="1. Konfirmasi Arrest"
          content="Tidak responsif, tidak bernapas/agonal, tidak ada pulsa."
          color="border-gray-400"
          onClick={() =>
            setDetail({ title: "Konfirmasi", content: "Cek pulsa <10 detik." })
          }
        />
        <div className="text-center font-bold">↓</div>
        <AlgorithmNode
          title="2. Mulai CPR & Defib"
          content="CPR 30:2, AED/defib ASAP."
          color="border-red-500"
          onClick={() =>
            setDetail({ title: "CPR", content: "Minim interrupsi <10% waktu." })
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-center font-semibold">Shockable (VF/VT)</h4>
            <AlgorithmNode
              title="3a. Defibrilasi"
              content="200J biphasic, CPR 2 min, ulang."
              color="border-yellow-500"
              onClick={() =>
                setDetail({
                  title: "Shockable",
                  content:
                    "Epinephrine setiap 3-5 min, Amiodarone setelah 3 shock.",
                })
              }
            />
          </div>
          <div>
            <h4 className="text-center font-semibold">
              Non-Shockable (Asystole/PEA)
            </h4>
            <AlgorithmNode
              title="3b. CPR & Epinephrine"
              content="Epinephrine 1mg setiap 3-5 min."
              color="border-blue-500"
              onClick={() =>
                setDetail({
                  title: "Non-Shockable",
                  content: "Cari Hs/Ts, ultrasound jika tersedia.",
                })
              }
            />
          </div>
        </div>
        <AlgorithmNode
          title="4. Advanced Airway & IV/IO"
          content="Capnography untuk konfirmasi ET tube."
          color="border-green-500"
          onClick={() =>
            setDetail({
              title: "Advanced",
              content: "Target ETCO2 >10 mmHg selama CPR.",
            })
          }
        />
        <AlgorithmNode
          title="5. Post-ROSC Care"
          content="Optimasi hemodinamik, TTM 32-36°C jika comatose."
          color="border-purple-500"
          onClick={() =>
            setDetail({
              title: "Post-ROSC",
              content: "Cath lab jika STEMI, neuroprognostication.",
            })
          }
        />
      </div>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs
        defaultValue="tachycardia"
        onValueChange={(val) => setSelectedAlgo(val as keyof typeof algorithms)}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="tachycardia">Tachycardia</TabsTrigger>
          <TabsTrigger value="bradycardia">Bradycardia</TabsTrigger>
          <TabsTrigger value="arrest">Cardiac Arrest</TabsTrigger>
        </TabsList>
        <TabsContent value="tachycardia">{algorithms.tachycardia}</TabsContent>
        <TabsContent value="bradycardia">{algorithms.bradycardia}</TabsContent>
        <TabsContent value="arrest">{algorithms.arrest}</TabsContent>
      </Tabs>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4">
            Algoritma Interaktif: {selectedAlgo.toUpperCase()}
          </h3>
          {algorithms[selectedAlgo as keyof typeof algorithms]}
        </div>
        <AnimatePresence>
          {detail && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit /> Detail Langkah Algoritma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-bold mb-2">{detail.title}</h4>
                  <div className="text-sm space-y-2">{detail.content}</div>
                  <Badge variant="secondary" className="mt-2">
                    Referensi: AHA ACLS 2020
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const QuizTab: React.FC = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalQuestions = quizScenarios.reduce(
    (acc, scen) => acc + 1 + scen.steps.length,
    0
  );

  useEffect(() => {
    setProgress((score / 10 / totalQuestions) * 100);
  }, [score, totalQuestions]);

  const scenario = quizScenarios[currentScenarioIndex];
  const questionData =
    currentStep === 0 ? scenario.initial : scenario.steps[currentStep - 1];

  const handleAnswer = (optionIndex: number) => {
    if (!questionData) return;
    setSelectedAnswer(optionIndex);
    const correct = optionIndex === questionData.correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore((prev) => prev + 10);
  };

  const handleNext = () => {
    if (currentStep < scenario.steps.length) {
      setCurrentStep((s) => s + 1);
    } else if (currentScenarioIndex < quizScenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setCurrentStep(0);
    } else {
      setShowResult(true);
    }
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleReset = () => {
    setCurrentScenarioIndex(0);
    setCurrentStep(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
    setProgress(0);
  };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Hasil Simulasi ACLS Lengkap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Award className="h-16 w-16 text-yellow-500 mx-auto" />
            <p className="text-xl">
              Skor Akhir: {score} / {totalQuestions * 10}
            </p>
            <Progress value={progress} className="w-full" />
            <p className="text-lg">
              {progress >= 90
                ? "Master Level! Siap untuk sertifikasi AHA."
                : progress >= 70
                ? "Baik, tapi perkuat area lemah."
                : "Perlu latihan lebih. Fokus pada algoritma dasar."}
            </p>
            <Button onClick={handleReset}>
              <RotateCcw className="mr-2" /> Ulangi Simulasi
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!questionData)
    return (
      <div className="text-center">
        Skenario selesai. <Button onClick={handleNext}>Lanjut</Button>
      </div>
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            {scenario.title} (Langkah {currentStep + 1} /{" "}
            {scenario.steps.length + 1})
          </CardTitle>
          <CardDescription>{questionData.scenario}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-40 w-full bg-black rounded-lg flex items-center justify-center">
            <EKGCanvas
              rhythm={questionData.ekgRhythm}
              width={400}
              height={120}
            />
          </div>
          <p className="font-semibold">{questionData.question}</p>
          <div className="space-y-2">
            {questionData.options.map((option: string, index: number) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left h-auto py-2 whitespace-normal",
                        selectedAnswer !== null &&
                          index === questionData.correctAnswer &&
                          "bg-green-100 border-green-500",
                        selectedAnswer === index &&
                          !isCorrect &&
                          "bg-red-100 border-red-500"
                      )}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Hint: Pikirkan prioritas ACLS - stabil vs tidak, ritme
                      shockable?
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <AnimatePresence>
            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <Alert variant={isCorrect ? "default" : "destructive"}>
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {isCorrect
                      ? "Keputusan Klinis Tepat!"
                      : "Review Algoritma AHA"}
                  </AlertTitle>
                  <AlertDescription>{questionData.feedback}</AlertDescription>
                </Alert>
                <p className="text-sm mt-2">
                  <strong>Referensi:</strong> {questionData.references}
                </p>
                <Button className="w-full mt-4" onClick={handleNext}>
                  <ArrowRight className="mr-2" /> Langkah Selanjutnya
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      <Progress
        value={
          ((currentScenarioIndex * (scenario.steps.length + 1) +
            currentStep +
            1) /
            totalQuestions) *
          100
        }
        className="mt-4"
      />
    </motion.div>
  );
};

const DrugReferenceTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDrugs = aclsDrugs.filter(
    (drug) =>
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.use.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill /> Formularium Obat ACLS Lengkap
          </CardTitle>
          <CardDescription>
            Referensi detail obat darurat kardiovaskular sesuai AHA. Cari
            berdasarkan nama atau indikasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari obat atau indikasi..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredDrugs.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Tidak ditemukan. Coba kata kunci lain.
            </p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {filteredDrugs.map((drug) => (
                <AccordionItem key={drug.name} value={drug.name}>
                  <AccordionTrigger className="text-red-600 dark:text-red-500">
                    {drug.name} ({drug.class})
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm">
                    <p>
                      <strong>Mekanisme:</strong> {drug.mechanism}
                    </p>
                    <p>
                      <strong>Dosis:</strong> {drug.dosage}
                    </p>
                    <p>
                      <strong>Indikasi:</strong> {drug.use}
                    </p>
                    <p>
                      <strong>Catatan Klinis:</strong> {drug.pearls}
                    </p>
                    <p>
                      <strong>Kontraindikasi:</strong> {drug.contraindications}
                    </p>
                    <p>
                      <strong>Efek Samping:</strong> {drug.sideEffects}
                    </p>
                    <p>
                      <strong>Referensi:</strong> {drug.references}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Tambah Tab Baru: EKG Interpreter Simulator
const EKGInterpreterTab: React.FC = () => {
  const [selectedRhythm, setSelectedRhythm] = useState("sinus");
  const rhythms = {
    sinus: {
      description:
        "Normal Sinus Rhythm: HR 60-100, regular, P wave sebelum QRS.",
    },
    svt: {
      description:
        "Supraventricular Tachycardia: HR >150, QRS sempit, P wave mungkin tersembunyi.",
    },
    vf: {
      description:
        "Ventricular Fibrillation: Chaotic, no identifiable waves, shockable.",
    },
    bradycardia: {
      description: "Sinus Bradycardia: HR <60, regular, normal morphology.",
    },
    torsades: {
      description: "Torsades de Pointes: Polymorphic VT with twisting QRS.",
    },
    af: {
      description:
        "Atrial Fibrillation: Irregularly irregular rhythm with no P waves.",
    },
    wpw: {
      description: "Wolff-Parkinson-White: Short PR interval and delta wave.",
    },
    vt: {
      description: "Ventricular Tachycardia: Wide QRS, fast rhythm.",
    },
    brugada: {
      description: "Brugada Syndrome: Coved ST-segment elevation in V1-V2.",
    },
    aflutter: {
      description: "Atrial Flutter: Sawtooth pattern of P waves.",
    },
    junctional: {
      description: "Junctional Rhythm: No P wave, normal QRS.",
    },
    first_degree_av_block: {
      description: "1st Degree AV Block: Long PR interval.",
    },
    second_degree_av_block_1: {
      description:
        "2nd Degree AV Block (Mobitz I): Progressively longer PR interval, then a dropped beat.",
    },
    second_degree_av_block_2: {
      description:
        "2nd Degree AV Block (Mobitz II): Fixed PR interval, but some P waves are not followed by a QRS.",
    },
    third_degree_av_block: {
      description:
        "3rd Degree AV Block: P waves and QRS complexes are completely dissociated.",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart /> Simulator Interpretasi EKG
          </CardTitle>
          <CardDescription>
            Latih kemampuan interpretasi EKG dengan simulasi ritme real-time.
            Pilih ritme untuk melihat waveform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            defaultValue="sinus"
            onValueChange={(val) => setSelectedRhythm(val)}
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto overflow-x-auto">
              <TabsTrigger value="sinus">Sinus Normal</TabsTrigger>
              <TabsTrigger value="svt">SVT</TabsTrigger>
              <TabsTrigger value="vf">VF</TabsTrigger>
              <TabsTrigger value="bradycardia">Bradycardia</TabsTrigger>
              <TabsTrigger value="torsades">Torsades</TabsTrigger>
              <TabsTrigger value="af">A-Fib</TabsTrigger>
              <TabsTrigger value="wpw">WPW</TabsTrigger>
              <TabsTrigger value="vt">VT</TabsTrigger>
              <TabsTrigger value="brugada">Brugada</TabsTrigger>
              <TabsTrigger value="aflutter">A-Flutter</TabsTrigger>
              <TabsTrigger value="junctional">Junctional</TabsTrigger>
              <TabsTrigger value="first_degree_av_block">
                1st Deg Block
              </TabsTrigger>
              <TabsTrigger value="second_degree_av_block_1">
                Mobitz I
              </TabsTrigger>
              <TabsTrigger value="second_degree_av_block_2">
                Mobitz II
              </TabsTrigger>
              <TabsTrigger value="third_degree_av_block">
                3rd Deg Block
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="h-48 w-full border rounded-lg p-2 bg-black flex items-center justify-center">
            <EKGCanvas rhythm={selectedRhythm} width={500} height={150} />
          </div>
          <Alert>
            <Stethoscope className="h-4 w-4" />
            <AlertTitle>Interpretasi</AlertTitle>
            <AlertDescription>
              {rhythms[selectedRhythm as keyof typeof rhythms].description}
            </AlertDescription>
          </Alert>
          <p className="text-sm">
            <strong>Tips:</strong> Hitung rate: 300 / jumlah kotak besar antar
            R. Cek regularity, P waves, PR interval, QRS width, QT.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Tambah Tab Baru: Case Studies & Resources
const ResourcesTab: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText /> Studi Kasus & Sumber Daya Tambahan
        </CardTitle>
        <CardDescription>
          Kasus real-world dan link ke sumber resmi untuk pendalaman.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="case1">
            <AccordionTrigger>
              Case Study 1: SVT pada Atlet Muda
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Pasien: Pria 25 th, atlet, palpitasi mendadak saat latihan. EKG:
                SVT 180 bpm. Manuver vagal gagal, Adenosine sukses. Follow-up:
                Ablasi AVNRT.
              </p>
              <p>
                <strong>Lesson:</strong> SVT sering benign tapi butuh evaluasi
                elektrofisiologi jika rekuren.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="case2">
            <AccordionTrigger>
              Case Study 2: Bradycardia pada Lansia dengan Beta-Blocker
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Pasien: Wanita 80 th, riwayat HTN on metoprolol, syncope. EKG:
                Sinus brady 40 bpm. Atropine responsif, tapi TCP dibutuhkan.
                Penyebab: Overdose beta-blocker.
              </p>
              <p>
                <strong>Lesson:</strong> Antidot: Glucagon 3-5 mg IV untuk
                beta-blocker toxicity.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="case3">
            <AccordionTrigger>Case Study 3: VF Arrest Post-MI</AccordionTrigger>
            <AccordionContent>
              <p>
                Pasien: Laki 55 th, chest pain, kolaps. CPR, defib x3,
                Amiodarone, ROSC. Cath lab: LAD occlusion.
              </p>
              <p>
                <strong>Lesson:</strong> Early PCI meningkatkan survival pada
                post-arrest STEMI.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="case4">
            <AccordionTrigger>
              Case Study 4: Atrial Fibrillation (A-Fib)
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Pasien: Wanita 72 th, riwayat hipertensi, mengeluh pusing dan
                berdebar. EKG: Irregularly irregular rhythm, tidak ada gelombang
                P yang jelas, HR 130 bpm.
              </p>
              <p>
                <strong>Lesson:</strong> Prioritas pada A-Fib dengan RVR (Rapid
                Ventricular Response) yang stabil adalah rate control (misal,
                diltiazem atau metoprolol) dan antikoagulasi untuk pencegahan
                stroke.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="case5">
            <AccordionTrigger>
              Case Study 5: Wolff-Parkinson-White (WPW) Syndrome
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Pasien: Pria 28 th, datang untuk pemeriksaan rutin. EKG: PR
                interval pendek, gelombang delta. Asimtomatik.
              </p>
              <p>
                <strong>Lesson:</strong> Pasien WPW asimtomatik memerlukan
                stratifikasi risiko. Jika berisiko tinggi atau simtomatik,
                ablasi kateter pada jalur aksesori adalah terapi definitif.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="case6">
            <AccordionTrigger>Case Study 6: Brugada Syndrome</AccordionTrigger>
            <AccordionContent>
              <p>
                Pasien: Pria 45 th, keturunan Asia, pingsan saat tidur. EKG:
                Pola ST elevasi tipe 1 (coved) di V1-V2.
              </p>
              <p>
                <strong>Lesson:</strong> Brugada Syndrome adalah kondisi genetik
                yang meningkatkan risiko henti jantung mendadak. Terapi utama
                untuk pasien simtomatik adalah pemasangan ICD (Implantable
                Cardioverter-Defibrillator).
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="case7">
            <AccordionTrigger>
              Case Study 7: Atrial Flutter (A-Flutter)
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Pasien: Pria 65 th, dengan riwayat penyakit paru, mengeluh
                berdebar. EKG: Gelombang "sawtooth" di lead inferior, HR 150 bpm
                (blok 2:1).
              </p>
              <p>
                <strong>Lesson:</strong> A-Flutter seringkali memiliki blok
                konduksi (misal 2:1, 3:1). Manajemen melibatkan rate control,
                antikoagulasi, dan seringkali ablasi kateter yang memiliki
                tingkat keberhasilan tinggi.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="case8">
            <AccordionTrigger>
              Case Study 8: Complete Heart Block (3rd Degree AV Block)
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Pasien: Wanita 82 th, pingsan berulang kali. EKG: Disosiasi
                total antara gelombang P dan kompleks QRS. HR 35 bpm (escape
                rhythm).
              </p>
              <p>
                <strong>Lesson:</strong> Complete heart block adalah keadaan
                darurat medis yang memerlukan pacing segera (transkutan, lalu
                transvenous/permanen) karena risiko asistol.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="space-y-2">
          <h4 className="font-bold">Sumber Daya Eksternal:</h4>
          <ul className="list-disc pl-4">
            <li>
              <a
                href="https://cpr.heart.org/en/resuscitation-science/2020-aha-guidelines-for-cpr-and-ecc"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                AHA 2020 Guidelines (Official PDF)
              </a>
            </li>
            <li>
              <a
                href="https://www.ahajournals.org/doi/10.1161/CIR.0000000000000901"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Update ACLS 2025 Highlights
              </a>
            </li>
            <li>
              <a
                href="https://litfl.com/ecg-library/"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                LITFL ECG Library (Free EKG Cases)
              </a>
            </li>
            <li>
              <a
                href="https://www.acls.net/"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ACLS.net Practice Tests
              </a>
            </li>
            <li>
              <a
                href="https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000000678"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                2019 AHA/ACC/HRS Focused Update for Atrial Fibrillation
              </a>
            </li>
            <li>
              <a
                href="https://www.jacc.org/doi/full/10.1016/j.jacc.2015.08.002"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                2015 ACC/AHA/HRS Guideline for Supraventricular Tachycardia
              </a>
            </li>
          </ul>
        </div>
        <Button variant="outline" className="w-full">
          <Globe className="mr-2" /> Kunjungi AHA Certification Portal
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

// --- KOMPONEN UTAMA DIPERBARUI ---
const ACLSMasteryHub: React.FC = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="py-20 text-center">Memuat Pusat Penguasaan ACLS...</div>
    );
  }

  return (
    <section id="acls-guide" className="py-20 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <HeartPulse className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <motion.div
              className="absolute top-0 right-0 h-5 w-5 bg-yellow-400 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="h-full w-full p-1 text-white" />
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
            ACLS Arrhythmia Mastery Hub
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Platform edukatif komprehensif untuk menguasai ACLS: Algoritma,
            simulasi, referensi, dan simulator EKG interaktif sesuai standar
            medis AHA.
          </p>
        </div>

        <Tabs defaultValue="intro" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8 h-auto overflow-x-auto">
            <TabsTrigger value="intro" className="py-2">
              <BookOpen className="h-4 w-4 mr-2" /> Pengantar
            </TabsTrigger>
            <TabsTrigger value="algorithm" className="py-2">
              <Users className="h-4 w-4 mr-2" /> Algoritma
            </TabsTrigger>
            <TabsTrigger value="quiz" className="py-2">
              <HelpCircle className="h-4 w-4 mr-2" /> Simulasi Kasus
            </TabsTrigger>
            <TabsTrigger value="drugs" className="py-2">
              <Pill className="h-4 w-4 mr-2" /> Formularium
            </TabsTrigger>
            <TabsTrigger value="ekg" className="py-2">
              <BarChart className="h-4 w-4 mr-2" /> EKG Simulator
            </TabsTrigger>
            <TabsTrigger value="resources" className="py-2">
              <FileText className="h-4 w-4 mr-2" /> Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intro">
            <IntroTab />
          </TabsContent>
          <TabsContent value="algorithm">
            <InteractiveAlgorithmTab />
          </TabsContent>
          <TabsContent value="quiz">
            <QuizTab />
          </TabsContent>
          <TabsContent value="drugs">
            <DrugReferenceTab />
          </TabsContent>
          <TabsContent value="ekg">
            <EKGInterpreterTab />
          </TabsContent>
          <TabsContent value="resources">
            <ResourcesTab />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ACLSMasteryHub;
