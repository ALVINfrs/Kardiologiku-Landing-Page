import { useState } from "react";
import type { FC, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  HelpCircle,
  ShieldCheck,
  Zap,
  BrainCircuit,
  BarChart,
  UserCheck,
  Activity,
  Lightbulb,
} from "lucide-react";

// Tipe Data Lanjutan
interface MythFactItem {
  id: number;
  category:
    | "Gaya Hidup & Pemicu"
    | "Gejala & Diagnosis"
    | "Pengobatan & Risiko Serius";
  myth: string;
  theTruth: string;
  deepDive: string;
  dataSnapshot: { value: string; label: string; icon: ReactElement };
  expertsTake: string;
  actionableTip: string;
  colorScheme: "orange" | "blue" | "red";
}

// Data yang Lebih Kompleks dan Spesifik Aritmia
const arrhythmiaMyths: MythFactItem[] = [
  {
    id: 1,
    category: "Gaya Hidup & Pemicu",
    myth: "Jika saya berolahraga, aritmia saya pasti akan memburuk.",
    theTruth: "Olahraga yang tepat justru sangat dianjurkan.",
    deepDive:
      "Bagi kebanyakan pasien aritmia, olahraga ringan hingga sedang yang teratur justru memperkuat jantung dan dapat mengurangi frekuensi episode. Kuncinya adalah 'terukur'. Aktivitas seperti jalan cepat, berenang, atau yoga meningkatkan tonus vagal, yang membantu menstabilkan irama jantung. Yang perlu dihindari adalah olahraga kompetitif atau sangat intens tanpa konsultasi dokter, karena dapat memicu adrenalin berlebih.",
    dataSnapshot: {
      value: "30-45 Menit",
      label: "Aktivitas Sedang, 3-5x/minggu",
      icon: <Activity />,
    },
    expertsTake:
      "“Saya selalu mendorong pasien aritmia untuk tetap aktif. Jantung adalah otot, dan perlu dilatih dengan bijak. Kuncinya adalah mulai perlahan dan dengarkan tubuh Anda.” - Dr. Jantung Sehat",
    actionableTip:
      "Gunakan monitor detak jantung saat berolahraga dan tetaplah di 'zona aman' yang direkomendasikan oleh dokter Anda.",
    colorScheme: "orange",
  },
  {
    id: 2,
    category: "Gejala & Diagnosis",
    myth: "Saya tidak merasakan gejala apa pun, jadi saya pasti tidak punya aritmia berbahaya.",
    theTruth: "Aritmia paling berbahaya bisa jadi 'silent' (tanpa gejala).",
    deepDive:
      "Fibrilasi Atrium (AFib), salah satu penyebab utama stroke, bisa terjadi tanpa gejala apa pun (silent AFib). Pasien mungkin tidak merasakan debaran, namun risiko pembentukan gumpalan darah tetap ada. Inilah mengapa skrining rutin dengan EKG atau bahkan menggunakan fitur EKG pada smartwatch menjadi sangat penting bagi mereka yang memiliki faktor risiko seperti hipertensi atau usia lanjut.",
    dataSnapshot: {
      value: "Hingga 30%",
      label: "Kasus AFib tidak menunjukkan gejala awal",
      icon: <BarChart />,
    },
    expertsTake:
      "“Pasien yang paling mengejutkan adalah mereka yang datang karena stroke, dan baru saat itu kami menemukan mereka memiliki Fibrilasi Atrium yang tidak pernah mereka sadari.”",
    actionableTip:
      "Jika Anda berusia di atas 60 tahun atau memiliki hipertensi, tanyakan kepada dokter Anda tentang pentingnya skrining EKG rutin.",
    colorScheme: "blue",
  },
  {
    id: 3,
    category: "Pengobatan & Risiko Serius",
    myth: "Sekali dipasang alat pacu jantung, saya tidak bisa lagi hidup normal atau dekat dengan alat elektronik.",
    theTruth: "Alat pacu jantung modern sangat canggih dan aman.",
    deepDive:
      "Mitos ini berasal dari teknologi pacu jantung generasi lama. Perangkat modern memiliki pelindung canggih terhadap interferensi elektromagnetik. Anda bisa menggunakan ponsel (di sisi telinga yang berlawanan), microwave, dan melewati detektor keamanan bandara (dengan menunjukkan kartu identitas perangkat Anda). Aktivitas normal, termasuk olahraga non-kontak, sangat dianjurkan.",
    dataSnapshot: {
      value: "99%+ Aman",
      label: "Dari peralatan rumah tangga umum",
      icon: <ShieldCheck />,
    },
    expertsTake:
      "“Saya memberitahu pasien saya: alat pacu jantung ada untuk memberi Anda kebebasan, bukan membatasinya. Hiduplah sepenuhnya, dengan beberapa tindakan pencegahan yang wajar.”",
    actionableTip:
      "Selalu informasikan teknisi medis atau keamanan bahwa Anda menggunakan alat pacu jantung. Hindari meletakkan ponsel langsung di saku dada di atas perangkat.",
    colorScheme: "red",
  },
  {
    id: 4,
    category: "Gaya Hidup & Pemicu",
    myth: "Kopi adalah penyebab utama semua jenis aritmia.",
    theTruth:
      "Hubungannya kompleks; bagi sebagian orang, kopi justru protektif.",
    deepDive:
      "Studi skala besar menunjukkan bahwa konsumsi kopi dalam jumlah sedang (1-3 cangkir per hari) tidak meningkatkan risiko aritmia secara umum, bahkan mungkin sedikit menurunkan risiko Fibrilasi Atrium. Namun, sensitivitas individu sangat bervariasi. Bagi sebagian orang, kafein tetap menjadi pemicu kuat. Kuncinya adalah mengenali respons tubuh Anda sendiri.",
    dataSnapshot: {
      value: "Hingga 13%",
      label: "Penurunan risiko AFib pada peminum kopi reguler (studi)",
      icon: <BarChart />,
    },
    expertsTake:
      "“Saya tidak melarang semua pasien aritmia minum kopi. Saya menyarankan mereka untuk membuat 'jurnal pemicu' untuk melihat apakah ada korelasi antara asupan kafein dan episode debaran mereka.”",
    actionableTip:
      "Jika Anda curiga kopi adalah pemicu, coba hentikan selama 2 minggu dan catat gejalanya. Jika membaik, Anda mungkin sensitif terhadap kafein.",
    colorScheme: "orange",
  },
  {
    id: 5,
    category: "Gejala & Diagnosis",
    myth: "Pingsan saat berolahraga itu wajar karena kelelahan.",
    theTruth: "Pingsan saat berolahraga adalah tanda bahaya (red flag) mutlak.",
    deepDive:
      "Pingsan (sinkop) saat beraktivitas fisik bisa menjadi satu-satunya tanda peringatan dari kondisi aritmia berbahaya yang diinduksi oleh olahraga, seperti Takikardia Ventrikel Katekolaminergik (CPVT) atau Kardiomiopati Hipertrofik (HCM). Ini BUKAN hal yang normal dan memerlukan evaluasi kardiologi segera untuk menyingkirkan kondisi yang mengancam nyawa.",
    dataSnapshot: {
      value: "100%",
      label: "Kasus pingsan saat olahraga memerlukan evaluasi medis",
      icon: <UserCheck />,
    },
    expertsTake:
      "“Jika anak Anda atau Anda sendiri pernah pingsan saat berolahraga, jangan pernah menganggapnya remeh. Ini adalah salah satu gejala paling serius yang harus kami selidiki.”",
    actionableTip:
      "Jika Anda atau seseorang di sekitar Anda pingsan saat berolahraga, segera hentikan semua aktivitas dan cari pertolongan medis darurat.",
    colorScheme: "blue",
  },
  {
    id: 6,
    category: "Pengobatan & Risiko Serius",
    myth: "Prosedur ablasi kateter itu sangat berisiko dan seperti operasi jantung terbuka.",
    theTruth:
      "Ablasi adalah prosedur minimal invasif dengan tingkat keberhasilan tinggi.",
    deepDive:
      "Ablasi kateter dilakukan melalui pembuluh darah di pangkal paha, bukan dengan membuka dada. Kateter tipis dimasukkan ke jantung untuk memetakan dan menghancurkan (dengan energi radiofrekuensi atau pembekuan) area kecil jaringan yang menjadi sumber sirkuit listrik abnormal. Untuk aritmia seperti SVT atau Atrial Flutter, tingkat keberhasilannya bisa mencapai lebih dari 95%.",
    dataSnapshot: {
      value: ">95%",
      label: "Tingkat keberhasilan ablasi untuk SVT",
      icon: <Zap />,
    },
    expertsTake:
      "“Bagi pasien yang tepat, ablasi bisa menjadi 'obat' permanen untuk aritmia mereka, membebaskan mereka dari ketergantungan obat seumur hidup dan gejalanya.”",
    actionableTip:
      "Tanyakan kepada dokter Anda apakah Anda adalah kandidat yang baik untuk prosedur ablasi jika aritmia Anda terus mengganggu kualitas hidup.",
    colorScheme: "red",
  },
];

