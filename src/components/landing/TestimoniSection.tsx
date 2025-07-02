import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const TestimoniSection = () => {
  const testimonials = [
    {
      name: "Budi Santoso",
      age: "55 tahun",
      condition: "Fibrilasi Atrium",
      rating: 5,
      text: "Berkat Kardiologiku, saya jadi lebih paham tentang kondisi jantung saya. Konsultasi online sangat membantu dan dokternya sangat profesional.",
    },
    {
      name: "Siti Nurhaliza",
      age: "42 tahun",
      condition: "Takikardia",
      rating: 5,
      text: "Fitur pengingat obat sangat membantu saya disiplin minum obat. Sekarang kondisi jantung saya jauh lebih stabil.",
    },
    {
      name: "Ahmad Rahman",
      age: "38 tahun",
      condition: "Bradikardia",
      rating: 5,
      text: "Platform edukasi yang sangat lengkap. Saya bisa belajar banyak tentang aritmia dan cara penanganannya dengan bahasa yang mudah dipahami.",
    },
  ];

  return (
    <section id="testimoni" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Testimoni Pasien
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dengarkan pengalaman pasien yang telah merasakan manfaat layanan
            Kardiologiku
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-red-100 text-red-600">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.age} • {testimonial.condition}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimoniSection;
