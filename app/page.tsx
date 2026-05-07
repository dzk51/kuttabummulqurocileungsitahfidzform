"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// 1. INISIALISASI SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. DATA SURAH PER JUZ
const dataSurah: Record<number, { nama: string; min: number; max: number }[]> = {
  30: [
    { nama: "An-Naba'", min: 1, max: 40 },
    { nama: "An-Nazi'at", min: 1, max: 46 },
    { nama: "Abasa", min: 1, max: 42 },
    { nama: "At-Takwir", min: 1, max: 29 },
    { nama: "Al-Infitar", min: 1, max: 19 },
    { nama: "Al-Mutaffifin", min: 1, max: 36 },
    { nama: "Al-Inshiqaq", min: 1, max: 25 },
    { nama: "Al-Buruj", min: 1, max: 22 },
    { nama: "At-Tariq", min: 1, max: 17 },
    { nama: "Al-A'la", min: 1, max: 19 },
    { nama: "Al-Ghashiyah", min: 1, max: 26 },
    { nama: "Al-Fajr", min: 1, max: 30 },
    { nama: "Al-Balad", min: 1, max: 20 },
    { nama: "Ash-Shams", min: 1, max: 15 },
    { nama: "Al-Layl", min: 1, max: 21 },
    { nama: "Ad-Duha", min: 1, max: 11 },
    { nama: "Ash-Sharh", min: 1, max: 8 },
    { nama: "At-Tin", min: 1, max: 8 },
    { nama: "Al-Alaq", min: 1, max: 19 },
    { nama: "Al-Qadr", min: 1, max: 5 },
    { nama: "Al-Bayyinah", min: 1, max: 8 },
    { nama: "Az-Zalzalah", min: 1, max: 8 },
    { nama: "Al-Adiyat", min: 1, max: 11 },
    { nama: "Al-Qari'ah", min: 1, max: 11 },
    { nama: "At-Takathur", min: 1, max: 8 },
    { nama: "Al-Asr", min: 1, max: 3 },
    { nama: "Al-Humazah", min: 1, max: 9 },
    { nama: "Al-Fil", min: 1, max: 5 },
    { nama: "Quraysh", min: 1, max: 4 },
    { nama: "Al-Ma'un", min: 1, max: 7 },
    { nama: "Al-Kawthar", min: 1, max: 3 },
    { nama: "Al-Kafirun", min: 1, max: 6 },
    { nama: "An-Nasr", min: 1, max: 3 },
    { nama: "Al-Masad", min: 1, max: 5 },
    { nama: "Al-Ikhlas", min: 1, max: 4 },
    { nama: "Al-Falaq", min: 1, max: 5 },
    { nama: "An-Nas", min: 1, max: 6 },
  ],
  // Tambahkan juz lain jika diperlukan di sini
};