// Komponen Utama
const AritmiaMythBuster: FC = () => {
  const [selectedItem, setSelectedItem] = useState<MythFactItem | null>(null);

  const colorClasses = {
    orange: "border-orange-500",
    blue: "border-blue-500",
    red: "border-red-500",
  };

  return (
    <section
      id="myth-buster"
      className="py-24 sm:py-32 bg-gray-50 dark:bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <BrainCircuit className="h-12 w-12 mx-auto text-red-600 mb-4" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Arrhythmia Myth Buster
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Membongkar miskonsepsi paling umum tentang aritmia dengan penjelasan
            mendalam dari para ahli.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {arrhythmiaMyths.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedItem(item)}
              className={cn(
                "p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 cursor-pointer transition-all duration-300 border-2 border-transparent",
                `hover:${colorClasses[item.colorScheme]} hover:-translate-y-2`
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <Badge variant="destructive">MITOS</Badge>
                <HelpCircle className="h-8 w-8 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-white flex-grow">
                "{item.myth}"
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Klik untuk bongkar faktanya...
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <AnimatePresence>
          {selectedItem && (
            <DialogContent className="max-w-2xl p-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader className="p-6 pb-4">
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Mitos: "{selectedItem.myth}"
                  </DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* The Truth */}
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                      <div>
                        <h3 className="font-bold text-green-800 dark:text-green-300">
                          Faktanya...
                        </h3>
                        <p className="font-semibold text-lg text-gray-900 dark:text-white">
                          {selectedItem.theTruth}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deep Dive */}
                  <div>
                    <h4 className="font-semibold mb-2">Penjelasan Mendalam:</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {selectedItem.deepDive}
                    </p>
                  </div>

                  {/* Data Snapshot */}
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="text-blue-500">
                      {selectedItem.dataSnapshot.icon}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedItem.dataSnapshot.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedItem.dataSnapshot.label}
                      </p>
                    </div>
                  </div>

                  {/* Expert's Take */}
                  <div className="border-t border-dashed pt-4">
                    <h4 className="font-semibold mb-2">Kata Ahli:</h4>
                    <p className="text-sm italic text-gray-600 dark:text-gray-400">
                      "{selectedItem.expertsTake}"
                    </p>
                  </div>

                  {/* Actionable Tip */}
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                      <div>
                        <h3 className="font-bold text-blue-800 dark:text-blue-300">
                          Tips Praktis
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {selectedItem.actionableTip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t flex justify-end">
                  <Button onClick={() => setSelectedItem(null)}>Tutup</Button>
                </div>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </section>
  );
};

export default AritmiaMythBuster;
