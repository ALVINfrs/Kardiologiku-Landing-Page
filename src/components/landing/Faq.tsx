import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "Apa itu aritmia jantung?",
    answer:
      "Aritmia adalah gangguan pada irama jantung. Jantung bisa berdetak terlalu cepat, terlalu lambat, atau tidak teratur. Meskipun beberapa aritmia tidak berbahaya, beberapa jenis bisa menjadi pertanda kondisi medis yang serius.",
  },
  {
    question: "Kapan saya harus menemui dokter spesialis jantung?",
    answer:
      "Anda disarankan untuk menemui dokter spesialis jantung jika mengalami gejala seperti nyeri dada, sesak napas, pusing, pingsan, atau detak jantung yang terasa tidak normal (berdebar-debar). Pemeriksaan dini sangat penting untuk mencegah komplikasi.",
  },
  {
    question: "Apa saja layanan yang tersedia di Kardiologiku?",
    answer:
      "Kami menyediakan layanan komprehensif mulai dari konsultasi, diagnosis (EKG, Holter), perawatan non-invasif, hingga perencanaan terapi jangka panjang untuk berbagai jenis penyakit jantung, khususnya aritmia.",
  },
  {
    question: "Bagaimana cara membuat janji temu untuk konsultasi?",
    answer:
      "Anda bisa membuat janji temu dengan mudah dengan menekan tombol 'Konsultasi Sekarang' di situs kami atau menghubungi nomor kontak yang tertera. Tim kami akan membantu Anda menjadwalkan pertemuan dengan dokter kami.",
  },
];

const Faq = () => {
  return (
    <section id="faq" className="py-20 sm:py-32 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Temukan jawaban cepat untuk pertanyaan umum seputar layanan dan
            kondisi jantung.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item, index) => (
            <AccordionItem
              value={`item-${index}`}
              key={index}
              className="border-b dark:border-gray-700"
            >
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline text-gray-800 dark:text-gray-200">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 dark:text-gray-400">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