export default function KuttabForm() {
  const [view, setView] = useState<"form" | "admin">("form");
  const [listHafalan, setListHafalan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // State Form
  const [nama, setNama] = useState("");
  const [halaqoh, setHalaqoh] = useState("");
  const [juz, setJuz] = useState<number>(30);
  const [surahInfo, setSurahInfo] = useState({ nama: "", minAyat: 1, maxAyat: 0 });
  const [ayatDari, setAyatDari] = useState<number | "">("");
  const [ayatSampai, setAyatSampai] = useState<number | "">("");
  const [foto, setFoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Grouping Data
  const groupedData = listHafalan.reduce((acc, item) => {
    const groupName = item.halaqoh || "Tanpa Halaqoh";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Realtime Data
  useEffect(() => {
    const fetchInitialData = async () => {
      const { data } = await supabase
        .from("kuttabummulqurocileungsi")
        .select("*")
        .order("id", { ascending: false });
      if (data) setListHafalan(data);
    };
    fetchInitialData();

    const channel = supabase
      .channel("realtime_kuttab")
      .on("postgres_changes", { event: "*", schema: "public", table: "kuttabummulqurocileungsi" }, () => fetchInitialData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSimpan = async () => {
    if (!nama || !halaqoh || !surahInfo.nama || !ayatDari || !ayatSampai || !foto) {
      return alert("Mohon lengkapi semua data!");
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("kuttabummulqurocileungsi").insert([{
        nama, halaqoh, juz, surah: surahInfo.nama, ayat: `${ayatDari}-${ayatSampai}`, foto, tanggal: new Date().toLocaleString("id-ID")
      }]);
      if (error) throw error;
      alert("Berhasil!");
      setNama(""); setHalaqoh(""); setAyatDari(""); setAyatSampai(""); setFoto(null);
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  if (view === "admin") {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-4">
        <button onClick={() => setView("form")} className="mb-6 bg-slate-700 px-4 py-2 rounded-lg text-sm">Kembali</button>
        {Object.keys(groupedData).map((group) => (
          <div key={group} className="mb-10">
            <h2 className="text-xl font-bold text-red-500 mb-4 uppercase">HALAQOH: {group}</h2>
            <div className="overflow-x-auto bg-slate-800 rounded-xl">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead className="bg-slate-700 text-slate-300">
                  <tr><th className="p-3">Nama</th><th className="p-3">Hafalan</th><th className="p-3">Foto</th></tr>
                </thead>
                <tbody>
                  {groupedData[group].map((item) => (
                    <tr key={item.id} className="border-b border-slate-700">
                      <td className="p-3 font-bold">{item.nama}</td>
                      <td className="p-3">{item.surah} ({item.ayat})</td>
                      <td className="p-3">
                        {item.foto && <img src={item.foto} className="h-10 w-10 rounded object-cover" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-lg border-t-8 border-red-600">
        <h1 className="text-2xl font-black text-center mb-6">KUTTAB FORM</h1>
        <div className="space-y-4">
          <input placeholder="Nama Santri" className="w-full p-4 border-2 rounded-xl" value={nama} onChange={e => setNama(e.target.value)} />
          <input placeholder="Halaqoh (Cth: Abu Bakar)" className="w-full p-4 border-2 rounded-xl" value={halaqoh} onChange={e => setHalaqoh(e.target.value)} />
          
          <select 
            className="w-full p-4 border-2 rounded-xl"
            onChange={(e) => {
              const s = dataSurah[juz].find(x => x.nama === e.target.value);
              if(s) setSurahInfo({ nama: s.nama, minAyat: s.min, maxAyat: s.max });
            }}
          >
            <option>-- Pilih Surah --</option>
            {dataSurah[juz].map(s => <option key={s.nama} value={s.nama}>{s.nama}</option>)}
          </select>

          <div className="flex gap-2">
            <input type="number" placeholder="Dari" className="w-1/2 p-4 border-2 rounded-xl" value={ayatDari} onChange={e => setAyatDari(Number(e.target.value))} />
            <input type="number" placeholder="Sampai" className="w-1/2 p-4 border-2 rounded-xl" value={ayatSampai} onChange={e => setAyatSampai(Number(e.target.value))} />
          </div>

          <button onClick={() => fileInputRef.current?.click()} className="w-full p-4 bg-slate-100 border-2 border-dashed rounded-xl font-bold">
            {foto ? "✅ FOTO SIAP" : "📷 AMBIL FOTO"}
          </button>
          <input type="file" hidden ref={fileInputRef} onChange={(e) => {
             const reader = new FileReader();
             reader.onload = () => setFoto(reader.result as string);
             if(e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
          }} />

          <button onClick={handleSimpan} disabled={loading} className="w-full p-4 bg-red-600 text-white font-bold rounded-xl shadow-lg">
            {loading ? "PROSES..." : "SIMPAN SETORAN"}
          </button>
          
          <button onClick={() => { if(prompt("PIN") === "123") setView("admin") }} className="w-full text-xs text-slate-400 mt-4 underline">Admin Room</button>
        </div>
      </div>
    </div>
  );
}
