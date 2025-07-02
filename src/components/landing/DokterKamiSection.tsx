import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, BookOpen } from "lucide-react";

const DokterKamiSection = () => {
  const dokters = [
    {
      name: "Dr. Sarah Wijaya, Sp.JP",
      specialty: "Kardiologi Elektrofisiologi",
      experience: "15+ tahun pengalaman",
      education: "Universitas Indonesia",
      avatar: "/api/placeholder/150/150",
    },
    {
      name: "Dr. Ahmad Fauzi, Sp.JP(K)",
      specialty: "Kardiologi Intervensi",
      experience: "12+ tahun pengalaman",
      education: "Universitas Gadjah Mada",
      avatar: "/api/placeholder/150/150",
    },
    {
      name: "Dr. Maya Sari, Sp.JP",
      specialty: "Kardiologi Pediatrik",
      experience: "10+ tahun pengalaman",
      education: "Universitas Padjadjaran",
      avatar: "/api/placeholder/150/150",
    },
  ];

  return (
    <section id="dokter-kami" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tim Dokter Spesialis Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Konsultasi dengan dokter spesialis jantung berpengalaman dan
            terpercaya
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dokters.map((dokter, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={dokter.avatar} alt={dokter.name} />
                  <AvatarFallback className="bg-red-100 text-red-600 text-xl">
                    {dokter.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{dokter.name}</CardTitle>
                <CardDescription className="text-red-600 font-medium">
                  {dokter.specialty}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {dokter.experience}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {dokter.education}
                  </span>
                </div>
                <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                  Buat Janji Temu
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DokterKamiSection;
