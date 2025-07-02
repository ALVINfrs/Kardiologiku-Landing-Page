import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">
              Kardiologiku
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#beranda" className="text-gray-700 hover:text-red-600">
              Beranda
            </a>
            <a
              href="#tentang-aritmia"
              className="text-gray-700 hover:text-red-600"
            >
              Tentang Aritmia
            </a>
            <a href="#dokter-kami" className="text-gray-700 hover:text-red-600">
              Dokter Kami
            </a>
            <a href="#obat-terapi" className="text-gray-700 hover:text-red-600">
              Obat & Terapi
            </a>
            <a href="#fitur" className="text-gray-700 hover:text-red-600">
              Fitur
            </a>
            <a href="#kontak" className="text-gray-700 hover:text-red-600">
              Kontak
            </a>
            <Button className="bg-red-600 hover:bg-red-700">
              Konsultasi Sekarang
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a
                href="#beranda"
                className="block px-3 py-2 text-gray-700 hover:text-red-600"
              >
                Beranda
              </a>
              <a
                href="#tentang-aritmia"
                className="block px-3 py-2 text-gray-700 hover:text-red-600"
              >
                Tentang Aritmia
              </a>
              <a
                href="#dokter-kami"
                className="block px-3 py-2 text-gray-700 hover:text-red-600"
              >
                Dokter Kami
              </a>
              <a
                href="#obat-terapi"
                className="block px-3 py-2 text-gray-700 hover:text-red-600"
              >
                Obat & Terapi
              </a>
              <a
                href="#fitur"
                className="block px-3 py-2 text-gray-700 hover:text-red-600"
              >
                Fitur
              </a>
              <a
                href="#kontak"
                className="block px-3 py-2 text-gray-700 hover:text-red-600"
              >
                Kontak
              </a>
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
