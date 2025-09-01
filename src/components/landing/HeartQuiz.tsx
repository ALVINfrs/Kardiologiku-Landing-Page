import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  },
  {
    id: 2,
    question: "Manakah yang merupakan jenis aritmia?",
    options: ["Takikardia", "Bradikardia", "Fibrilasi atrium", "Semua benar"],
    correct: 3,
    explanation:
      "Takikardia (detak terlalu cepat), Bradikardia (detak terlalu lambat), dan Fibrilasi atrium semuanya adalah jenis aritmia.",
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
  },
];

const symptomsChecklist = [
  { id: 1, symptom: "Jantung berdebar kencang" },
  { id: 2, symptom: "Detak jantung tidak teratur" },
  { id: 3, symptom: "Pusing atau merasa ingin pingsan" },
  { id: 4, symptom: "Sesak napas" },
  { id: 5, symptom: "Nyeri atau tekanan di dada" },
  { id: 6, symptom: "Keringat dingin" },
  { id: 7, symptom: "Kelelahan yang berlebihan" },
  { id: 8, symptom: "Kesulitan bernafas saat beraktivitas" },
];

export default function HeartQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [checkedSymptoms, setCheckedSymptoms] = useState<number[]>([]);
  const [heartRate, setHeartRate] = useState<number>(70);
  const [showRiskLevel, setShowRiskLevel] = useState(false);
  const [isBeating, setIsBeating] = useState(true);

  // Simulasi detak jantung
  useEffect(() => {
    const interval = setInterval(() => {
      if (isBeating) {
        setHeartRate((prev) => prev + Math.floor(Math.random() * 3) - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isBeating]);

  const handleSymptomCheck = (symptomId: number) => {
    setCheckedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const calculateRisk = () => {
    const riskScore = (checkedSymptoms.length / symptomsChecklist.length) * 100;
    setShowRiskLevel(true);
    return riskScore;
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
    }
  };

  const toggleHeartbeat = () => {
    setIsBeating(!isBeating);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri - Visualisasi & Monitoring */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Monitor Detak Jantung</h2>

          <div className="text-center mb-6">
            <motion.div
              animate={{
                scale: isBeating ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-red-500 text-6xl mb-4 cursor-pointer"
              onClick={toggleHeartbeat}
            >
              ❤️
            </motion.div>
            <div className="text-3xl font-bold text-gray-700">
              {heartRate} BPM
              <div className="text-sm text-gray-500">
                {isBeating ? "Klik jantung untuk pause" : "Klik untuk mulai"}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Cek Gejala Aritmia</h3>
            <div className="space-y-2">
              {symptomsChecklist.map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checkedSymptoms.includes(item.id)}
                    onChange={() => handleSymptomCheck(item.id)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="ml-2">{item.symptom}</label>
                </div>
              ))}
            </div>

            <button
              onClick={calculateRisk}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Analisis Risiko
            </button>

            {showRiskLevel && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-yellow-50 rounded-lg"
              >
                <p className="font-semibold">
                  Tingkat Risiko:{" "}
                  {Math.round(
                    (checkedSymptoms.length / symptomsChecklist.length) * 100
                  )}
                  %
                </p>
                <p className="text-sm mt-2">
                  {checkedSymptoms.length > 3
                    ? "Anda disarankan untuk segera berkonsultasi dengan dokter."
                    : "Tetap pantau kondisi Anda dan konsultasikan dengan dokter jika gejala bertambah."}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Kolom Kanan - Kuis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Kuis Pengetahuan Aritmia
          </h2>

          <div className="mb-8">
            <h3 className="text-xl mb-4">
              {aritmiaQuestions[currentQuestion].question}
            </h3>

            <div className="space-y-3">
              {aritmiaQuestions[currentQuestion].options.map(
                (option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-3 text-left rounded-lg transition ${
                      selectedAnswer === null
                        ? "hover:bg-blue-50 border border-gray-200"
                        : selectedAnswer === index
                        ? index === aritmiaQuestions[currentQuestion].correct
                          ? "bg-green-100 border-green-500"
                          : "bg-red-100 border-red-500"
                        : index === aritmiaQuestions[currentQuestion].correct
                        ? "bg-green-100 border-green-500"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </motion.button>
                )
              )}
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-50 rounded-lg"
              >
                <p className="text-blue-800">
                  {aritmiaQuestions[currentQuestion].explanation}
                </p>
                {currentQuestion < aritmiaQuestions.length - 1 && (
                  <button
                    onClick={nextQuestion}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Pertanyaan Selanjutnya
                  </button>
                )}
              </motion.div>
            )}

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Skor: {score} dari {aritmiaQuestions.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
