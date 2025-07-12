import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Marquee } from "../magicui/marquee";
import { Star } from "lucide-react";

// 1. Definisikan interface untuk struktur data testimonial
interface Testimonial {
  name: string;
  age: string;
  condition: string;
  rating: number;
  text: string;
}

// Berikan tipe pada array testimonials agar sesuai dengan interface
const testimonials: Testimonial[] = [
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

// 2. Definisikan tipe untuk props dari komponen TestimonialCard
interface TestimonialCardProps {
  testimonial: Testimonial;
}

// Terapkan tipe pada props komponen
const TestimonialCard = ({ testimonial }: TestimonialCardProps) => (
  <Card className="w-[350px] md:w-[450px] bg-card text-card-foreground border-border transition-colors">
    <CardHeader>
      <div className="flex items-center space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-muted text-red-600 dark:bg-muted/40">
            {testimonial.name
              .split(" ")
              // 3. Beri tipe 'string' pada parameter 'n'
              .map((n: string) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">
            {testimonial.age} • {testimonial.condition}
          </p>
        </div>
      </div>
      <div className="flex space-x-1 pt-2">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    </CardHeader>
    <CardContent>
      <p className="italic text-muted-foreground">"{testimonial.text}"</p>
    </CardContent>
  </Card>
);

const TestimoniSection = () => {
  return (
    <section
      id="testimoni"
      className="py-20 bg-background text-foreground transition-colors"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Testimoni Pasien
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            Dengarkan pengalaman pasien yang telah merasakan manfaat layanan
            Kardiologiku
          </p>
        </div>
        <div className="relative">
          <Marquee pauseOnHover className="[--duration:20s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
      </div>
    </section>
  );
};

export default TestimoniSection;
