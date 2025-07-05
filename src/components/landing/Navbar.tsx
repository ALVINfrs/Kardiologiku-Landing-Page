import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Impor gambar logo Anda dari folder assets
import logoKardiologiku from "@/assets/logo.png";

// --- Logo Kardiologiku (FIXED & UPGRADED with EKG Animation) ---
const AnimatedLogo = () => {
  const text = "Kardiologiku";

  // Tipe Variants untuk mengatasi error TypeScript
  const textContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const letterVariants: Variants = {
    hidden: { y: 20, opacity: 0, rotateX: -90, filter: "blur(5px)" },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { scale: 0, opacity: 0, rotate: -30 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { type: "spring", damping: 15, stiffness: 200 },
    },
    hover: { scale: 1.15, rotate: -8 },
  };

  return (
    <motion.a
      href="#beranda"
      className="flex items-center gap-3 cursor-pointer"
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.img
        src={logoKardiologiku}
        alt="Kardiologiku Logo"
        className="h-10 w-10"
        variants={imageVariants}
      />
      <div style={{ perspective: "500px" }}>
        <motion.div
          className="flex items-center overflow-hidden"
          variants={textContainerVariants}
        >
          {text.split("").map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-rose-500 to-pink-400"
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* === ANIMASI IRAMA EKG DIKEMBALIKAN DI SINI === */}
      <div className="w-12 h-8 overflow-hidden hidden sm:block">
        <svg width="100%" height="100%" viewBox="0 0 50 24">
          <motion.path
            d="M0 12h5l3-8 4 14 5-10 4 6h19"
            fill="none"
            stroke="currentColor"
            className="text-red-500"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 1, pathOffset: 1 }}
            animate={{ pathOffset: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 1.5,
            }}
          />
        </svg>
      </div>
    </motion.a>
  );
};

// 'navLinks' dipindahkan ke luar komponen
const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang-aritmia", label: "Tentang Aritmia" },
  { href: "#care-hub", label: "Care Hub" },
  { href: "#dokter-kami", label: "Dokter Kami" },
  { href: "#obat-terapi", label: "Terapi" },
  { href: "#fitur", label: "Fitur" },
  { href: "#testimoni", label: "Testimoni" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontak", label: "Kontak" },
];

// --- Komponen Utama Navbar (dengan perbaikan) ---
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [activeLink, setActiveLink] = useState("#beranda");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    navLinks.forEach((link) => {
      const section = document.querySelector(link.href);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      navLinks.forEach((link) => {
        const section = document.querySelector(link.href);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <a
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      className={`transition-all duration-300 ${
        activeLink === href
          ? "text-red-600 dark:text-red-500 font-bold"
          : "text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
      }`}
    >
      {label}
    </a>
  );

  const MobileNavLink = ({ href, label }: { href: string; label: string }) => (
    <a
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
        activeLink === href
          ? "bg-red-50 dark:bg-gray-700 text-red-600 dark:text-white"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
      }`}
    >
      {label}
    </a>
  );

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <AnimatedLogo />

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <Button className="bg-red-600 hover:bg-red-700">Konsultasi</Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="dark:text-white"
            >
              {theme === "light" ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2 dark:text-white"
            >
              {theme === "light" ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="dark:text-white"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                {navLinks.map((link) => (
                  <MobileNavLink key={link.href} {...link} />
                ))}
                <div className="px-3 py-2">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Konsultasi Sekarang
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
