// src/components/landing/ACLSMasteryHub.tsx

import React, { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

// --- DATA KOMPREHENSIF UNTUK KOMPONEN ---
const aclsDrugs = [
  {
    name: "Adenosine",
    class: "Antiaritmia Kelas V",
    mechanism:
      "Memperlambat konduksi melalui nodus AV, menginterupsi sirkuit re-entry.",
    dosage:
      "Dosis pertama: 6 mg IV bolus cepat (1-3 detik). Dosis kedua: 12 mg jika perlu.",
    use: "SVT QRS sempit reguler stabil.",
    pearls:
      "Efek samping transient (flushing, nyeri dada, bradikardia) adalah normal. Ikuti dengan flush saline 20 mL.",
  },
  {
    name: "Amiodarone",
    class: "Antiaritmia Kelas III",
    mechanism: "Memperpanjang fase 3 potensial aksi jantung (repolarisasi).",
    dosage:
      "Henti jantung (VT/VF): 300 mg IV/IO bolus, dapat diulang 150 mg. Takikardia stabil: 150 mg IV selama 10 menit.",
    use: "Berbagai jenis aritmia atrial dan ventrikel, baik stabil maupun tidak stabil.",
    pearls:
      "Dapat menyebabkan hipotensi dan bradikardia. Waktu paruh sangat panjang.",
  },
  {
    name: "Atropine Sulfate",
    class: "Antikolinergik",
    mechanism:
      "Meningkatkan laju sinus dengan memblokir efek vagal pada nodus SA.",
    dosage: "0.5 mg IV setiap 3-5 menit, dosis maksimal total 3 mg.",
    use: "Bradikardia simtomatik.",
    pearls:
      "Tidak efektif pada blok AV derajat II Tipe Mobitz II atau blok AV derajat III. Gunakan pacing sebagai gantinya.",
  },
  {
    name: "Dopamine",
    class: "Inotropik/Vasopresor",
    mechanism:
      "Stimulasi reseptor adrenergik, efek bervariasi tergantung dosis (dopaminergik, beta-1, alfa-1).",
    dosage: "Infus IV 5-20 mcg/kg/menit, titrasi sesuai respons tekanan darah.",
    use: "Bradikardia (setelah atropine gagal), hipotensi dengan tanda syok.",
    pearls:
      "Dapat menyebabkan takiaritmia. Perlu jalur IV sentral untuk dosis tinggi.",
  },
  {
    name: "Epinephrine",
    class: "Inotropik/Vasopresor",
    mechanism:
      "Stimulasi kuat reseptor alfa dan beta adrenergik, meningkatkan kontraktilitas dan laju jantung.",
    dosage:
      "Henti jantung: 1 mg IV/IO setiap 3-5 menit. Bradikardia/Hipotensi: Infus 2-10 mcg/menit.",
    use: "Henti jantung (semua jenis), bradikardia simtomatik berat, anafilaksis.",
    pearls: "Meningkatkan kerja jantung dan konsumsi oksigen miokard.",
  },
  {
    name: "Lidocaine",
    class: "Antiaritmia Kelas IB",
    mechanism: "Memblokir kanal natrium, menekan otomatisitas ventrikel.",
    dosage:
      "Henti jantung (VT/VF): 1-1.5 mg/kg IV/IO bolus. Takikardia stabil: 0.5-0.75 mg/kg hingga maks 3 mg/kg.",
    use: "Alternatif Amiodarone pada henti jantung akibat VT/VF.",
    pearls: "Perhatikan tanda toksisitas SSP (kebingungan, kejang).",
  },
  {
    name: "Magnesium Sulfate",
    class: "Elektrolit",
    mechanism:
      "Kofaktor penting dalam transpor elektrolit, menstabilkan membran sel.",
    dosage: "1-2 gram IV dilarutkan dalam 10 mL D5W selama 5-20 menit.",
    use: "Torsades de Pointes (TdP), hipomagnesemia.",
    pearls: "Pemberian terlalu cepat dapat menyebabkan hipotensi dan asistol.",
  },
  {
    name: "Procainamide",
    class: "Antiaritmia Kelas IA",
    mechanism: "Memblokir kanal natrium, memperlambat konduksi.",
    dosage:
      "Infus 20-50 mg/menit hingga aritmia teratasi atau dosis total 17 mg/kg tercapai.",
    use: "Berbagai takiaritmia stabil (AF, A-flutter, VT).",
    pearls: "Hentikan jika QRS melebar >50% atau terjadi hipotensi.",
  },
  {
    name: "Beta-Blockers (cth: Metoprolol)",
    class: "Antiaritmia Kelas II",
    mechanism:
      "Memblokir reseptor beta-1 adrenergik, menurunkan laju jantung dan kontraktilitas.",
    dosage: "Metoprolol: 5 mg IV lambat setiap 5 menit, maks 15 mg.",
    use: "Takikardia QRS sempit reguler/ireguler stabil, kontrol laju pada AF.",
    pearls: "Hindari pada gagal jantung dekompensata atau bradikardia berat.",
  },
  {
    name: "Calcium Channel Blockers (cth: Diltiazem)",
    class: "Antiaritmia Kelas IV",
    mechanism: "Memblokir kanal kalsium, memperlambat konduksi nodus AV.",
    dosage: "Diltiazem: 0.25 mg/kg IV selama 2 menit.",
    use: "Kontrol laju pada AF atau A-flutter stabil.",
    pearls: "Hindari pada pasien dengan sindrom Wolff-Parkinson-White (WPW).",
  },
];

const quizScenarios = [
  {
    id: "svt_stable",
    title: "Skenario 1: Takikardia QRS Sempit Stabil",
    initial: {
      scenario:
        "Wanita 30 tahun datang dengan keluhan berdebar-debar sejak 1 jam yang lalu. Sadar penuh, sedikit cemas. Tanda vital: TD 130/80 mmHg, HR 170/menit, RR 20/menit, SpO2 99%.",
      ekgImage: "/images/svt.png",
      question:
        "Anda melihat monitor EKG. Apa langkah PERTAMA yang paling sesuai?",
      options: [
        "Segera lakukan kardioversi",
        "Berikan Adenosine 6 mg IV",
        "Lakukan manuver vagal",
        "Berikan Amiodarone 150 mg IV",
      ],
      correctAnswer: 2,
      feedback:
        "Benar. Untuk takikardia QRS sempit reguler yang stabil, manuver vagal adalah intervensi non-invasif pertama yang direkomendasikan.",
    },
    steps: [
      {
        trigger: 2, // Jika jawaban sebelumnya benar
        scenario:
          "Anda meminta pasien melakukan manuver Valsalva (meniup ke dalam spuit 10cc). Irama tidak berubah. Pasien tetap stabil.",
        ekgImage: "/images/svt.png",
        question: "Apa langkah selanjutnya?",
        options: [
          "Ulangi manuver vagal",
          "Berikan Adenosine 6 mg IV cepat",
          "Berikan Diltiazem IV",
          "Konsultasi kardiolog",
        ],
        correctAnswer: 1,
        feedback:
          "Tepat. Setelah manuver vagal gagal, Adenosine adalah obat pilihan pertama karena onsetnya yang sangat cepat dan efektif.",
      },
      {
        trigger: 1, // Jika jawaban sebelumnya salah (memilih Adenosine duluan)
        scenario:
          "Anda memberikan Adenosine 6 mg IV. Irama jantung kembali ke sinus normal. Pasien merasa jauh lebih baik.",
        ekgImage: "/images/sinus.png", // Anda perlu gambar EKG sinus normal
        question:
          "Tindakan Anda berhasil, namun apa yang seharusnya menjadi langkah pertama sebelum memberikan obat?",
        options: [
          "Memberikan Oksigen",
          "Melakukan manuver vagal",
          "Memasang akses IV kedua",
          "Tidak ada, Adenosine sudah benar",
        ],
        correctAnswer: 1,
        feedback:
          "Manuver vagal seharusnya dicoba terlebih dahulu karena non-invasif dan seringkali berhasil, menghindari penggunaan obat.",
      },
    ],
  },
  {
    id: "brady_unstable",
    title: "Skenario 2: Bradikardia Simtomatik",
    initial: {
      scenario:
        "Pria 75 tahun ditemukan hampir pingsan. Kulit pucat dan dingin. Tanda vital: TD 70/40 mmHg, HR 35/menit, RR 16/menit, SpO2 92%.",
      ekgImage: "/images/bradycardia.png",
      question:
        "Pasien jelas tidak stabil. Apa intervensi farmakologis PERTAMA yang harus diberikan?",
      options: [
        "Epinephrine infus",
        "Dopamine infus",
        "Atropine 1 mg IV",
        "Tunggu dan observasi",
      ],
      correctAnswer: 2,
      feedback:
        "Benar sekali. Atropine adalah obat lini pertama untuk bradikardia simtomatik. Dosis awal yang direkomendasikan adalah 1 mg.",
    },
    steps: [
      {
        trigger: 2,
        scenario:
          "Anda memberikan Atropine 1 mg IV. Laju jantung naik sedikit menjadi 45/menit, TD 80/50 mmHg. Pasien masih pusing.",
        ekgImage: "/images/bradycardia.png",
        question:
          "Atropine tidak memberikan respons adekuat. Apa langkah selanjutnya yang paling penting?",
        options: [
          "Ulangi Atropine 1 mg",
          "Siapkan transcutaneous pacing (TCP)",
          "Berikan Amiodarone",
          "Berikan cairan IV bolus",
        ],
        correctAnswer: 1,
        feedback:
          "Tepat. Ketika Atropine gagal, intervensi non-farmakologis seperti pacing transkutan harus segera disiapkan sambil mempertimbangkan infus obat lini kedua (Dopamine/Epinephrine).",
      },
    ],
  },
];

// --- SUB-KOMPONEN UNTUK SETIAP TAB ---
const IntroTab: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen /> Pengantar ACLS Aritmia
        </CardTitle>
        <CardDescription>
          Memahami dasar-dasar penanganan darurat gangguan irama jantung.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          <strong>Advanced Cardiovascular Life Support (ACLS)</strong> adalah
          serangkaian protokol klinis untuk penanganan darurat kardiovaskular,
          termasuk aritmia yang mengancam nyawa. Tujuannya adalah untuk
          mengidentifikasi irama jantung secara cepat, menentukan stabilitas
          pasien, dan memberikan intervensi yang tepat untuk mencegah henti
          jantung.
        </p>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Penting!</AlertTitle>
          <AlertDescription>
            Materi ini bersifat edukatif dan tidak menggantikan pelatihan ACLS
            profesional yang tersertifikasi. Selalu bertindak sesuai dengan
            kompetensi dan protokol lokal Anda.
          </AlertDescription>
        </Alert>

        <div className="aspect-video w-full mt-6 rounded-lg overflow-hidden border">
          <ReactPlayer
            url="https://youtu.be/VOxU2a7kMrk"
            width="100%"
            height="100%"
            controls
            light
          />
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
  const [detail, setDetail] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold">
            Algoritma Tachycardia (HR &gt; 150/menit)
          </h3>
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <AlgorithmNode
              title="1. Identifikasi & Penilaian Awal"
              content="Jaga jalan napas, berikan oksigen jika perlu, pasang monitor jantung, TD, dan oksimetri."
              color="border-gray-400"
              onClick={() =>
                setDetail({
                  title: "Penilaian Awal",
                  content:
                    "Langkah pertama adalah memastikan ABC (Airway, Breathing, Circulation) aman. Penilaian cepat hemodinamik (stabil atau tidak stabil) akan menentukan jalur algoritma selanjutnya.",
                })
              }
            />
            <div className="text-center font-bold">↓</div>
            <AlgorithmNode
              title="2. Pasien Stabil atau Tidak Stabil?"
              content="Tanda tidak stabil: hipotensi, perubahan status mental, tanda syok, nyeri dada iskemik, gagal jantung akut."
              color="border-yellow-500"
              onClick={() =>
                setDetail({
                  title: "Penentuan Stabilitas",
                  content:
                    "Ini adalah titik keputusan paling krusial. Pasien tidak stabil memerlukan intervensi listrik segera (kardioversi), sementara pasien stabil dapat ditangani dengan manuver vagal atau obat-obatan terlebih dahulu.",
                })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-center font-semibold">TIDAK STABIL</h4>
                <AlgorithmNode
                  title="3a. Kardioversi Sinkronisasi"
                  content="Segera lakukan kardioversi. Pertimbangkan sedasi jika pasien sadar."
                  color="border-red-500"
                  onClick={() =>
                    setDetail({
                      title: "Kardioversi Sinkronisasi",
                      content: (
                        <div>
                          <p>
                            Prosedur mengirimkan syok listrik yang
                            tersinkronisasi dengan gelombang R pada EKG untuk
                            'mereset' irama jantung.
                          </p>
                          <strong className="mt-2 block">Dosis Energi:</strong>
                          <ul>
                            <li>SVT/A-flutter: 50-100 J</li>
                            <li>VT monomorfik: 100 J</li>
                          </ul>
                        </div>
                      ),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-center font-semibold">STABIL</h4>
                <AlgorithmNode
                  title="3b. QRS Sempit atau Lebar?"
                  content="Ukur interval QRS. &lt;0.12 detik = sempit, ≥0.12 detik = lebar."
                  color="border-blue-500"
                  onClick={() =>
                    setDetail({
                      title: "Analisis QRS",
                      content:
                        "Lebar QRS membantu membedakan asal takikardia (atrial/supraventrikular vs. ventrikular). Ini menentukan pilihan obat selanjutnya.",
                    })
                  }
                />
                <AlgorithmNode
                  title="4. Manuver Vagal & Adenosine"
                  content="Jika QRS sempit & reguler. Coba manuver vagal, jika gagal berikan Adenosine 6 mg."
                  color="border-green-500"
                  onClick={() =>
                    setDetail({
                      title: "Manuver Vagal & Adenosine",
                      content:
                        "Manuver vagal (seperti manuver Valsalva) meningkatkan tonus parasimpatis untuk memperlambat konduksi di nodus AV. Adenosine adalah obat kerja sangat singkat yang juga memblokir nodus AV, efektif untuk menghentikan SVT.",
                    })
                  }
                />
              </div>
            </div>
          </div>
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
                    <BrainCircuit /> Detail Langkah
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-bold mb-2">{detail.title}</h4>
                  <div className="text-sm space-y-2">{detail.content}</div>
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

  const scenario = quizScenarios[currentScenarioIndex];
  const questionData =
    currentStep === 0
      ? scenario.initial
      : scenario.steps.find((step) => step.trigger === selectedAnswer) ?? null;

  const handleAnswer = (optionIndex: number) => {
    if (!questionData) return;
    setSelectedAnswer(optionIndex);
    const correct = optionIndex === questionData.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 10); // Skor 10 untuk jawaban benar
    }
  };

  const handleNext = () => {
    if (!questionData) return;
    const nextStepExists = scenario.steps.some(
      (step) => step.trigger === selectedAnswer
    );

    if (nextStepExists) {
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
            <CardTitle>Hasil Simulasi ACLS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Award className="h-16 w-16 text-yellow-500 mx-auto" />
            <p className="text-xl">Skor Akhir Anda:</p>
            <p className="text-4xl font-bold">{score}</p>
            <p>
              {score >= quizScenarios.length * 10 - 10
                ? "Luar biasa! Keputusan klinis Anda sangat tajam."
                : "Bagus! Terus berlatih untuk menguasai semua skenario."}
            </p>
            <Button onClick={handleReset}>Ulangi Simulasi</Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!questionData) {
    // Fallback (seharusnya jarang terjadi)
    return (
      <div className="text-center">
        Skenario selesai. <Button onClick={handleNext}>Lanjut</Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            {scenario.title} (Langkah {currentStep + 1})
          </CardTitle>
          <CardDescription>{questionData.scenario}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="my-4 p-2 bg-black rounded-lg">
            <img
              src={questionData.ekgImage}
              alt="Gambaran EKG"
              className="w-full"
            />
          </div>
          <p className="font-semibold mb-4">{questionData.question}</p>
          <div className="space-y-2">
            {questionData.options.map((option: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left h-auto py-2 whitespace-normal",
                  selectedAnswer !== null &&
                    index === questionData.correctAnswer &&
                    "bg-green-100 border-green-500 text-green-800 hover:bg-green-200",
                  selectedAnswer === index &&
                    !isCorrect &&
                    "bg-red-100 border-red-500 text-red-800 hover:bg-red-200"
                )}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
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
                      ? "Keputusan Tepat!"
                      : "Tinjau Kembali Algoritma"}
                  </AlertTitle>
                  <AlertDescription>{questionData.feedback}</AlertDescription>
                </Alert>
                <Button className="w-full mt-4" onClick={handleNext}>
                  Langkah Selanjutnya
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DrugReferenceTab: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill /> Formularium Obat ACLS
        </CardTitle>
        <CardDescription>
          Referensi cepat untuk obat-obatan darurat kardiovaskular.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aclsDrugs.map((drug) => (
            <div
              key={drug.name}
              className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <h4 className="font-bold text-lg text-red-600 dark:text-red-500">
                {drug.name}{" "}
                <span className="text-sm font-normal text-gray-500">
                  ({drug.class})
                </span>
              </h4>
              <p className="text-sm mt-2">
                <strong className="font-semibold block">
                  Mekanisme Kerja:
                </strong>{" "}
                {drug.mechanism}
              </p>
              <p className="text-sm mt-2">
                <strong className="font-semibold block">Dosis Dewasa:</strong>{" "}
                {drug.dosage}
              </p>
              <p className="text-sm mt-2">
                <strong className="font-semibold block">Indikasi Utama:</strong>{" "}
                {drug.use}
              </p>
              <p className="text-sm mt-2">
                <strong className="font-semibold block text-yellow-600 dark:text-yellow-500">
                  Catatan Klinis:
                </strong>{" "}
                {drug.pearls}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// --- KOMPONEN UTAMA ---
const ACLSMasteryHub: React.FC = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="py-20 text-center">Memuat Pusat Pelatihan...</div>;
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
            Pusat pelatihan interaktif untuk menguasai penanganan darurat
            aritmia sesuai standar ACLS.
          </p>
        </div>

        <Tabs defaultValue="intro" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto">
            <TabsTrigger value="intro" className="py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              Pengantar
            </TabsTrigger>
            <TabsTrigger value="algorithm" className="py-2">
              <Users className="h-4 w-4 mr-2" />
              Algoritma Interaktif
            </TabsTrigger>
            <TabsTrigger value="quiz" className="py-2">
              <HelpCircle className="h-4 w-4 mr-2" />
              Simulasi Kasus
            </TabsTrigger>
            <TabsTrigger value="drugs" className="py-2">
              <Pill className="h-4 w-4 mr-2" />
              Formularium Obat
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
        </Tabs>
      </div>
    </section>
  );
};

export default ACLSMasteryHub;
