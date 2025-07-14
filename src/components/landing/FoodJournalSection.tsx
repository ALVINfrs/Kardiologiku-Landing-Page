import { useState, useEffect, useMemo, useCallback } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Apple,
  Beef,
  Carrot,
  Fish,
  Plus,
  Flame,
  Trash2,
  Lightbulb,
  BarChart,
  RotateCw,
  Download,
  Upload,
  Edit2,
  Copy,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- Types & Interfaces ---
type MealType = "Sarapan" | "Makan Siang" | "Makan Malam" | "Camilan";
type MealSchedule = { [key in MealType]?: string };
interface FoodItem {
  id: number;
  name: string;
  calories: number;
  sodium: number;
  fat: number;
  potassium: number;
  protein: number;
  carbs: number;
  category: "Buah" | "Sayur" | "Protein" | "Karbohidrat" | "Lainnya";
  isCustom: boolean;
}
interface LoggedFood {
  foodId: number;
  meal: MealType;
  timestamp: string;
  portion: number;
  notes?: string;
}
interface NutrientGoals {
  calories: number;
  sodium: number;
  fat: number;
  potassium: number;
  protein: number;
  carbs: number;
}
interface MealPlan {
  id: number;
  name: string;
  meals: { [key in MealType]?: { foodId: number; portion: number }[] };
  schedule: MealSchedule;
  createdAt: string;
  author?: string;
  notes?: string;
  totalNutrients: NutrientGoals;
}

