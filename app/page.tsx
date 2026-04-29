"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// 1. INISIALISASI SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Surah per Juz
type AyatRange = {
  nama: string;
  min: number;
  max: number;
};

const dataSurah: Record<number, AyatRange[]> = {
 1: [
  { nama: "Al-Fatihah", min: 1, max: 7 },
  { nama: "Al-Baqarah", min: 1, max: 141 },
],
2: [
  { nama: "Al-Baqarah", min: 142, max: 252 }, // ✅ FIX (141 → 142)
],
3: [
  { nama: "Al-Baqarah", min: 253, max: 286 },
  { nama: "Ali Imran", min: 1, max: 91 },
],
4: [
  { nama: "Ali Imran", min: 92, max: 200 },
  { nama: "An-Nisa", min: 1, max: 23 },
],
5: [
  { nama: "An-Nisa", min: 24, max: 147 },
],
6: [
  { nama: "An-Nisa", min: 148, max: 176 },
  { nama: "Al-Ma'idah", min: 1, max: 81 }, // ✅ FIX (82 → 81)
],
7: [
  { nama: "Al-Ma'idah", min: 82, max: 120 },
  { nama: "Al-An'am", min: 1, max: 110 },
],
8: [
  { nama: "Al-An'am", min: 111, max: 165 },
  { nama: "Al-A'raf", min: 1, max: 87 },
],
9: [
  { nama: "Al-A'raf", min: 88, max: 206 },
  { nama: "Al-Anfal", min: 1, max: 40 },
],
10: [
  { nama: "Al-Anfal", min: 41, max: 75 },
  { nama: "At-Taubah", min: 1, max: 92 }, // ✅ FIX (93 → 92)
],
11: [
  { nama: "At-Taubah", min: 93, max: 129 },
  { nama: "Yunus", min: 1, max: 109 },
  { nama: "Hud", min: 1, max: 5 },
],
12: [
  { nama: "Hud", min: 6, max: 123 },
  { nama: "Yusuf", min: 1, max: 52 },
],
13: [
  { nama: "Yusuf", min: 53, max: 111 },
  { nama: "Ar-Ra'd", min: 1, max: 43 },
  { nama: "Ibrahim", min: 1, max: 52 },
],
14: [
  { nama: "Al-Hijr", min: 1, max: 99 },
  { nama: "An-Nahl", min: 1, max: 128 },
],
15: [
  { nama: "Al-Isra'", min: 1, max: 111 },
  { nama: "Al-Kahfi", min: 1, max: 74 },
],
16: [
  { nama: "Al-Kahfi", min: 75, max: 110 },
  { nama: "Maryam", min: 1, max: 98 },
  { nama: "Ta Ha", min: 1, max: 135 },
],
17: [
  { nama: "Al-Anbiya", min: 1, max: 112 },
  { nama: "Al-Hajj", min: 1, max: 78 },
],
18: [
  { nama: "Al-Mu'minun", min: 1, max: 118 },
  { nama: "An-Nur", min: 1, max: 64 },
  { nama: "Al-Furqan", min: 1, max: 20 },
],
19: [
  { nama: "Al-Furqan", min: 21, max: 77 },
  { nama: "Asy-Syu'ara'", min: 1, max: 227 },
  { nama: "An-Naml", min: 1, max: 55 },
],
20: [
  { nama: "An-Naml", min: 56, max: 93 },
  { nama: "Al-Qasas", min: 1, max: 88 },
  { nama: "Al-'Ankabut", min: 1, max: 45 },
],
21: [
  { nama: "Al-'Ankabut", min: 46, max: 69 },
  { nama: "Ar-Rum", min: 1, max: 60 },
  { nama: "Luqman", min: 1, max: 34 },
  { nama: "As-Sajdah", min: 1, max: 30 },
  { nama: "Al-Ahzab", min: 1, max: 30 },
],
22: [
  { nama: "Al-Ahzab", min: 31, max: 73 },
  { nama: "Saba'", min: 1, max: 54 },
  { nama: "Fatir", min: 1, max: 45 },
  { nama: "Ya Sin", min: 1, max: 27 },
],
23: [
  { nama: "Ya Sin", min: 28, max: 83 },
  { nama: "As-Saffat", min: 1, max: 182 }, // ✅ FIX (82 → 182)
  { nama: "Sad", min: 1, max: 88 },
  { nama: "Az-Zumar", min: 1, max: 31 },
],
24: [
  { nama: "Az-Zumar", min: 32, max: 75 },
  { nama: "Al-Ghafir", min: 1, max: 85 },
  { nama: "Al-Fussilat", min: 1, max: 46 },
],
25: [
  { nama: "Al-Fussilat", min: 47, max: 54 },
  { nama: "Asy-Syura", min: 1, max: 53 },
  { nama: "Az-Zukhruf", min: 1, max: 89 },
  { nama: "Ad-Dukhan", min: 1, max: 59 },
  { nama: "Al-Jatsiyah", min: 1, max: 37 }, // ✅ FIX (32 → 37)
],
export default function KuttabForm() {
  const [view, setView] = useState<"form" | "admin">("form");
  const [listHafalan, setListHafalan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHapus, setLoadingHapus] = useState(false);

  // State Form
  const [nama, setNama] = useState("");
  const [halaqoh, setHalaqoh] = useState("");
  const [juz, setJuz] = useState<number>(30);
  const [surahInfo, setSurahInfo] = useState({ nama: "", minAyat: 1, maxAyat: 0 });
  const [ayatDari, setAyatDari] = useState<number | "">("");
  const [ayatSampai, setAyatSampai] = useState<number | "">("");
  const [foto, setFoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. AMBIL DATA REALTIME DARI SUPABASE
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
      .on("postgres_changes",
        { event: "*", schema: "public", table: "kuttabummulqurocileungsi" },
        () => { fetchInitialData(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 3. FUNGSI SIMPAN DATA
  const handleSimpan = async () => {
    if (!nama || !halaqoh || !surahInfo.nama || !ayatDari || !ayatSampai || !foto) {
      return alert("Mohon lengkapi semua data!");
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("kuttabummulqurocileungsi")
        .insert([{
          nama: nama,
          halaqoh: halaqoh,
          juz: juz,
          surah: surahInfo.nama,
          ayat: `${ayatDari} - ${ayatSampai}`,
          foto: foto,
          tanggal: new Date().toLocaleString("id-ID")
        }]);

      if (error) throw error;

      alert("Data Berhasil Disimpan ke Supabase! 🚀");

      // Reset Form
      setNama("");
      setHalaqoh("");
      setAyatDari("");
      setAyatSampai("");
      setFoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error: any) {
      console.error("Error detail:", error);
      alert("Gagal simpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. FUNGSI HAPUS SEMUA HISTORY
  const handleHapusHistory = async () => {
    const konfirmasi = confirm(
      "⚠️ PERINGATAN!\n\nSemua data setoran hafalan akan dihapus permanen dan tidak bisa dikembalikan.\n\nYakin ingin menghapus semua history?"
    );
    if (!konfirmasi) return;

    const konfirmasi2 = confirm("Konfirmasi sekali lagi — Hapus SEMUA data sekarang?");
    if (!konfirmasi2) return;

    setLoadingHapus(true);
    try {
      const { error } = await supabase
        .from("kuttabummulqurocileungsi")
        .delete()
        .neq("id", 0); // hapus semua baris

      if (error) throw error;

      setListHafalan([]);
      alert("✅ Semua history berhasil dihapus.");
    } catch (error: any) {
      console.error("Error hapus:", error);
      alert("Gagal hapus: " + error.message);
    } finally {
      setLoadingHapus(false);
    }
  };

  const handleAmbilFoto = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleInputAyat = (jenis: "dari" | "sampai", value: string) => {
    if (value === "") {
      jenis === "dari" ? setAyatDari("") : setAyatSampai("");
      return;
    }
    let angka = parseInt(value);
    if (angka > surahInfo.maxAyat) angka = surahInfo.maxAyat;
    jenis === "dari" ? setAyatDari(angka) : setAyatSampai(angka);
  };

  // === TAMPILAN ADMIN ROOM ===
  if (view === "admin") {
    return (
      <main className="min-h-screen bg-slate-900 p-4 font-sans text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
            <h1 className="text-2xl font-black text-red-500">ADMIN ROOM <span className="text-white">KUTTAB</span></h1>
            <div className="flex gap-3">
              {/* TOMBOL HAPUS HISTORY */}
              <button
                onClick={handleHapusHistory}
                disabled={loadingHapus || listHafalan.length === 0}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  loadingHapus || listHafalan.length === 0
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-red-700 hover:bg-red-600 text-white"
                }`}
              >
                {loadingHapus ? "Menghapus..." : "🗑️ Hapus History"}
              </button>
              <button
                onClick={() => setView("form")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-sm"
              >
                Kembali ke Form
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 overflow-x-auto shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-700 text-slate-300 uppercase">
                <tr>
                  <th className="p-4 rounded-tl-xl">Waktu</th>
                  <th className="p-4">Nama Santri</th>
                  <th className="p-4">Halaqoh</th>
                  <th className="p-4">Juz</th>
                  <th className="p-4">Surah & Ayat</th>
                  <th className="p-4 rounded-tr-xl">Bukti Foto</th>
                </tr>
              </thead>
              <tbody>
                {listHafalan.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">
                      Belum ada data setoran.
                    </td>
                  </tr>
                ) : (
                  listHafalan.map((item) => (
                    <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-750">
                      <td className="p-4 text-xs text-slate-400">{item.tanggal}</td>
                      <td className="p-4 font-bold text-white">{item.nama}</td>
                      <td className="p-4 text-slate-300">{item.halaqoh}</td>
                      <td className="p-4">
                        <span className="bg-red-900 text-red-300 px-2 py-1 rounded font-bold text-xs">
                          Juz {item.juz}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{item.surah} ({item.ayat})</td>
                      <td className="p-4">
                        {item.foto && (
                          <img
                            src={item.foto}
                            alt="Dokumentasi"
                            className="h-10 w-16 object-cover rounded border border-slate-600 hover:scale-150 transition-transform cursor-pointer"
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {listHafalan.length > 0 && (
            <p className="text-center text-slate-500 text-xs mt-4 font-bold">
              Total: {listHafalan.length} data setoran
            </p>
          )}
        </div>
      </main>
    );
  }

  // === TAMPILAN FORM (SANTRI) ===
  return (
    <main className="min-h-screen bg-slate-50 p-4 font-sans pb-20 relative">
      <button
        onClick={() => {
          const pin = prompt("Masukkan PIN Admin:");
          if (pin === "1234") setView("admin");
          else if (pin) alert("PIN Salah!");
        }}
        className="absolute top-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-900 transition-all"
      >
        Admin Room 🔒
      </button>

      <div className="max-w-xl mx-auto pt-10">
        <p className="text-center text-red-700 font-bold text-sm mb-1 uppercase tracking-widest">
          {new Date().toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 className="text-center text-3xl font-black text-slate-800 mb-6">
          KUTTAB<span className="text-red-600"> FORM</span>
        </h1>

        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-200 border-t-8 border-t-red-600">
          <p className="text-center text-[11px] font-black text-slate-500 mb-6 uppercase tracking-wider">
            Kuttab Ummul Quro Cileungsi
          </p>

          <div className="space-y-6">
            {/* Nama Santri */}
            <div>
              <label className="text-xs font-black text-slate-700 ml-2 uppercase">Nama Santri</label>
              <input
                type="text" placeholder="Masukkan nama..."
                className="w-full mt-2 p-4 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-300 focus:border-red-500 outline-none transition-all shadow-sm"
                value={nama} onChange={(e) => setNama(e.target.value)}
              />
            </div>

            {/* Nama Halaqoh */}
            <div>
              <label className="text-xs font-black text-slate-700 ml-2 uppercase">Nama Halaqoh</label>
              <input
                type="text" placeholder="Masukkan nama halaqoh..."
                className="w-full mt-2 p-4 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-300 focus:border-red-500 outline-none transition-all shadow-sm"
                value={halaqoh} onChange={(e) => setHalaqoh(e.target.value)}
              />
            </div>

            {/* Pilih Juz */}
            <div>
              <label className="text-xs font-black text-slate-700 ml-2 uppercase">Pilih Juz</label>
              <div className="flex overflow-x-auto gap-2 mt-2 pb-2 scrollbar-hide">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                  <button
                    key={j}
                    onClick={() => {
                      setJuz(j);
                      setSurahInfo({ nama: "", minAyat: 1, maxAyat: 0 });
                      setAyatDari("");
                      setAyatSampai("");
                    }}
                    className={`shrink-0 px-5 py-3 rounded-xl text-sm font-black transition-all border-2 ${
                      juz === j
                        ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'
                    }`}
                  >
                    Juz {j}
                  </button>
                ))}
              </div>
            </div>

            {/* Nama Surah */}
            <div>
              <label className="text-xs font-black text-slate-700 ml-2 uppercase">Nama Surah</label>
              <select
                className="w-full mt-2 p-4 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-300 focus:border-red-500 outline-none shadow-sm cursor-pointer"
                value={surahInfo.nama}
                onChange={(e) => {
                  const s = dataSurah[juz]?.find((x: any) => x.nama === e.target.value);
                  if (s) {
                    setSurahInfo({ nama: s.nama, minAyat: s.min, maxAyat: s.max });
                    setAyatDari("");
                    setAyatSampai("");
                  }
                }}
              >
                <option value="" disabled>-- Pilih Surah --</option>
                {dataSurah[juz]?.map((s: any) => (
                  <option key={s.nama} value={s.nama}>
                    {s.nama} ({s.min}-{s.max})
                  </option>
                ))}
              </select>
            </div>

            {/* Input Ayat */}
            {surahInfo.maxAyat > 0 && (
              <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex-1 text-center">
                  <label className="text-[10px] font-black text-slate-600 uppercase block mb-2">Dari</label>
                  <input
                    type="number"
                    value={ayatDari}
                    onChange={(e) => handleInputAyat("dari", e.target.value)}
                    className="w-full p-3 bg-white font-black rounded-xl border-2 border-slate-300 text-center text-slate-900"
                  />
                </div>
                <div className="flex-1 text-center">
                  <label className="text-[10px] font-black text-slate-600 uppercase block mb-2">Sampai</label>
                  <input
                    type="number"
                    value={ayatSampai}
                    onChange={(e) => handleInputAyat("sampai", e.target.value)}
                    className="w-full p-3 bg-white font-black rounded-xl border-2 border-slate-300 text-center text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Dokumentasi */}
            <div>
              <label className="text-xs font-black text-slate-700 ml-2 uppercase mb-2 block">
                Dokumentasi
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                ref={fileInputRef}
                onChange={handleAmbilFoto}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-5 rounded-2xl border-2 border-dashed font-black transition-all ${
                  foto
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-400 bg-slate-50 text-slate-600'
                }`}
              >
                {foto ? "✅ FOTO TERSIMPAN" : "📷 AMBIL FOTO"}
              </button>
              {foto && (
                <img
                  src={foto}
                  className="mt-4 rounded-2xl h-48 w-full object-cover border-4 border-slate-100 shadow-md"
                />
              )}
            </div>

            {/* Tombol Simpan */}
            <button
              onClick={handleSimpan}
              disabled={loading}
              className={`w-full py-5 text-white font-black text-lg rounded-2xl shadow-lg transition-all ${
                loading ? 'bg-slate-400' : 'bg-red-600 hover:bg-red-700 active:scale-95'
              }`}
            >
              {loading ? "MENYIMPAN DATA..." : "SIMPAN DATA KUTTAB"}
            </button>
          </div>
        </div>

        <p className="mt-12 text-center text-[9px] text-slate-400 font-bold tracking-[0.3em]">
          Dozku.Digital - Wajib diisi
        </p>
      </div>
    </main>
  );
}
