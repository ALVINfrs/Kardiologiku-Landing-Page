import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Sun, Moon } from "lucide-react";

// Struktur baru untuk link navigasi agar lebih rapi (prinsip DRY)
const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang-aritmia", label: "Tentang Aritmia" },
  { href: "#care-hub", label: "Care Hub" }, // Link ke Aritmia Command Center
  { href: "#dokter-kami", label: "Dokter Kami" },
  { href: "#obat-terapi", label: "Terapi" },
  { href: "#fitur", label: "Fitur" },
  { href: "#testimoni", label: "Testimoni" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontak", label: "Kontak" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [activeLink, setActiveLink] = useState("#beranda");

  // Efek untuk dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Efek untuk 'Active Link Highlighting' saat scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" } // Sorot link saat seksi berada di tengah layar
    );

    navLinks.forEach((link) => {
      const section = document.querySelector(link.href);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
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
          <a href="#beranda" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Kardiologiku
            </span>
          </a>

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

        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t">
              {navLinks.map((link) => (
                <MobileNavLink key={link.href} {...link} />
              ))}
              <div className="px-3 py-2">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Konsultasi Sekarang
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
