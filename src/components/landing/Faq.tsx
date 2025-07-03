import { useState, useRef, useEffect, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Stethoscope,
  CalendarCheck,
  Info,
  Search,
  X,
  HeartPulse,
  ShieldCheck,
  Smartphone,
  BookHeart,
} from "lucide-react";

// ✅ Data tetap
const initialFaqData = [
  {
    category: "Umum",
    icon: HelpCircle,
    question: "Apa itu aritmia jantung?",
    answer:
      "Aritmia adalah gangguan pada irama jantung. Jantung bisa berdetak terlalu cepat, terlalu lambat, atau tidak teratur. Beberapa jenis tidak berbahaya, namun sebagian lainnya bisa menjadi pertanda kondisi medis serius.",
  },
  {
    category: "Umum",
    icon: Stethoscope,
    question: "Kapan saya harus menemui dokter spesialis jantung?",
    answer:
      "Anda disarankan menemui dokter spesialis jantung jika mengalami gejala seperti nyeri dada, sesak napas, pusing, pingsan, atau detak jantung yang terasa tidak normal (berdebar-debar). Pemeriksaan dini sangat penting.",
  },
  {
    category: "Umum",
    icon: BookHeart,
    question: "Apakah aritmia bisa disembuhkan?",
    answer:
      "Banyak jenis aritmia dapat dikelola dan diobati secara efektif. Metode pengobatan bervariasi, mulai dari obat-obatan, perubahan gaya hidup, hingga prosedur medis seperti ablasi. Tingkat kesembuhan tergantung pada jenis dan penyebab aritmia.",
  },
  {
    category: "Layanan",
    icon: Info,
    question: "Apa saja layanan yang tersedia di Kardiologiku?",
    answer:
      "Kami menyediakan layanan komprehensif mulai dari konsultasi online, diagnosis (EKG, Holter), perawatan non-invasif, hingga perencanaan terapi jangka panjang untuk berbagai jenis penyakit jantung, khususnya aritmia.",
  },
  {
    category: "Layanan",
    icon: CalendarCheck,
    question: "Bagaimana cara membuat janji temu untuk konsultasi?",
    answer:
      "Anda bisa membuat janji temu dengan mudah dengan menekan tombol 'Konsultasi Sekarang' di situs kami atau menghubungi nomor kontak yang tertera. Tim kami akan membantu Anda menjadwalkan pertemuan.",
  },
  {
    category: "Layanan",
    icon: ShieldCheck,
    question: "Apakah saya bisa menggunakan asuransi?",
    answer:
      "Ya, kami bekerja sama dengan berbagai penyedia asuransi kesehatan terkemuka. Silakan hubungi tim administrasi kami untuk verifikasi cakupan asuransi Anda sebelum melakukan konsultasi.",
  },
  {
    category: "Kondisi Spesifik",
    icon: HeartPulse,
    question: "Apa perbedaan Fibrilasi Atrium dan Takikardia?",
    answer:
      "Fibrilasi Atrium (AFib) adalah detak tidak teratur dan seringkali cepat di ruang atas jantung (atrium). Takikardia adalah istilah umum untuk detak jantung cepat (lebih dari 100 bpm) yang bisa berasal dari atrium atau ventrikel.",
  },
  {
    category: "Kondisi Spesifik",
    icon: BookHeart,
    question: "Bagaimana gaya hidup mempengaruhi aritmia?",
    answer:
      "Gaya hidup sangat berpengaruh. Faktor seperti stres, konsumsi kafein atau alkohol berlebih, kurang tidur, dan obesitas dapat memicu atau memperburuk aritmia. Mengelola faktor-faktor ini adalah bagian penting dari pengobatan.",
  },
  {
    category: "Teknis & Keamanan",
    icon: ShieldCheck,
    question: "Bagaimana keamanan data medis saya di platform ini?",
    answer:
      "Keamanan data Anda adalah prioritas utama kami. Kami menggunakan enkripsi end-to-end dan mematuhi standar keamanan data medis internasional untuk memastikan semua informasi riwayat kesehatan Anda aman dan rahasia.",
  },
  {
    category: "Teknis & Keamanan",
    icon: Smartphone,
    question: "Perangkat wearable apa saja yang didukung?",
    answer:
      "Platform kami mendukung integrasi dengan perangkat wearable populer yang dapat melacak detak jantung, seperti Apple Watch, Fitbit, dan Garmin. Ini memungkinkan pemantauan real-time yang lebih baik oleh dokter Anda.",
  },
];

// ✅ JSON-LD Schema FAQ
const FaqSchema = ({ data }: { data: typeof initialFaqData }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

const Faq = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialFaqData[0]?.category || null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const filteredFaqData = useMemo(() => {
    if (!searchTerm) return initialFaqData;
    const lowercased = searchTerm.toLowerCase();
    return initialFaqData.filter(
      (item) =>
        item.question.toLowerCase().includes(lowercased) ||
        item.answer.toLowerCase().includes(lowercased)
    );
  }, [searchTerm]);

  const groupedFaqs = useMemo(
    () =>
      filteredFaqData.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, typeof filteredFaqData>),
    [filteredFaqData]
  );

  const categories = useMemo(() => Object.keys(groupedFaqs), [groupedFaqs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    const refs = sectionRefs.current;
    Object.values(refs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(refs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [categories]);

  useEffect(() => {
    if (
      categories.length > 0 &&
      (!activeCategory || !categories.includes(activeCategory))
    ) {
      setActiveCategory(categories[0]);
    } else if (categories.length === 0) {
      setActiveCategory(null);
    }
  }, [categories, activeCategory]);

  const handleNavClick = (category: string) => {
    sectionRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="faq" className="py-20 sm:py-32 bg-white dark:bg-black">
      <FaqSchema data={initialFaqData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Pertanyaan yang Sering Diajukan (FAQ)
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400"
          >
            Temukan jawaban cepat untuk pertanyaan umum seputar layanan dan
            kondisi jantung.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {/* Sidebar Kategori */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 mb-8 lg:mb-0"
          >
            <div className="sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Kategori
              </h3>
              {categories.length > 0 ? (
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => handleNavClick(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                          activeCategory === category
                            ? "bg-red-500 text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  Tidak ada kategori yang cocok.
                </p>
              )}
            </div>
          </motion.div>

          {/* FAQ Konten */}
          <div className="lg:col-span-8">
            <motion.div variants={itemVariants} className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 h-12 text-base"
              />
              {searchTerm && (
                <X
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </motion.div>

            {categories.length > 0 ? (
              Object.entries(groupedFaqs).map(([category, faqs]) => (
                <motion.div
                  key={category}
                  variants={itemVariants}
                  className="mb-12 scroll-mt-24"
                >
                  <div
                    id={category}
                    ref={(el) => {
                      sectionRefs.current[category] = el;
                    }}
                  >
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 border-b pb-2 dark:border-gray-700">
                      {category}
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      {faqs.map((item, index) => (
                        <AccordionItem
                          key={`faq-item-${category}-${index}`}
                          value={`item-${category}-${index}`}
                          className="border-b dark:border-gray-700"
                        >
                          <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline text-gray-800 dark:text-gray-200 group">
                            <div className="flex items-center">
                              <item.icon className="h-6 w-6 mr-4 text-red-500 flex-shrink-0" />
                              <span>{item.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-base text-gray-600 dark:text-gray-400 pl-14">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div variants={itemVariants} className="text-center py-10">
                <p className="text-gray-600 dark:text-gray-400">
                  Tidak ada hasil yang ditemukan untuk "<b>{searchTerm}</b>".
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Coba gunakan kata kunci yang berbeda.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
