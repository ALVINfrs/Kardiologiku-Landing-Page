// src/components/landing/ForumKompleks.tsx

import React, { useState, useEffect, createContext, useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ThumbsUp,
  MessageSquare,
  CornerUpRight,
  PlusCircle,
  ArrowLeft,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";

// --- 1. DEFINISI TIPE & STRUKTUR DATA ---

type User = {
  name: string;
  avatarUrl?: string;
  initials: string;
};

type Reply = {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  parentId: string | null; // null jika balasan level atas, atau id balasan lain jika nested
  replies?: Reply[]; // Untuk mempermudah rendering rekursif
};

type Thread = {
  id: string;
  title: string;
  author: User;
  content: string;
  createdAt: string;
  tags: string[];
  likes: number;
  replies: Reply[];
};

// --- 2. DATA DUMMY AWAL (SEED DATA) ---
const seedData: Thread[] = [
  {
    id: "thread-01",
    title: "Baru didiagnosis dengan Aritmia, harus mulai dari mana?",
    author: {
      name: "CemasTapiSemangat",
      avatarUrl: "https://github.com/shadcn.png",
      initials: "CS",
    },
    content:
      "Halo semua, saya baru saja keluar dari RS dan dokter bilang saya punya Fibrilasi Atrium. Rasanya sedikit takut dan bingung harus berbuat apa sekarang. Apakah ada saran untuk langkah pertama?",
    createdAt: "2 hari yang lalu",
    tags: ["Aritmia", "Pemula", "Dukungan"],
    likes: 42,
    replies: [
      {
        id: "reply-001",
        parentId: null,
        author: {
          name: "SeniorUser",
          avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
          initials: "SU",
        },
        createdAt: "2 hari yang lalu",
        likes: 18,
        content:
          "Jangan panik, perasaanmu sangat wajar. Coba deh baca bagian **AritmiaMythBuster** di aplikasi ini, sangat membantu!",
      },
      {
        id: "reply-002",
        parentId: null,
        author: { name: "DokterBot", avatarUrl: "/Logo.png", initials: "DB" },
        createdAt: "2 hari yang lalu",
        likes: 25,
        content:
          "Selamat datang! Langkah pertama yang baik adalah memahami kondisi Anda. Coba mulai dengan **Modul Edukasi Interaktif**.",
      },
      {
        id: "reply-003",
        parentId: "reply-001",
        author: {
          name: "CemasTapiSemangat",
          avatarUrl: "https://github.com/shadcn.png",
          initials: "CS",
        },
        createdAt: "1 hari yang lalu",
        likes: 5,
        content: "Terima kasih sarannya @SeniorUser, saya akan coba lihat.",
      },
    ],
  },
  {
    id: "thread-02",
    title: "Tips Diet Rendah Garam yang Enak?",
    author: {
      name: "JuruMasakJantung",
      avatarUrl: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      initials: "JM",
    },
    content:
      "Ada yang punya resep atau tips supaya makanan rendah garam tetap terasa lezat? Sudah coba beberapa resep tapi rasanya hambar sekali.",
    createdAt: "5 hari yang lalu",
    tags: ["Diet", "Nutrisi", "Resep"],
    likes: 78,
    replies: [],
  },
];

const LOCAL_STORAGE_KEY = "kardiologiku_forum_kompleks";

// --- 3. LOGIC & STATE MANAGEMENT (Menggunakan Context API) ---

type ForumContextType = {
  threads: Thread[];
  getThread: (id: string) => Thread | undefined;
  addThread: (
    title: string,
    content: string,
    authorName: string,
    tags: string[]
  ) => void;
  addReply: (
    threadId: string,
    content: string,
    authorName: string,
    parentId: string | null
  ) => void;
  toggleLike: (
    threadId: string,
    itemId: string,
    itemType: "thread" | "reply"
  ) => void;
};

const ForumContext = createContext<ForumContextType | null>(null);

const ForumProvider = ({ children }: { children: React.ReactNode }) => {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setThreads(JSON.parse(storedData));
      } else {
        setThreads(seedData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedData));
      }
    } catch (error) {
      console.error("Gagal memuat data forum dari Local Storage:", error);
      setThreads(seedData);
    }
  }, []);

  const saveData = (newThreads: Thread[]) => {
    setThreads(newThreads);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newThreads));
  };

  const createUser = (name: string): User => ({
    name,
    initials: name.substring(0, 2).toUpperCase(),
    avatarUrl: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, "")}`,
  });

  const addThread = (
    title: string,
    content: string,
    authorName: string,
    tags: string[]
  ) => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title,
      content,
      tags,
      author: createUser(authorName),
      createdAt: "Baru saja",
      likes: 0,
      replies: [],
    };
    saveData([newThread, ...threads]);
  };

  const addReply = (
    threadId: string,
    content: string,
    authorName: string,
    parentId: string | null
  ) => {
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      content,
      parentId,
      author: createUser(authorName),
      createdAt: "Baru saja",
      likes: 0,
    };
    const newThreads = threads.map((t) =>
      t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t
    );
    saveData(newThreads);
  };

  const toggleLike = (
    threadId: string,
    itemId: string,
    itemType: "thread" | "reply"
  ) => {
    const newThreads = threads.map((t) => {
      if (t.id !== threadId) return t;

      if (itemType === "thread") {
        return { ...t, likes: t.likes + 1 }; // Di dunia nyata, kita akan cek jika sudah like
      } else {
        const updatedReplies = t.replies.map((r) =>
          r.id === itemId ? { ...r, likes: r.likes + 1 } : r
        );
        return { ...t, replies: updatedReplies };
      }
    });
    saveData(newThreads);
  };

  const getThread = (id: string) => threads.find((t) => t.id === id);

  return (
    <ForumContext.Provider
      value={{ threads, getThread, addThread, addReply, toggleLike }}
    >
      {children}
    </ForumContext.Provider>
  );
};

const useForum = () => {
  const context = useContext(ForumContext);
  if (!context)
    throw new Error("useForum harus digunakan di dalam ForumProvider");
  return context;
};

// --- 4. KOMPONEN-KOMPONEN UI ---

// Form untuk Balasan
const ReplyForm = ({
  threadId,
  parentId,
  onCancel,
  onSuccess,
}: {
  threadId: string;
  parentId: string | null;
  onCancel?: () => void;
  onSuccess: () => void;
}) => {
  const { addReply } = useForum();
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    addReply(threadId, content, author, parentId);
    onSuccess();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      onSubmit={handleSubmit}
      className="space-y-3 mt-4 ml-4 pl-4 border-l-2 dark:border-gray-700"
    >
      <Input
        placeholder="Nama Anda"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <Textarea
        placeholder="Tulis balasan..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit">Kirim</Button>
      </div>
    </motion.form>
  );
};

// Komponen Rekursif untuk Menampilkan Balasan
const ReplyComponent = ({
  reply,
  threadId,
}: {
  reply: Reply;
  threadId: string;
}) => {
  const { toggleLike } = useForum();
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="flex gap-3 mt-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={reply.author.avatarUrl} />
        <AvatarFallback>{reply.author.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm">{reply.author.name}</p>
          <span className="text-xs text-gray-500">• {reply.createdAt}</span>
        </div>
        <p className="text-gray-800 dark:text-gray-200 mt-1 text-sm">
          {reply.content}
        </p>
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleLike(threadId, reply.id, "reply")}
          >
            <ThumbsUp size={14} className="mr-1" /> {reply.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
          >
            <CornerUpRight size={14} className="mr-1" /> Balas
          </Button>
        </div>
        <AnimatePresence>
          {isReplying && (
            <ReplyForm
              threadId={threadId}
              parentId={reply.id}
              onSuccess={() => setIsReplying(false)}
              onCancel={() => setIsReplying(false)}
            />
          )}
        </AnimatePresence>

        {/* Render balasan dari balasan ini (nested) */}
        {reply.replies &&
          reply.replies.map((childReply) => (
            <ReplyComponent
              key={childReply.id}
              reply={childReply}
              threadId={threadId}
            />
          ))}
      </div>
    </div>
  );
};

// Tampilan Detail Satu Utas
const ThreadDetailView = ({
  threadId,
  onBack,
}: {
  threadId: string;
  onBack: () => void;
}) => {
  const { getThread, toggleLike } = useForum();
  const thread = getThread(threadId);

  // Membangun struktur pohon dari daftar balasan
  const nestedReplies = React.useMemo(() => {
    if (!thread) return [];
    const replyMap: { [key: string]: Reply } = {};
    const topLevelReplies: Reply[] = [];

    thread.replies.forEach((reply) => {
      reply.replies = [];
      replyMap[reply.id] = reply;
    });

    thread.replies.forEach((reply) => {
      if (reply.parentId && replyMap[reply.parentId]) {
        replyMap[reply.parentId].replies?.push(reply);
      } else {
        topLevelReplies.push(reply);
      }
    });
    return topLevelReplies;
  }, [thread]);

  if (!thread)
    return (
      <div>
        Utas tidak ditemukan. <Button onClick={onBack}>Kembali</Button>
      </div>
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Forum
      </Button>
      <Card>
        <CardHeader>
          <div className="flex gap-2 flex-wrap mb-2">
            {thread.tags.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-2xl">{thread.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={thread.author.avatarUrl} />
              <AvatarFallback>{thread.author.initials}</AvatarFallback>
            </Avatar>
            <span>
              Dimulai oleh <strong>{thread.author.name}</strong> •{" "}
              {thread.createdAt}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">{thread.content}</p>
          <Separator className="my-6" />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => toggleLike(thread.id, thread.id, "thread")}
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> Suka ({thread.likes})
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" /> {thread.replies.length}{" "}
              Balasan
            </div>
          </div>

          <Separator className="my-8" />
          <h3 className="text-xl font-bold mb-2">Diskusi</h3>
          {nestedReplies.map((reply) => (
            <ReplyComponent key={reply.id} reply={reply} threadId={thread.id} />
          ))}

          <div className="mt-8">
            <h4 className="font-semibold">Balas Utas Ini</h4>
            <ReplyForm
              threadId={thread.id}
              parentId={null}
              onSuccess={() => {
                /* maybe show a success message */
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Form untuk Membuat Utas Baru (dalam Dialog)
const CreateThreadDialog = () => {
  const { addThread } = useForum();
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleCreate = () => {
    if (!author.trim() || !title.trim() || !content.trim()) return;
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    addThread(title, content, author, tagArray);
    // Reset form and close dialog
    setAuthor("");
    setTitle("");
    setContent("");
    setTags("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Buat Forum Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mulai Diskusi Baru</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Nama Anda"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Input
            placeholder="Judul Diskusi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Apa yang ingin Anda diskusikan?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          <Input
            placeholder="Tags (pisahkan dengan koma), cth: Diet, Pemula"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate}>Publikasikan</Button>
      </DialogContent>
    </Dialog>
  );
};

// Tampilan Daftar Semua Utas
const ThreadListView = ({
  onSelectThread,
}: {
  onSelectThread: (id: string) => void;
}) => {
  const { threads } = useForum();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Forum Komunitas</h2>
          <p className="text-gray-500">
            Tempat berbagi, bertanya, dan saling mendukung.
          </p>
        </div>
        <CreateThreadDialog />
      </div>
      <div className="space-y-4">
        {threads.map((thread) => (
          <Card
            key={thread.id}
            className="cursor-pointer hover:border-red-500 transition-colors"
            onClick={() => onSelectThread(thread.id)}
          >
            <CardHeader>
              <CardTitle>{thread.title}</CardTitle>
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={thread.author.avatarUrl} />
                  <AvatarFallback>{thread.author.initials}</AvatarFallback>
                </Avatar>
                <span>
                  <strong>{thread.author.name}</strong> • {thread.createdAt}
                </span>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex flex-wrap gap-2">
                {thread.tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-4">
                <span className="flex items-center">
                  <ThumbsUp className="mr-1.5 h-4 w-4" /> {thread.likes}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="mr-1.5 h-4 w-4" />{" "}
                  {thread.replies.length}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

// --- 5. KOMPONEN UTAMA YANG MENGATUR SEMUANYA ---
const ForumKompleks = () => {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  return (
    <ForumProvider>
      <section className="py-16 sm:py-20 bg-gray-100 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {activeThreadId ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <ThreadDetailView
                  threadId={activeThreadId}
                  onBack={() => setActiveThreadId(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <ThreadListView onSelectThread={setActiveThreadId} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </ForumProvider>
  );
};

export default ForumKompleks;
