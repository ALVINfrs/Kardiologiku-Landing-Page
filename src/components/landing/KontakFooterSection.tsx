import { useState } from "react";
import type { FC, ReactElement, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Heart,
  Github,
  Linkedin,
  Twitter,
  Send,
  Instagram,
} from "lucide-react";

// --- Definisi Tipe untuk Props dan State ---
interface ContactInfoCardProps {
  icon: ReactElement;
  title: string;
  children: ReactElement;
  delay: number;
}

interface FormDataState {
  nama: string;
  telepon: string;
  email: string;
  jenisKeluhan: string;
  deskripsi: string;
}

// --- Sub-Komponen untuk Info Kontak ---
const ContactInfoCard: FC<ContactInfoCardProps> = ({
  icon,
  title,
  children,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <div className="text-gray-600 dark:text-gray-400">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// --- Sub-Komponen untuk Ikon Sosial Media ---
const SocialLinks: FC = () => {
  const socialMedia = [
    {
      href: "https://instagram.com/alvnfrs_/profilecard/?igsh=MTltYzM4cnlpdmQzbA",
      icon: <Instagram className="h-5 w-5 " />,
    },
    {
      href: "https://X.com/Alvnfrs_?s=08",
      icon: <Twitter className="h-5 w-5 " />, // Twitter (X)
    },
    {
      href: "https://www.linkedin.com/in/alvin-faris-89060a31b/",
      icon: <Linkedin className="h-5 w-5" />,
    },
    {
      href: "mailto:alvinfaris59@gmail.com",
      icon: <Mail className="h-5 w-5 " />,
    },
    {
      href: "https://github.com/ALVINfrs",
      icon: <Github className="h-5 w-5 " />,
    },
  ];

  return (
    <div className="flex space-x-4">
      {socialMedia.map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

// --- Komponen Utama ---
const KontakDanFooter: FC = () => {
  const [formData, setFormData] = useState<FormDataState>({
    nama: "",
    telepon: "",
    email: "",
    jenisKeluhan: "",
    deskripsi: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, jenisKeluhan: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Data Formulir:", formData);
    alert("Konsultasi Anda telah dikirim!");
    setFormData({
      nama: "",
      telepon: "",
      email: "",
      jenisKeluhan: "",
      deskripsi: "",
    });
  };

  const contactDetails = [
    {
      icon: <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />,
      title: "Telepon",
      content: (
        <>
          <p>+62 21 1234 5678</p>
          <p className="text-sm text-gray-500">
            Layanan 24 jam untuk emergency
          </p>
        </>
      ),
    },
    {
      icon: <Mail className="h-6 w-6 text-red-600 dark:text-red-400" />,
      title: "Email",
      content: (
        <>
          <p>info@kardiologiku.com</p>
          <p className="text-sm text-gray-500">Respon dalam 1-2 jam kerja</p>
        </>
      ),
    },
    {
      icon: <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />,
      title: "Jam Operasional",
      content: (
        <>
          <p>Senin - Jumat: 08:00 - 20:00</p>
          <p>Sabtu - Minggu: 09:00 - 17:00</p>
        </>
      ),
    },
  ];

  return (
    <>
      {/* ====== Bagian Kontak ====== */}
      <section
        id="kontak"
        className="py-20 md:py-28 bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-gray-900 dark:via-black dark:to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Hubungi Kami
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Kami siap membantu Anda 24/7. Baik untuk pertanyaan, jadwal temu,
              maupun konsultasi darurat seputar kesehatan jantung.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              {contactDetails.map((item, index) => (
                <ContactInfoCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  delay={index * 0.1}
                >
                  {item.content}
                </ContactInfoCard>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />{" "}
                      Lokasi Kami
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.417211116223!2d106.82434907475253!3d-6.208634193781284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1675753071306!5m2!1sid!2sid"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <Card className="shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">
                    Mulai Konsultasi Gratis
                  </CardTitle>
                  <CardDescription>
                    Isi formulir di bawah untuk memulai percakapan dengan tim
                    spesialis kami.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input
                          id="nama"
                          value={formData.nama}
                          onChange={handleInputChange}
                          placeholder="contoh: Budi Santoso"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telepon">Nomor Telepon</Label>
                        <Input
                          id="telepon"
                          type="tel"
                          value={formData.telepon}
                          onChange={handleInputChange}
                          placeholder="0812xxxxxxxx"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="anda@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jenisKeluhan">Jenis Keluhan</Label>
                      <Select
                        onValueChange={handleSelectChange}
                        value={formData.jenisKeluhan}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis keluhan utama Anda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jantung-berdebar">
                            Jantung berdebar-debar
                          </SelectItem>
                          <SelectItem value="nyeri-dada">Nyeri dada</SelectItem>
                          <SelectItem value="sesak-napas">
                            Sesak napas
                          </SelectItem>
                          <SelectItem value="pusing-pingsan">
                            Pusing / hampir pingsan
                          </SelectItem>
                          <SelectItem value="kelelahan">
                            Kelelahan berlebihan
                          </SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deskripsi">Deskripsi Keluhan</Label>
                      <Textarea
                        id="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleInputChange}
                        placeholder="Jelaskan keluhan Anda secara detail, kapan terjadinya, dan apa pemicunya..."
                        rows={5}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-red-600 hover:bg-red-700 text-lg py-3"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Kirim Konsultasi Sekarang
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== Bagian Footer ====== */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold">Kardiologiku</span>
              </div>
              <p className="text-gray-400 mb-4">
                Platform digital terpercaya untuk edukasi dan konsultasi
                kesehatan jantung di Indonesia.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 tracking-wider uppercase">
                Layanan
              </h3>
              <ul className="space-y-2 text-gray-400">
                {[
                  "Konsultasi Online",
                  "Edukasi Aritmia",
                  "Monitoring Jantung",
                  "Pengingat Obat",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 tracking-wider uppercase">
                Informasi
              </h3>
              <ul className="space-y-2 text-gray-400">
                {["Tentang Kami", "Tim Dokter", "Artikel Kesehatan", "FAQ"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 tracking-wider uppercase">
                Terhubung
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+62 21 1234 5678</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@kardiologiku.com</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>Jl. Jantung Sehat No. 123, Jakarta</span>
                </li>
              </ul>
              <div className="mt-6">
                <SocialLinks />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p className="mb-2">
              Dibuat dengan ❤️ oleh{" "}
              <a
                href="https://github.com/Alvinfrs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-300 hover:text-red-400 transition-colors"
              >
                Alvnfrs
              </a>
            </p>
            <p>© 2025 Kardiologiku. Semua hak cipta dilindungi.</p>
            <p className="mt-2">
              <a href="#" className="hover:text-white">
                Kebijakan Privasi
              </a>{" "}
              •{" "}
              <a href="#" className="hover:text-white ml-2">
                Syarat & Ketentuan
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default KontakDanFooter;