const defaultFoodDatabase: FoodItem[] = [
  // =================================================================
  // Kategori: Buah-buahan (Fruits)
  // =================================================================
  {
    id: 1,
    name: "Apel Fuji (1 buah)",
    calories: 95,
    sodium: 1,
    fat: 0.3,
    potassium: 195,
    protein: 0.5,
    carbs: 25,
    category: "Buah",
    isCustom: false,
  },
  {
    id: 13,
    name: "Pisang Ambon (1 buah)",
    calories: 105,
    sodium: 1,
    fat: 0.4,
    potassium: 422,
    protein: 1.3,
    carbs: 27,
    category: "Buah",
    isCustom: false,
  },
  {
    id: 14,
    name: "Mangga Harum Manis (1 buah)",
    calories: 202,
    sodium: 2,
    fat: 0.8,
    potassium: 277,
    protein: 1.4,
    carbs: 50,
    category: "Buah",
    isCustom: false,
  },
  {
    id: 15,
    name: "Alpukat Mentega (1 buah)",
    calories: 234,
    sodium: 10,
    fat: 22,
    potassium: 708,
    protein: 3,
    carbs: 12,
    category: "Buah",
    isCustom: false,
  },
  {
    id: 16,
    name: "Semangka Merah (1 potong besar)",
    calories: 86,
    sodium: 2,
    fat: 0.4,
    potassium: 320,
    protein: 1.7,
    carbs: 21,
    category: "Buah",
    isCustom: false,
  },
  {
    id: 41,
    name: "Nanas Madu (1 potong)",
    calories: 50,
    sodium: 1,
    fat: 0.1,
    potassium: 109,
    protein: 0.5,
    carbs: 13,
    category: "Buah",
    isCustom: false,
  },
  {
    id: 42,
    name: "Rambutan (5 buah)",
    calories: 60,
    sodium: 7,
    fat: 0.1,
    potassium: 80,
    protein: 0.7,
    carbs: 16,
    category: "Buah",
    isCustom: false,
  },
  {
    id: 43,
    name: "Salak Pondoh (3 buah)",
    calories: 77,
    sodium: 4,
    fat: 0.2,
    potassium: 200,
    protein: 0.8,
    carbs: 20,
    category: "Buah",
    isCustom: false,
  },
  {
    id: 44,
    name: "Jambu Biji Merah (1 buah)",
    calories: 112,
    sodium: 7,
    fat: 1.6,
    potassium: 688,
    protein: 4.2,
    carbs: 23,
    category: "Buah",
    isCustom: false,
  },
  {
    id: 45,
    name: "Jeruk Sunkist (1 buah)",
    calories: 62,
    sodium: 0,
    fat: 0.3,
    potassium: 237,
    protein: 1.2,
    carbs: 15,
    category: "Buah",
    isCustom: false,
  },

  // =================================================================
  // Kategori: Sayur-mayur (Vegetables)
  // =================================================================
  {
    id: 3,
    name: "Brokoli Rebus (1 cup)",
    calories: 55,
    sodium: 30,
    fat: 0.6,
    potassium: 457,
    protein: 3.7,
    carbs: 11,
    category: "Sayur",
    isCustom: false,
  },
  {
    id: 17,
    name: "Bayam Rebus (1 cup, dimasak)",
    calories: 41,
    sodium: 126,
    fat: 0.5,
    potassium: 839,
    protein: 5.3,
    carbs: 6.7,
    category: "Sayur",
    isCustom: false,
  },
  {
    id: 18,
    name: "Kangkung Tumis Bawang (1 porsi)",
    calories: 98,
    sodium: 350,
    fat: 8,
    potassium: 310,
    protein: 3,
    carbs: 5,
    category: "Sayur",
    isCustom: false,
  },
  {
    id: 19,
    name: "Wortel (1 buah besar)",
    calories: 31,
    sodium: 50,
    fat: 0.2,
    potassium: 230,
    protein: 0.7,
    carbs: 7,
    category: "Sayur",
    isCustom: false,
  },
  {
    id: 20,
    name: "Timun (1 buah)",
    calories: 45,
    sodium: 6,
    fat: 0.3,
    potassium: 442,
    protein: 2,
    carbs: 11,
    category: "Sayur",
    isCustom: false,
  },
  {
    id: 46,
    name: "Lalapan Segar (kol, timun, selada)",
    calories: 50,
    sodium: 15,
    fat: 0.5,
    potassium: 300,
    protein: 2,
    carbs: 10,
    category: "Sayur",
    isCustom: false,
  },
  {
    id: 47,
    name: "Sayur Asem (1 mangkok)",
    calories: 80,
    sodium: 700,
    fat: 1.5,
    potassium: 400,
    protein: 3,
    carbs: 15,
    category: "Sayur",
    isCustom: false,
  },
  {
    id: 48,
    name: "Capcay Goreng (1 porsi)",
    calories: 215,
    sodium: 850,
    fat: 12,
    potassium: 450,
    protein: 10,
    carbs: 18,
    category: "Sayur",
    isCustom: false,
  },
  {
    id: 49,
    name: "Terong Balado (1 porsi)",
    calories: 150,
    sodium: 450,
    fat: 12,
    potassium: 250,
    protein: 2,
    carbs: 10,
    category: "Sayur",
    isCustom: false,
  },
  {
    id: 50,
    name: "Tumis Tauge Ikan Asin (1 porsi)",
    calories: 135,
    sodium: 750,
    fat: 9,
    potassium: 200,
    protein: 8,
    carbs: 6,
    category: "Sayur",
    isCustom: false,
  },

  // =================================================================
  // Kategori: Protein (Lauk Pauk)
  // =================================================================
  {
    id: 2,
    name: "Dada Ayam Panggang (100g)",
    calories: 165,
    sodium: 74,
    fat: 3.6,
    potassium: 256,
    protein: 31,
    carbs: 0,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 21,
    name: "Telur Rebus (1 butir)",
    calories: 78,
    sodium: 62,
    fat: 5.3,
    potassium: 63,
    protein: 6.3,
    carbs: 0.6,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 22,
    name: "Tempe Goreng (1 potong)",
    calories: 110,
    sodium: 90,
    fat: 7,
    potassium: 140,
    protein: 9,
    carbs: 5,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 23,
    name: "Tahu Goreng (1 potong)",
    calories: 80,
    sodium: 120,
    fat: 5,
    potassium: 90,
    protein: 7,
    carbs: 2,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 24,
    name: "Ikan Salmon Panggang (100g)",
    calories: 208,
    sodium: 59,
    fat: 13,
    potassium: 429,
    protein: 20,
    carbs: 0,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 25,
    name: "Daging Sapi Rendang (1 potong)",
    calories: 230,
    sodium: 550,
    fat: 15,
    potassium: 360,
    protein: 22,
    carbs: 6,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 26,
    name: "Udang Rebus (100g)",
    calories: 99,
    sodium: 200,
    fat: 0.3,
    potassium: 259,
    protein: 24,
    carbs: 0.2,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 51,
    name: "Ikan Lele Goreng (1 ekor)",
    calories: 250,
    sodium: 300,
    fat: 18,
    potassium: 320,
    protein: 20,
    carbs: 1,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 52,
    name: "Ayam Goreng Paha Bawah (1 potong)",
    calories: 280,
    sodium: 650,
    fat: 20,
    potassium: 220,
    protein: 24,
    carbs: 2,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 53,
    name: "Ati Ampela Ayam Goreng (1 pasang)",
    calories: 200,
    sodium: 250,
    fat: 14,
    potassium: 180,
    protein: 18,
    carbs: 1.5,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 54,
    name: "Ikan Kembung Bakar (1 ekor)",
    calories: 180,
    sodium: 350,
    fat: 8,
    potassium: 400,
    protein: 25,
    carbs: 0,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 55,
    name: "Nugget Ayam Goreng (5 buah)",
    calories: 290,
    sodium: 800,
    fat: 18,
    potassium: 150,
    protein: 15,
    carbs: 16,
    category: "Protein",
    isCustom: false,
  },
  {
    id: 56,
    name: "Telur Dadar (2 telur)",
    calories: 190,
    sodium: 350,
    fat: 15,
    potassium: 140,
    protein: 13,
    carbs: 2,
    category: "Protein",
    isCustom: false,
  },

  // =================================================================
  // Kategori: Karbohidrat (Makanan Pokok)
  // =================================================================
  {
    id: 27,
    name: "Nasi Putih (1 centong)",
    calories: 130,
    sodium: 1,
    fat: 0.3,
    potassium: 35,
    protein: 2.7,
    carbs: 28,
    category: "Karbohidrat",
    isCustom: false,
  },
  {
    id: 28,
    name: "Nasi Merah (1 centong)",
    calories: 110,
    sodium: 5,
    fat: 0.9,
    potassium: 80,
    protein: 2.5,
    carbs: 23,
    category: "Karbohidrat",
    isCustom: false,
  },
  {
    id: 29,
    name: "Mie Instan Goreng (1 bungkus)",
    calories: 380,
    sodium: 1870,
    fat: 17,
    potassium: 180,
    protein: 8,
    carbs: 52,
    category: "Karbohidrat",
    isCustom: false,
  },
  {
    id: 30,
    name: "Roti Tawar Gandum (2 lembar)",
    calories: 160,
    sodium: 220,
    fat: 2,
    potassium: 140,
    protein: 8,
    carbs: 30,
    category: "Karbohidrat",
    isCustom: false,
  },
  {
    id: 31,
    name: "Kentang Rebus (1 buah sedang)",
    calories: 161,
    sodium: 8,
    fat: 0.2,
    potassium: 897,
    protein: 4.3,
    carbs: 37,
    category: "Karbohidrat",
    isCustom: false,
  },
  {
    id: 32,
    name: "Singkong Rebus (100g)",
    calories: 160,
    sodium: 14,
    fat: 0.3,
    potassium: 271,
    protein: 1.4,
    carbs: 38,
    category: "Karbohidrat",
    isCustom: false,
  },
  {
    id: 57,
    name: "Lontong (3 potong)",
    calories: 130,
    sodium: 20,
    fat: 0.2,
    potassium: 40,
    protein: 2.5,
    carbs: 29,
    category: "Karbohidrat",
    isCustom: false,
  },
  {
    id: 58,
    name: "Bihun Goreng (1 piring)",
    calories: 350,
    sodium: 900,
    fat: 10,
    potassium: 150,
    protein: 8,
    carbs: 55,
    category: "Karbohidrat",
    isCustom: false,
  },
  {
    id: 59,
    name: "Donat Kentang Gula (1 buah)",
    calories: 250,
    sodium: 150,
    fat: 14,
    potassium: 90,
    protein: 4,
    carbs: 28,
    category: "Karbohidrat",
    isCustom: false,
  },
  {
    id: 60,
    name: "Roti Bakar Coklat Keju (1 porsi)",
    calories: 450,
    sodium: 400,
    fat: 20,
    potassium: 200,
    protein: 12,
    carbs: 58,
    category: "Karbohidrat",
    isCustom: false,
  },
  {
    id: 61,
    name: "Bubur Ayam (1 mangkok, tanpa jeroan)",
    calories: 370,
    sodium: 1100,
    fat: 10,
    potassium: 250,
    protein: 15,
    carbs: 55,
    category: "Karbohidrat",
    isCustom: false,
  },

  // =================================================================
  // Kategori: Lainnya (Minuman, Jajanan, Makanan Jadi, Bumbu)
  // =================================================================
  {
    id: 12,
    name: "Kopi Hitam (1 cangkir, tanpa gula)",
    calories: 5,
    sodium: 2,
    fat: 0,
    potassium: 116,
    protein: 0.3,
    carbs: 0,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 33,
    name: "Teh Manis (1 gelas)",
    calories: 80,
    sodium: 5,
    fat: 0,
    potassium: 20,
    protein: 0,
    carbs: 20,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 34,
    name: "Nasi Goreng Spesial (1 piring)",
    calories: 630,
    sodium: 1250,
    fat: 22,
    potassium: 450,
    protein: 20,
    carbs: 85,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 35,
    name: "Soto Ayam Lamongan (1 mangkok)",
    calories: 312,
    sodium: 1400,
    fat: 10,
    potassium: 500,
    protein: 18,
    carbs: 35,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 36,
    name: "Pisang Goreng (1 buah)",
    calories: 140,
    sodium: 80,
    fat: 7,
    potassium: 210,
    protein: 1,
    carbs: 19,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 37,
    name: "Kerupuk Udang (3 buah)",
    calories: 100,
    sodium: 450,
    fat: 6,
    potassium: 30,
    protein: 1,
    carbs: 10,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 38,
    name: "Santan Kental (100ml)",
    calories: 230,
    sodium: 15,
    fat: 24,
    potassium: 263,
    protein: 2.3,
    carbs: 6,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 39,
    name: "Sambal Terasi (1 sdm)",
    calories: 35,
    sodium: 600,
    fat: 2,
    potassium: 80,
    protein: 1,
    carbs: 3,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 40,
    name: "Minyak Goreng (1 sdm)",
    calories: 120,
    sodium: 0,
    fat: 14,
    potassium: 0,
    protein: 0,
    carbs: 0,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 62,
    name: "Gado-Gado (1 porsi, lontong)",
    calories: 550,
    sodium: 800,
    fat: 30,
    potassium: 700,
    protein: 20,
    carbs: 55,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 63,
    name: "Sate Ayam (10 tusuk) + Bumbu Kacang",
    calories: 450,
    sodium: 700,
    fat: 25,
    potassium: 500,
    protein: 35,
    carbs: 20,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 64,
    name: "Bakso Sapi Kuah (1 mangkok)",
    calories: 380,
    sodium: 1900,
    fat: 18,
    potassium: 450,
    protein: 22,
    carbs: 30,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 65,
    name: "Martabak Manis Keju Coklat (1 potong)",
    calories: 350,
    sodium: 250,
    fat: 18,
    potassium: 150,
    protein: 8,
    carbs: 45,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 66,
    name: "Martabak Telur (1 potong)",
    calories: 280,
    sodium: 400,
    fat: 20,
    potassium: 180,
    protein: 12,
    carbs: 15,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 67,
    name: "Risoles Ragout (1 buah)",
    calories: 180,
    sodium: 300,
    fat: 10,
    potassium: 90,
    protein: 5,
    carbs: 18,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 68,
    name: "Kopi Susu Gula Aren (1 gelas)",
    calories: 180,
    sodium: 80,
    fat: 6,
    potassium: 200,
    protein: 3,
    carbs: 28,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 69,
    name: "Es Cendol (1 gelas)",
    calories: 350,
    sodium: 150,
    fat: 15,
    potassium: 300,
    protein: 4,
    carbs: 50,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 70,
    name: "Opor Ayam (1 porsi)",
    calories: 450,
    sodium: 1100,
    fat: 35,
    potassium: 500,
    protein: 30,
    carbs: 8,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 71,
    name: "Rawon Daging (1 mangkok)",
    calories: 480,
    sodium: 1600,
    fat: 30,
    potassium: 600,
    protein: 28,
    carbs: 12,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 72,
    name: "Tahu Isi Goreng (1 buah)",
    calories: 130,
    sodium: 280,
    fat: 9,
    potassium: 100,
    protein: 6,
    carbs: 8,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 73,
    name: "Bakwan Sayur (1 buah)",
    calories: 140,
    sodium: 350,
    fat: 10,
    potassium: 120,
    protein: 3,
    carbs: 12,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 74,
    name: "Kecap Manis (1 sdm)",
    calories: 60,
    sodium: 450,
    fat: 0,
    potassium: 50,
    protein: 1,
    carbs: 15,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 75,
    name: "Bawang Goreng (1 sdm)",
    calories: 40,
    sodium: 5,
    fat: 3,
    potassium: 20,
    protein: 0.5,
    carbs: 3,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 76,
    name: "Minuman Soda (1 kaleng)",
    calories: 150,
    sodium: 45,
    fat: 0,
    potassium: 10,
    protein: 0,
    carbs: 39,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 77,
    name: "Jus Alpukat (1 gelas, dgn susu coklat)",
    calories: 350,
    sodium: 120,
    fat: 25,
    potassium: 800,
    protein: 5,
    carbs: 40,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 78,
    name: "Sayur Lodeh (1 mangkok)",
    calories: 280,
    sodium: 950,
    fat: 22,
    potassium: 550,
    protein: 8,
    carbs: 15,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 79,
    name: "Pempek Kapal Selam (1 buah)",
    calories: 380,
    sodium: 1300,
    fat: 15,
    potassium: 300,
    protein: 18,
    carbs: 40,
    category: "Lainnya",
    isCustom: false,
  },
  {
    id: 80,
    name: "Siomay Ikan Komplit (1 porsi)",
    calories: 500,
    sodium: 1500,
    fat: 25,
    potassium: 600,
    protein: 25,
    carbs: 45,
    category: "Lainnya",
    isCustom: false,
  },
];
const defaultSchedule: MealSchedule = {
  Sarapan: "07:00",
  "Makan Siang": "12:00",
  "Makan Malam": "18:00",
  Camilan: "15:00",
};

