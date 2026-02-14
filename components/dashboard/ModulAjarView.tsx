
import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Printer, Save, Loader2, BrainCircuit, History, Trash2, Key, ExternalLink, Share2, Copy } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ModulAjar } from './Types';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

interface ModulAjarViewProps {
  onSaveModul: (modul: ModulAjar) => void;
  savedModuls: ModulAjar[];
  onDeleteModul: (id: string) => void;
}

export const ModulAjarView: React.FC<ModulAjarViewProps> = ({ onSaveModul, savedModuls, onDeleteModul }) => {
  const [loading, setLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('X');
  const [fase, setFase] = useState('E');
  const [generatedContent, setGeneratedContent] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      // Prioritas 1: Cek dari Environment Variable (Konfigurasi Netlify Dashboard)
      if (process.env.API_KEY && process.env.API_KEY !== 'undefined' && process.env.API_KEY !== '') {
        setHasApiKey(true);
        return;
      }
      
      // Prioritas 2: Cek dari helper AI Studio (jika dibuka lewat preview)
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        setHasApiKey(false);
      }
    } catch (e) {
      setHasApiKey(false);
    }
  };

  const handleConnectAI = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    } else {
      alert("Untuk menggunakan fitur AI di hosting mandiri, silakan konfigurasi variabel lingkungan API_KEY di dashboard hosting Anda.");
    }
  };

  const generateModul = async () => {
    if (!topic || !subject) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Buatlah Modul Ajar lengkap berdasarkan Kurikulum Merdeka untuk:
        Mata Pelajaran: ${subject}
        Topik: ${topic}
        Kelas: ${grade}
        Fase: ${fase}
        Modul harus mencakup: Identitas, Kompetensi, Profil Pelajar Pancasila, Sarana, Target, Model, Tujuan, Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan (Pendahuluan, Inti, Penutup), Asesmen, Refleksi.
        Gunakan format Markdown profesional dan bahasa Indonesia.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: "Anda adalah pakar kurikulum pendidikan Indonesia yang menyusun modul ajar interaktif dan berdiferensiasi.",
          temperature: 0.7
        }
      });
      setGeneratedContent(response.text || 'Gagal menghasilkan konten.');
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        alert("Kunci API tidak valid atau belum dikonfigurasi di hosting Anda.");
      } else {
        alert('Gagal menghasilkan modul. Periksa koneksi atau kuota API Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `*MODUL AJAR KURIKULUM MERDEKA*\n\nMapel: ${subject}\nTopik: ${topic}\n\n${generatedContent.substring(0, 500)}...\n\n_Dibuat via Portal Guru Digital_`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Modul berhasil disalin ke clipboard!');
  };

  const handleSave = () => {
    if (!generatedContent) return;
    onSaveModul({
      id: Date.now().toString(),
      subject, topic, grade, fase, duration: "2 JP",
      content: generatedContent,
      createdAt: new Date().toLocaleDateString('id-ID')
    });
    alert('Modul disimpan!');
  };

  if (hasApiKey === null) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-edu-primary" size={32} /></div>;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="bg-white p-12 rounded-4xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-edu-dark uppercase tracking-tight flex items-center gap-4">
            Modul Ajar AI <Sparkles className="text-edu-secondary animate-pulse" size={32} />
          </h2>
          <p className="text-[11px] text-edu-secondary font-black uppercase tracking-[0.3em] italic">Generate Materi Pembelajaran Instan</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 hover:bg-slate-100 transition-all border border-slate-100">
          <History size={16} /> {showHistory ? 'Tutup Riwayat' : 'Riwayat Modul'}
        </button>
      </div>

      {!hasApiKey ? (
        <div className="bg-white p-20 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-8 animate-fade-in">
          <div className="w-24 h-24 bg-edu-secondary/10 rounded-[2.5rem] flex items-center justify-center text-edu-secondary"><Key size={48} /></div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-edu-dark uppercase tracking-tight">Fitur AI Belum Aktif</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto font-medium">
              Aplikasi ini membutuhkan kunci API Gemini. Jika Anda admin, silakan set variabel lingkungan di hosting. Jika Anda pengguna, hubungkan lewat dialog di bawah.
            </p>
          </div>
          <button onClick={handleConnectAI} className="px-12 py-6 bg-gradient-to-r from-edu-secondary to-pink-500 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
            <Sparkles size={20} /> Hubungkan Lewat AI Studio
          </button>
        </div>
      ) : showHistory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {savedModuls.length > 0 ? savedModuls.map(m => (
            <div key={m.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-edu-primary/5 text-edu-primary text-[8px] font-black rounded-lg uppercase">{m.subject}</span>
                  <button onClick={() => onDeleteModul(m.id)} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                </div>
                <h4 className="font-black text-edu-dark text-lg leading-tight uppercase">{m.topic}</h4>
                <button onClick={() => { setGeneratedContent(m.content); setTopic(m.topic); setSubject(m.subject); setShowHistory(false); }} className="w-full py-3 bg-slate-50 text-edu-dark rounded-xl text-[9px] font-black uppercase hover:bg-edu-primary hover:text-white transition-all">Buka Modul</button>
              </div>
            </div>
          )) : <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase text-xs italic">Belum ada modul tersimpan</div>}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BrainCircuit size={16} /> Parameter Modul</h3>
              <div className="space-y-4">
                <div className="space-y-2"><label className="text-[9px] font-black text-edu-secondary uppercase px-2">Mata Pelajaran</label><input placeholder="Contoh: Matematika" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-black outline-none focus:border-edu-primary transition-all shadow-inner" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
                <div className="space-y-2"><label className="text-[9px] font-black text-edu-secondary uppercase px-2">Topik / Materi</label><textarea placeholder="Contoh: Turunan Fungsi Trigonometri" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-edu-primary transition-all shadow-inner resize-none" rows={3} value={topic} onChange={(e) => setTopic(e.target.value)} /></div>
              </div>
              <button onClick={generateModul} disabled={loading || !topic || !subject} className="w-full py-5 bg-gradient-to-r from-edu-primary to-edu-dark text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-105 transition-all">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> Generate Modul AI</>}
              </button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8">
            {loading ? (
              <div className="bg-white p-20 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-8 animate-pulse">
                <div className="w-24 h-24 bg-edu-primary/10 rounded-full flex items-center justify-center text-edu-primary"><BrainCircuit size={48} className="animate-bounce" /></div>
                <h3 className="text-2xl font-black text-edu-dark uppercase">Menyusun Modul...</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">AI sedang bekerja untuk Anda</p>
              </div>
            ) : generatedContent ? (
              <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div className="flex gap-2">
                    <button onClick={handleCopyClipboard} className="p-3 bg-white text-edu-primary rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 text-[9px] font-black uppercase"><Copy size={14} /> Salin</button>
                    <button onClick={handleShareWhatsApp} className="p-3 bg-green-500 text-white rounded-xl shadow-sm flex items-center gap-2 text-[9px] font-black uppercase hover:bg-green-600"><Share2 size={14} /> Share WA</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => window.print()} className="p-3 bg-white text-slate-400 rounded-xl border border-slate-100 shadow-sm"><Printer size={18} /></button>
                    <button onClick={handleSave} className="px-6 py-3 bg-edu-secondary text-white text-[9px] font-black uppercase rounded-xl shadow-lg hover:bg-edu-dark transition-all flex items-center gap-2"><Save size={14} /> Simpan</button>
                  </div>
                </div>
                <div className="p-12 overflow-y-auto custom-scrollbar flex-1 prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap font-poppins text-sm leading-relaxed text-slate-600">{generatedContent}</div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-20 rounded-[4rem] border border-slate-100 border-dashed border-2 flex flex-col items-center justify-center opacity-60">
                <p className="text-slate-300 font-black uppercase text-xs italic">Masukkan parameter dan klik Generate</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