const FoodIcon: FC<{ category: FoodItem["category"]; className?: string }> = ({
  category,
  className,
}) => {
  const icons = {
    Buah: Apple,
    Protein: Beef,
    Sayur: Carrot,
    Karbohidrat: Flame,
    Lainnya: Fish,
  };
  const Icon = icons[category];
  return <Icon className={className} />;
};

const NutrientChart: FC<{ consumed: NutrientGoals; goals: NutrientGoals }> = ({
  consumed,
  goals,
}) => {
  const data = [
    {
      name: "Kalori",
      value: consumed.calories,
      goal: goals.calories,
      fill: "#8884d8",
    },
    {
      name: "Sodium",
      value: consumed.sodium,
      goal: goals.sodium,
      fill: "#ffc658",
    },
    { name: "Lemak", value: consumed.fat, goal: goals.fat, fill: "#ff8042" },
    {
      name: "Potasium",
      value: consumed.potassium,
      goal: goals.potassium,
      fill: "#82ca9d",
    },
    {
      name: "Protein",
      value: consumed.protein,
      goal: goals.protein,
      fill: "#00C49F",
    },
    {
      name: "Karbo",
      value: consumed.carbs,
      goal: goals.carbs,
      fill: "#FFBB28",
    },
  ];
  const pieData = data.map((item) => ({
    name: item.name,
    value: (item.value / item.goal) * 100,
  }));

  return (
    <div className="space-y-8">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(120, 120, 120, 0.1)" }}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          />
          <Bar
            dataKey="value"
            name="Terkonsumsi"
            radius={[4, 4, 4, 4]}
            barSize={15}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value > entry.goal ? "#ef4444" : entry.fill}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={data[index].fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data.map((d) => ({ name: d.name, value: d.value }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const FoodJournalSection: FC = () => {
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [foodDatabase, setFoodDatabase] =
    useState<FoodItem[]>(defaultFoodDatabase);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMeal, setActiveMeal] = useState<MealType>("Sarapan");
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [newFood, setNewFood] = useState<Partial<FoodItem>>({
    isCustom: true,
    category: "Buah",
  });
  const [portion, setPortion] = useState<string>("1");
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [filterCategory, setFilterCategory] = useState<
    FoodItem["category"] | "All"
  >("All");
  const [editPlan, setEditPlan] = useState<MealPlan | null>(null);
  const [planAuthor, setPlanAuthor] = useState("");
  const [planNotes, setPlanNotes] = useState("");

  // --- State untuk fitur edit jadwal ---
  const [editingSchedulePlan, setEditingSchedulePlan] =
    useState<MealPlan | null>(null);
  const [tempSchedule, setTempSchedule] = useState<MealSchedule>({});

  const [goals] = useState<NutrientGoals>({
    calories: 2000,
    sodium: 1500,
    fat: 70,
    potassium: 3500,
    protein: 50,
    carbs: 250,
  });

  const [aiInsight, setAiInsight] = useState(
    "Catat makanan pertama Anda untuk mendapatkan insight."
  );

  // --- Effect untuk mengisi jadwal sementara saat dialog dibuka ---
  useEffect(() => {
    if (editingSchedulePlan) {
      setTempSchedule(editingSchedulePlan.schedule);
    }
  }, [editingSchedulePlan]);

  const consumedNutrients = useMemo(() => {
    return loggedFoods.reduce(
      (acc, log) => {
        const food = foodDatabase.find((f) => f.id === log.foodId);
        if (food) {
          const multiplier = log.portion || 1;
          acc.calories += food.calories * multiplier;
          acc.sodium += food.sodium * multiplier;
          acc.fat += food.fat * multiplier;
          acc.potassium += food.potassium * multiplier;
          acc.protein += food.protein * multiplier;
          acc.carbs += food.carbs * multiplier;
        }
        return acc;
      },
      { calories: 0, sodium: 0, fat: 0, potassium: 0, protein: 0, carbs: 0 }
    );
  }, [loggedFoods, foodDatabase]);

  const generateAIInsight = useCallback(() => {
    const { sodium, potassium, protein, carbs, calories, fat } =
      consumedNutrients;
    const currentHour = new Date().getHours();
    const mealPattern = loggedFoods.reduce((acc, log) => {
      acc[log.meal] = (acc[log.meal] || 0) + 1;
      return acc;
    }, {} as { [key in MealType]?: number });

    if (loggedFoods.length === 0) {
      setAiInsight(
        "😴 Catat makanan pertama Anda untuk mendapatkan insight. Yuk mulai hari ini!"
      );
      return;
    }

    const insights: string[] = [];
    if (sodium > goals.sodium * 1.2) {
      insights.push(
        `⚠️ Sodium Anda kelebihan (${sodium}mg)! 🧂 Kurangi garam, coba ganti dengan rempah alami seperti kunyit atau jahe.`
      );
    } else if (sodium > goals.sodium) {
      insights.push(
        `🚨 Sodium mendekati batas (${sodium}mg). 🥗 Pilih makanan rendah natrium seperti sayuran segar.`
      );
    }
    if (potassium < goals.potassium * 0.5) {
      insights.push(
        `🌱 Potasium rendah (${potassium}mg)! 🍌 Tambah pisang, alpukat, atau bayam untuk jantung sehat.`
      );
    }
    if (protein < goals.protein * 0.7) {
      insights.push(
        `💪 Protein kurang (${protein}g). 🥚 Coba tambah telur, ikan, atau kacang-kacangan untuk otot.`
      );
    }
    if (carbs > goals.carbs * 1.2) {
      insights.push(
        `🍞 Karbo tinggi (${carbs}g)! 🌾 Pilih nasi merah atau quinoa untuk energi stabil.`
      );
    }
    if (calories > goals.calories * 1.3) {
      insights.push(
        `🔥 Kalori berlebih (${calories}kcal)! 🚶‍♂️ Tambah aktivitas fisik atau kurangi porsi.`
      );
    }
    if (fat > goals.fat * 1.5) {
      insights.push(
        `🍔 Lemak tinggi (${fat}g)! 🥑 Ganti dengan lemak sehat seperti alpukat atau kacang.`
      );
    }

    if (currentHour < 12 && !mealPattern["Sarapan"]) {
      insights.push(
        "🌅 Belum sarapan? Coba sesuatu ringan seperti oatmeal atau buah!"
      );
    } else if (currentHour > 18 && !mealPattern["Makan Malam"]) {
      insights.push(
        "🌙 Belum makan malam? Pilih makanan ringan untuk pencernaan malam."
      );
    }

    if (insights.length === 0) {
      insights.push(
        "🎉 Pola makan Anda luar biasa! 🥗 Pertahankan dan tambah variasi!"
      );
    }
    setAiInsight(insights.join("\n"));
  }, [consumedNutrients, goals, loggedFoods]);

  useEffect(() => {
    try {
      const savedFoods = localStorage.getItem("foodJournal");
      const savedCustomFoods = localStorage.getItem("customFoods");
      const savedPlans = localStorage.getItem("mealPlans");
      if (savedFoods) setLoggedFoods(JSON.parse(savedFoods));
      if (savedCustomFoods)
        setFoodDatabase([
          ...defaultFoodDatabase,
          ...JSON.parse(savedCustomFoods),
        ]);
      if (savedPlans) setMealPlans(JSON.parse(savedPlans));
    } catch (error) {
      console.error("Gagal memuat data dari localStorage:", error);
      toast.error("Error", {
        description: "Gagal memuat data jurnal. Menggunakan default.",
        duration: 3000,
      });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("foodJournal", JSON.stringify(loggedFoods));
      localStorage.setItem(
        "customFoods",
        JSON.stringify(foodDatabase.filter((f) => f.isCustom))
      );
      localStorage.setItem("mealPlans", JSON.stringify(mealPlans));
      generateAIInsight();
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage:", error);
      toast.error("Error", {
        description: "Gagal menyimpan data jurnal.",
        duration: 3000,
      });
    }
  }, [loggedFoods, foodDatabase, mealPlans, generateAIInsight]);

  const addFood = useCallback(
    (foodId: number) => {
      console.log("Menambahkan makanan dengan ID:", foodId);
      const parsedPortion = parseFloat(portion);
      if (isNaN(parsedPortion) || parsedPortion <= 0) {
        toast.error("Error", {
          description: "Porsi harus berupa angka positif.",
          duration: 3000,
        });
        return;
      }
      setLoggedFoods((prev) => [
        ...prev,
        {
          foodId,
          meal: activeMeal,
          timestamp: new Date().toISOString(),
          portion: parsedPortion,
          notes,
        },
      ]);
      setPortion("1");
      setNotes("");
      toast.success("Sukses", {
        description: "Makanan berhasil dicatat!",
        duration: 3000,
      });
    },
    [activeMeal, portion, notes]
  );

  const removeFood = useCallback((timestamp: string) => {
    setLoggedFoods((prev) => prev.filter((f) => f.timestamp !== timestamp));
    toast.success("Sukses", {
      description: "Makanan dihapus dari log.",
      duration: 3000,
    });
  }, []);

  const resetLog = useCallback(() => {
    setLoggedFoods([]);
    toast.success("Sukses", {
      description: "Log makanan telah direset.",
      duration: 3000,
    });
  }, []);

  const addCustomFood = useCallback(() => {
    if (
      !newFood.name ||
      !newFood.calories ||
      !newFood.sodium ||
      !newFood.fat ||
      !newFood.potassium ||
      !newFood.protein ||
      !newFood.carbs ||
      !newFood.category
    ) {
      toast.error("Error", {
        description: "Semua field makanan kustom harus diisi.",
        duration: 3000,
      });
      return;
    }
    const newId = Math.max(...foodDatabase.map((f) => f.id), 0) + 1;
    const customFood: FoodItem = {
      id: newId,
      name: newFood.name,
      calories: Number(newFood.calories),
      sodium: Number(newFood.sodium),
      fat: Number(newFood.fat),
      potassium: Number(newFood.potassium),
      protein: Number(newFood.protein),
      carbs: Number(newFood.carbs),
      category: newFood.category as FoodItem["category"],
      isCustom: true,
    };
    setFoodDatabase((prev) => [...prev, customFood]);
    setNewFood({ isCustom: true, category: "Buah" });
    toast.success("Sukses", {
      description: "Makanan kustom berhasil ditambahkan!",
      duration: 3000,
    });
  }, [newFood, foodDatabase]);

  const removeFoodItem = useCallback((foodId: number) => {
    setFoodDatabase((prev) => prev.filter((f) => f.id !== foodId));
    setLoggedFoods((prev) => prev.filter((f) => f.foodId !== foodId));
    toast.success("Sukses", {
      description: "Makanan dihapus dari database.",
      duration: 3000,
    });
  }, []);

  const exportData = useCallback(() => {
    const data = {
      loggedFoods,
      customFoods: foodDatabase.filter((f) => f.isCustom),
      mealPlans,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `food-journal-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Sukses", {
      description: "Data jurnal berhasil diekspor!",
      duration: 3000,
    });
  }, [loggedFoods, foodDatabase, mealPlans]);

  const importData = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setLoggedFoods(data.loggedFoods || []);
          setFoodDatabase([
            ...defaultFoodDatabase,
            ...(data.customFoods || []),
          ]);
          setMealPlans(data.mealPlans || []);
          toast.success("Sukses", {
            description: "Data jurnal berhasil diimpor!",
            duration: 3000,
          });
        } catch {
          toast.error("Error", {
            description: "Gagal mengimpor data. File tidak valid.",
            duration: 3000,
          });
        }
      };
      reader.readAsText(file);
    },
    []
  );

  const mealNutrients = useCallback(
    (meals: { [key in MealType]?: { foodId: number; portion: number }[] }) =>
      Object.entries(meals).reduce(
        (acc, [, foods]) => {
          if (foods) {
            foods.forEach(({ foodId, portion }) => {
              const food = foodDatabase.find((f) => f.id === foodId);
              if (food) {
                acc.calories += food.calories * portion;
                acc.sodium += food.sodium * portion;
                acc.fat += food.fat * portion;
                acc.potassium += food.potassium * portion;
                acc.protein += food.protein * portion;
                acc.carbs += food.carbs * portion;
              }
            });
          }
          return acc;
        },
        { calories: 0, sodium: 0, fat: 0, potassium: 0, protein: 0, carbs: 0 }
      ),
    [foodDatabase]
  );

  const createMealPlan = useCallback(() => {
    const newMeals = loggedFoods.reduce((acc, log) => {
      const food = foodDatabase.find((f) => f.id === log.foodId);
      if (food && !acc[log.meal]) acc[log.meal] = [];
      if (food)
        acc[log.meal]!.push({ foodId: log.foodId, portion: log.portion });
      return acc;
    }, {} as { [key in MealType]?: { foodId: number; portion: number }[] });

    const totalNutrients = mealNutrients(newMeals);
    if (totalNutrients.calories > goals.calories * 1.2) {
      toast.error("Error", {
        description:
          "Total kalori melebihi target harian (120%). Sesuaikan porsi!",
        duration: 3000,
      });
      return;
    }

    const newPlan: MealPlan = {
      id: mealPlans.length + 1,
      name: `Rencana ${new Date().toLocaleDateString()}`,
      meals: newMeals,
      schedule: { ...defaultSchedule },
      createdAt: new Date().toISOString(),
      author: planAuthor || "Pengguna",
      notes: planNotes || "Rencana default",
      totalNutrients,
    };
    setMealPlans((prev) => [...prev, newPlan]);
    setPlanAuthor("");
    setPlanNotes("");
    toast.success("Sukses", {
      description: "Rencana makan berhasil disimpan!",
      duration: 3000,
    });
  }, [
    loggedFoods,
    foodDatabase,
    mealPlans,
    planAuthor,
    planNotes,
    goals,
    mealNutrients,
  ]);

  const editMealPlan = useCallback((plan: MealPlan) => {
    setEditPlan(plan);
    setPlanAuthor(plan.author || "");
    setPlanNotes(plan.notes || "");
  }, []);

  const saveEditedPlan = useCallback(() => {
    if (editPlan) {
      const updatedPlan = {
        ...editPlan,
        author: planAuthor,
        notes: planNotes,
        totalNutrients: mealNutrients(editPlan.meals),
      };
      setMealPlans((prev) =>
        prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
      );
      setEditPlan(null);
      setPlanAuthor("");
      setPlanNotes("");
      toast.success("Sukses", {
        description: "Rencana makan diperbarui!",
        duration: 3000,
      });
    }
  }, [editPlan, planAuthor, planNotes, mealNutrients]);

  const removeMealPlan = useCallback((planId: number) => {
    setMealPlans((prev) => prev.filter((p) => p.id !== planId));
    toast.success("Sukses", {
      description: "Rencana makan dihapus!",
      duration: 3000,
    });
  }, []);

  const applyMealPlan = useCallback(
    (planId: number) => {
      const plan = mealPlans.find((p) => p.id === planId);
      if (plan) {
        const newLogs = Object.entries(plan.meals).flatMap(([meal, foods]) =>
          (foods || []).map(({ foodId, portion }) => ({
            foodId,
            meal: meal as MealType,
            timestamp: new Date().toISOString(),
            portion,
          }))
        );
        setLoggedFoods((prev) => [...prev, ...newLogs]);
        toast.success("Sukses", {
          description: `Rencana "${plan.name}" berhasil diterapkan!`,
          duration: 3000,
        });
      }
    },
    [mealPlans]
  );

  const copyMealPlan = useCallback(
    (planId: number) => {
      const plan = mealPlans.find((p) => p.id === planId);
      if (plan) {
        const newPlan: MealPlan = {
          ...plan,
          id: mealPlans.length + 1,
          name: `${plan.name} (Salinan)`,
          createdAt: new Date().toISOString(),
        };
        setMealPlans((prev) => [...prev, newPlan]);
        toast.success("Sukses", {
          description: "Rencana makan disalin!",
          duration: 3000,
        });
      }
    },
    [mealPlans]
  );

  // --- Fungsi untuk menyimpan jadwal yang telah diubah ---
  const saveSchedule = useCallback(() => {
    if (!editingSchedulePlan) return;
    setMealPlans((prev) =>
      prev.map((p) =>
        p.id === editingSchedulePlan.id ? { ...p, schedule: tempSchedule } : p
      )
    );
    setEditingSchedulePlan(null);
    toast.success("Sukses", {
      description: "Jadwal makan diperbarui!",
      duration: 3000,
    });
  }, [editingSchedulePlan, tempSchedule]);

  return (
    <section
      id="jurnal-makanan"
      className="py-24 sm:py-32 bg-gray-50 dark:bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Apple className="h-12 w-12 mx-auto text-red-600 mb-4" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Jurnal Makanan & Nutrisi Cerdas
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Kelola diet Anda dengan fitur lengkap: catat makanan, rencanakan
            menu, analisis nutrisi untuk aritmia, dan ekspor/impor data untuk
            pengalaman yang lebih personal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Pilih Tanggal</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full shadow-lg">
              <CardHeader>
                <CardTitle>Catat Asupan Makanan</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Input
                    placeholder="Cari makanan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                  <Select
                    value={filterCategory}
                    onValueChange={(value) =>
                      setFilterCategory(value as FoodItem["category"] | "All")
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Semua</SelectItem>
                      <SelectItem value="Buah">Buah</SelectItem>
                      <SelectItem value="Sayur">Sayur</SelectItem>
                      <SelectItem value="Protein">Protein</SelectItem>
                      <SelectItem value="Karbohidrat">Karbohidrat</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <Tabs
                    value={activeMeal}
                    onValueChange={(val) => setActiveMeal(val as MealType)}
                  >
                    <TabsList>
                      <TabsTrigger value="Sarapan">Sarapan</TabsTrigger>
                      <TabsTrigger value="Makan Siang">Makan Siang</TabsTrigger>
                      <TabsTrigger value="Makan Malam">Makan Malam</TabsTrigger>
                      <TabsTrigger value="Camilan">Camilan</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] overflow-y-auto custom-scrollbar pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {foodDatabase
                      .filter((food) => {
                        const matchesSearch = food.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                        const matchesCategory =
                          filterCategory === "All" ||
                          food.category === filterCategory;
                        return matchesSearch && matchesCategory;
                      })
                      .map((food) => (
                        <motion.div
                          key={food.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{
                            opacity: 0,
                            scale: 0.5,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <Card className="p-4 flex flex-col items-center justify-center text-center h-full hover:shadow-md transition-shadow">
                            <FoodIcon
                              category={food.category}
                              className="w-10 h-10 mb-2 text-gray-500"
                            />
                            <p className="font-semibold">{food.name}</p>
                            <p className="text-xs text-gray-500">
                              {food.calories} kkal | {food.protein}g Protein
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Input
                                type="number"
                                placeholder="Porsi"
                                defaultValue={portion}
                                onChange={(e) => setPortion(e.target.value)}
                                className="w-20"
                                min="0.1"
                                step="0.1"
                              />
                              <Button
                                size="sm"
                                onClick={() => addFood(food.id)}
                              >
                                <Plus size={16} className="mr-1" /> Catat
                              </Button>
                              {food.isCustom && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      <Trash2 size={16} className="mr-1" />{" "}
                                      Hapus
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Konfirmasi Hapus
                                      </DialogTitle>
                                      <DialogDescription>
                                        Apakah Anda yakin ingin menghapus "
                                        {food.name}" dari database? Aksi ini
                                        akan menghapus semua log terkait.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => removeFoodItem(food.id)}
                                      >
                                        Ya, Hapus
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        onClick={() => {}}
                                      >
                                        Batal
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                            <Input
                              placeholder="Catatan (opsional)"
                              defaultValue={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="mt-2"
                            />
                          </Card>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full shadow-lg">
              <CardHeader>
                <CardTitle>Analisis Nutrisi Harian</CardTitle>
                <CardDescription>
                  Target:{" "}
                  <span className="text-red-500">{goals.sodium}mg Sodium</span>,{" "}
                  <span className="text-green-500">
                    {goals.potassium}mg Potasium
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Kalori",
                      value: consumedNutrients.calories,
                      goal: goals.calories,
                    },
                    {
                      name: "Sodium",
                      value: consumedNutrients.sodium,
                      goal: goals.sodium,
                    },
                    {
                      name: "Lemak",
                      value: consumedNutrients.fat,
                      goal: goals.fat,
                    },
                    {
                      name: "Potasium",
                      value: consumedNutrients.potassium,
                      goal: goals.potassium,
                    },
                    {
                      name: "Protein",
                      value: consumedNutrients.protein,
                      goal: goals.protein,
                    },
                    {
                      name: "Karbo",
                      value: consumedNutrients.carbs,
                      goal: goals.carbs,
                    },
                  ].map((nutrient) => (
                    <div key={nutrient.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{nutrient.name}</span>
                        <span
                          className={
                            nutrient.value > nutrient.goal
                              ? "text-red-500 font-bold"
                              : ""
                          }
                        >
                          {nutrient.value.toFixed(0)} / {nutrient.goal}{" "}
                          {nutrient.name === "Kalori"
                            ? "kcal"
                            : nutrient.name === "Lemak" ||
                              nutrient.name === "Protein" ||
                              nutrient.name === "Karbo"
                            ? "g"
                            : "mg"}
                        </span>
                      </div>
                      <Progress
                        value={(nutrient.value / nutrient.goal) * 100}
                        className={
                          nutrient.name === "Sodium"
                            ? "[&>div]:bg-yellow-500"
                            : nutrient.name === "Potasium"
                            ? "[&>div]:bg-green-500"
                            : ""
                        }
                      />
                      {nutrient.value > nutrient.goal * 1.2 && (
                        <p className="text-xs text-red-500 mt-1">
                          ⚠️ Melebihi batas harian!
                        </p>
                      )}
                    </div>
                  ))}
                  <Alert className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 mt-6">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    <AlertTitle>Insight AI</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-300 font-semibold whitespace-pre-wrap">
                      {aiInsight}
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="mt-6">
                  <h3 className="font-bold mb-2">Tambah Makanan Kustom</h3>
                  <div className="space-y-2">
                    <Input
                      placeholder="Nama makanan"
                      value={newFood.name || ""}
                      onChange={(e) =>
                        setNewFood({ ...newFood, name: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Kalori (kcal)"
                        value={newFood.calories || ""}
                        onChange={(e) =>
                          setNewFood({
                            ...newFood,
                            calories: Number(e.target.value),
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Sodium (mg)"
                        value={newFood.sodium || ""}
                        onChange={(e) =>
                          setNewFood({
                            ...newFood,
                            sodium: Number(e.target.value),
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Lemak (g)"
                        value={newFood.fat || ""}
                        onChange={(e) =>
                          setNewFood({
                            ...newFood,
                            fat: Number(e.target.value),
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Potasium (mg)"
                        value={newFood.potassium || ""}
                        onChange={(e) =>
                          setNewFood({
                            ...newFood,
                            potassium: Number(e.target.value),
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Protein (g)"
                        value={newFood.protein || ""}
                        onChange={(e) =>
                          setNewFood({
                            ...newFood,
                            protein: Number(e.target.value),
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Karbohidrat (g)"
                        value={newFood.carbs || ""}
                        onChange={(e) =>
                          setNewFood({
                            ...newFood,
                            carbs: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <Select
                      value={newFood.category || "Buah"}
                      onValueChange={(value) =>
                        setNewFood({
                          ...newFood,
                          category: value as FoodItem["category"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Buah">Buah</SelectItem>
                        <SelectItem value="Sayur">Sayur</SelectItem>
                        <SelectItem value="Protein">Protein</SelectItem>
                        <SelectItem value="Karbohidrat">Karbohidrat</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addCustomFood}>Tambah Makanan</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Log Makanan Hari Ini</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetLog}>
                    <RotateCw size={14} className="mr-2" /> Reset Log
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportData}>
                    <Download size={14} className="mr-2" /> Ekspor
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <label>
                      <Upload size={14} className="mr-2" /> Impor
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(
                  [
                    "Sarapan",
                    "Makan Siang",
                    "Makan Malam",
                    "Camilan",
                  ] as MealType[]
                ).map((meal) => (
                  <div key={meal}>
                    <h3 className="font-bold mb-3">{meal}</h3>
                    <div className="space-y-2 min-h-[50px]">
                      <AnimatePresence>
                        {loggedFoods
                          .filter(
                            (f) =>
                              f.meal === meal &&
                              new Date(f.timestamp)
                                .toISOString()
                                .split("T")[0] === selectedDate
                          )
                          .map((log) => {
                            const food = foodDatabase.find(
                              (f) => f.id === log.foodId
                            );
                            if (!food) return null;
                            return (
                              <motion.div
                                key={log.timestamp}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{
                                  opacity: 0,
                                  x: 50,
                                  transition: { duration: 0.1 },
                                }}
                                className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                              >
                                <div>
                                  <span className="text-sm font-semibold">
                                    {food.name}
                                  </span>
                                  <p className="text-xs text-gray-500">
                                    Porsi: {log.portion}x |{" "}
                                    {log.notes || "Tanpa catatan"}
                                  </p>
                                </div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                    >
                                      <Trash2
                                        size={14}
                                        className="text-red-500"
                                      />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Konfirmasi Hapus
                                      </DialogTitle>
                                      <DialogDescription>
                                        Apakah Anda yakin ingin menghapus "
                                        {food.name}" dari log?
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          removeFood(log.timestamp)
                                        }
                                      >
                                        Ya, Hapus
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        onClick={() => {}}
                                      >
                                        Batal
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </motion.div>
                            );
                          })}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Rencana Makan</CardTitle>
              <CardDescription>
                Buat, edit, dan kelola rencana makan harian Anda dengan jadwal
                dan analisis nutrisi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nama Penulis"
                    value={planAuthor}
                    onChange={(e) => setPlanAuthor(e.target.value)}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="Catatan Rencana"
                    value={planNotes}
                    onChange={(e) => setPlanNotes(e.target.value)}
                    className="w-2/3"
                  />
                  <Button onClick={createMealPlan}>
                    <Plus size={16} className="mr-2" /> Buat Rencana Baru
                  </Button>
                </div>
                {mealPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md"
                  >
                    <CardHeader className="flex flex-row items-center justify-between p-2">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>
                          Dibuat:{" "}
                          {new Date(plan.createdAt).toLocaleDateString()} oleh{" "}
                          {plan.author}
                        </CardDescription>
                        <p className="text-sm text-gray-500">
                          Catatan: {plan.notes}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyMealPlan(plan.id)}
                        >
                          <Clock size={14} className="mr-1" /> Terapkan
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyMealPlan(plan.id)}
                        >
                          <Copy size={14} className="mr-1" /> Salin
                        </Button>
                        {/* --- Tombol untuk fitur edit jadwal --- */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSchedulePlan(plan)}
                        >
                          <Clock size={14} className="mr-1" /> Edit Jadwal
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 size={14} className="mr-1" /> Hapus
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Konfirmasi Hapus</DialogTitle>
                              <DialogDescription>
                                Apakah Anda yakin ingin menghapus rencana "
                                {plan.name}"?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => removeMealPlan(plan.id)}
                              >
                                Ya, Hapus
                              </Button>
                              <Button variant="secondary" onClick={() => {}}>
                                Batal
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editMealPlan(plan)}
                        >
                          <Edit2 size={14} className="mr-1" /> Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(plan.meals).map(([meal, foods]) => (
                          <div key={meal} className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                              {meal} ({plan.schedule[meal as MealType]})
                            </h4>
                            <ul className="list-disc ml-6 text-sm">
                              {foods?.map(({ foodId, portion }) => {
                                const food = foodDatabase.find(
                                  (f) => f.id === foodId
                                );
                                return food ? (
                                  <li
                                    key={foodId}
                                    className="flex justify-between"
                                  >
                                    {food.name} (Porsi: {portion}x)
                                    <span className="text-xs text-gray-500">
                                      {Math.round(food.calories * portion)} kcal
                                    </span>
                                  </li>
                                ) : null;
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <h5 className="font-medium">Total Nutrisi:</h5>
                        <ul className="list-disc ml-6 text-sm">
                          {Object.entries(plan.totalNutrients).map(
                            ([nutrient, value]) => (
                              <li key={nutrient}>
                                {nutrient}: {Math.round(value as number)}{" "}
                                {nutrient === "calories"
                                  ? "kcal"
                                  : nutrient === "fat" ||
                                    nutrient === "protein" ||
                                    nutrient === "carbs"
                                  ? "g"
                                  : "mg"}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </CardContent>
                    {editPlan?.id === plan.id && (
                      <CardFooter className="p-2">
                        <div className="flex gap-2 w-full">
                          <Input
                            placeholder="Nama Penulis"
                            value={planAuthor}
                            onChange={(e) => setPlanAuthor(e.target.value)}
                            className="w-1/3"
                          />
                          <Input
                            placeholder="Catatan Rencana"
                            value={planNotes}
                            onChange={(e) => setPlanNotes(e.target.value)}
                            className="w-2/3"
                          />
                          <Button onClick={saveEditedPlan}>Simpan</Button>
                          <Button
                            variant="secondary"
                            onClick={() => setEditPlan(null)}
                          >
                            Batal
                          </Button>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart /> Visualisasi Asupan Nutrisi
              </CardTitle>
              <CardDescription>
                Perbandingan asupan nutrisi utama Anda terhadap target harian.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NutrientChart consumed={consumedNutrients} goals={goals} />
            </CardContent>
          </Card>
        </motion.div>

        {/* --- Dialog untuk fitur edit jadwal --- */}
        <Dialog
          open={!!editingSchedulePlan}
          onOpenChange={(isOpen) => !isOpen && setEditingSchedulePlan(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit Jadwal untuk "{editingSchedulePlan?.name}"
              </DialogTitle>
              <DialogDescription>
                Atur waktu untuk setiap jadwal makan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {(Object.keys(tempSchedule) as MealType[]).map((meal) => (
                <div key={meal} className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor={meal} className="text-right">
                    {meal}
                  </label>
                  <Input
                    id={meal}
                    type="time"
                    value={tempSchedule[meal] || ""}
                    onChange={(e) =>
                      setTempSchedule((prev) => ({
                        ...prev,
                        [meal]: e.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingSchedulePlan(null)}
              >
                Batal
              </Button>
              <Button onClick={saveSchedule}>Simpan Jadwal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default FoodJournalSection;
