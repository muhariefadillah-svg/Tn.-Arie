
import React, { useRef } from 'react';
import { 
  GraduationCap, Database, RotateCcw, Plus, Trash2, BookOpen, 
  FileSpreadsheet, Printer, TrendingUp, Award, AlertCircle, ClipboardList,
  Download, Upload, Share2, Copy, Users, Globe, Terminal
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { Student, Subject, Journal, TeacherProfile } from './Types';
import * as XLSX from 'xlsx';

// Manual icon fallback
const GlobeIcon = Globe;
const TerminalIcon = Terminal;

interface ViewProps {
  students?: Student[];
  subjects?: Subject[];
  journals?: Journal[];
  teacherProfile?: TeacherProfile;
  filterClass?: string;
  setFilterClass?: (c: string) => void;
  availableClasses?: string[];
  onAdd?: () => void;
  onDelete?: (id: number) => void;
  onBackup?: () => void;
  onRestore?: () => void;
  onSave?: () => void;
  onPrint?: (type: any) => void;
  onExport?: (type: any) => void;
  onValueChange?: (id: number, idx: number, val: number) => void;
  setActiveTab?: (tab: string) => void;
  onImportStudents?: (data: Student[]) => void;
}

export const HomeView: React.FC<ViewProps> = ({ teacherProfile, onBackup, onRestore, setActiveTab }) => {
  const portalUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    alert('Link portal berhasil disalin! Silakan bagikan ke rekan guru.');
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Welcome Banner */}
      <div className="bg-white p-16 rounded-5xl shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-edu-primary/5 to-transparent"></div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-black text-edu-dark tracking-tighter leading-tight">Halo,<br/> <span className="text-edu-secondary">{teacherProfile?.fullName}!</span></h1>
          <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">Portal Anda sekarang siap dibagikan melalui Netlify. Kelola kurikulum dan murid dengan lebih mudah.</p>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab?.('murid')} className="px-12 py-5 bg-edu-primary text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-edu-dark transition-all">Mulai Kelola Murid</button>
            <button onClick={onBackup} className="px-8 py-5 border-2 border-edu-primary text-edu-primary rounded-3xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-edu-primary hover:text-white transition-all"><Database size={16} /> Backup Data</button>
          </div>
        </div>
        <div className="absolute right-0 -bottom-16 opacity-10 -rotate-12 select-none group-hover:scale-110 duration-700 transition-transform">
          <GraduationCap size={450} className="text-edu-secondary" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Kolaborasi Section */}
        <div className="lg:col-span-1 bg-edu-secondary/5 border-2 border-edu-secondary/10 p-10 rounded-[3.5rem] space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-edu-secondary text-white rounded-2xl flex items-center justify-center shadow-lg"><Users size={28} /></div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-edu-dark uppercase tracking-tight">Berbagi Portal</h3>
              <p className="text-edu-secondary text-[9px] font-black uppercase tracking-widest">Ajak Rekan Guru</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs font-medium leading-relaxed">Salin link Netlify Anda dan kirim ke WhatsApp rekan guru lain agar mereka bisa mendaftar.</p>
          <div className="space-y-3">
            <button onClick={handleCopyLink} className="w-full py-4 bg-white text-edu-secondary border-2 border-edu-secondary/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-edu-secondary hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm">
              <Copy size={16} /> Salin Link Netlify
            </button>
            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Halo Rekan Guru! Mari gunakan portal guru digital untuk manajemen kelas: ' + portalUrl)}`, '_blank')} className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-2">
              <Share2 size={16} /> Kirim via WhatsApp
            </button>
          </div>
        </div>

        {/* Netlify Guide Section */}
        <div className="lg:col-span-2 bg-edu-dark p-12 rounded-[3.5rem] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-edu-primary opacity-20 blur-[100px]"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white/10 text-edu-yellow rounded-2xl flex items-center justify-center border border-white/20"><GlobeIcon size={28} /></div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Konfigurasi Netlify</h3>
              <p className="text-edu-yellow text-[9px] font-black uppercase tracking-widest">Agar Fitur AI Berjalan</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-4">
              <h4 className="text-white text-[11px] font-black uppercase tracking-widest border-b border-white/10 pb-2">Langkah di Dashboard Netlify:</h4>
              <ul className="space-y-3">
                {[
                  "Buka Site Settings > Environment Variables",
                  "Klik 'Add a Variable' > 'Add Single Variable'",
                  "Key: API_KEY",
                  "Value: (Masukkan API Key Gemini Anda)"
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-edu-yellow text-edu-dark text-[10px] font-black flex items-center justify-center shrink-0">{i+1}</span>
                    <p className="text-xs font-bold text-slate-300">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-black/30 p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-edu-yellow"><TerminalIcon size={14}/> <span className="text-[9px] font-black uppercase">Kenapa Harus Ini?</span></div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                "Dengan memasukkan API_KEY di Netlify, semua guru yang menggunakan link Anda bisa langsung generate modul tanpa harus memiliki kunci API sendiri. Portal Anda jadi siap pakai untuk satu sekolah!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MuridView: React.FC<ViewProps> = ({ students = [], onAdd, onDelete, onImportStudents }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadTemplate = () => {
    const data = [
      { Nama: 'Budi Santoso', NIS: '1001', Gender: 'L', Kelas: 'X-RPL' },
      { Nama: 'Siti Aminah', NIS: '1002', Gender: 'P', Kelas: 'X-RPL' },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Data_Murid.xlsx");
  };
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      const newStudents: Student[] = (data as any[]).map((row, i) => ({
        id: Date.now() + i,
        name: row.Nama || row.nama || 'Tanpa Nama',
        nis: String(row.NIS || row.nis || ''),
        gender: row.Gender || row.gender || 'L',
        class: row.Kelas || row.kelas || 'Umum',
        performance: [0, 0, 0, 0, 0],
        attendance: { S: 0, I: 0, A: 0 },
        dailyAttendance: {}
      }));
      onImportStudents?.(newStudents);
    };
    reader.readAsBinaryString(file);
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-12 rounded-4xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div className="space-y-1"><h2 className="text-4xl font-black text-edu-dark uppercase tracking-tight">Data Murid</h2><p className="text-[11px] text-edu-secondary font-black uppercase tracking-[0.3em] italic">Database Kesiswaan Digital</p></div>
        <div className="flex gap-3">
          <button onClick={downloadTemplate} className="px-6 py-4 bg-white border border-slate-100 text-edu-dark rounded-3xl text-[10px] font-black flex items-center gap-2"><Download size={16} className="text-edu-secondary" /> Template</button>
          <button onClick={() => fileInputRef.current?.click()} className="px-6 py-4 bg-white border border-slate-100 text-edu-dark rounded-3xl text-[10px] font-black flex items-center gap-2"><Upload size={16} className="text-edu-primary" /> Import</button>
          <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx, .xls" onChange={handleImport} />
          <button onClick={onAdd} className="px-10 py-4 bg-edu-primary text-white rounded-3xl text-[10px] font-black uppercase shadow-2xl flex items-center gap-2 transition-all"><Plus size={16} /> Tambah Murid</button>
        </div>
      </div>
      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full edu-table">
          <thead><tr><th className="w-24 text-center">NO</th><th>NAMA LENGKAP MURID</th><th>NISN / NIS</th><th className="text-center">GENDER</th><th className="text-center">KELAS</th><th className="text-center">AKSI</th></tr></thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((s, idx) => (
              <tr key={s.id} className="hover:bg-edu-pink-light/5 transition-colors">
                <td className="px-8 py-5 text-sm font-black text-slate-300 text-center">{idx + 1}</td>
                <td className="px-8 py-5 text-sm font-black text-edu-dark uppercase">{s.name}</td>
                <td className="px-8 py-5 text-xs font-mono font-bold text-edu-secondary">{s.nis}</td>
                <td className="px-8 py-5 text-center font-bold text-slate-400">{s.gender}</td>
                <td className="px-8 py-5 text-center"><span className="px-5 py-2 bg-edu-primary/5 text-edu-primary rounded-xl text-[10px] font-black border border-edu-primary/10 uppercase">{s.class}</span></td>
                <td className="px-8 py-5 text-center flex justify-center gap-2"><button onClick={() => onDelete?.(s.id)} className="p-3 text-edu-secondary hover:bg-edu-secondary hover:text-white rounded-2xl transition-all shadow-sm"><Trash2 size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const MapelView: React.FC<ViewProps> = ({ subjects = [], onAdd, onDelete }) => (
  <div className="space-y-8 animate-fade-in">
    <div className="bg-white p-12 rounded-4xl shadow-sm border border-slate-100 flex justify-between items-center">
      <div className="space-y-1"><h2 className="text-4xl font-black text-edu-dark uppercase tracking-tight">MATA PELAJARAN</h2><p className="text-[11px] text-edu-secondary font-black uppercase tracking-[0.3em] italic">Manajemen Kurikulum</p></div>
      <button onClick={onAdd} className="px-10 py-4 bg-edu-primary text-white rounded-3xl font-black text-[10px] uppercase shadow-xl">+ Mapel Baru</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map(m => (
        <div key={m.id} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between group relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10"><div className="w-14 h-14 bg-edu-primary/5 rounded-2xl flex items-center justify-center text-edu-primary"><BookOpen size={24} /></div><div><h4 className="font-black text-edu-dark text-lg uppercase tracking-tight">{m.name}</h4><div className="flex gap-2 text-[9px] font-black uppercase text-edu-secondary"><span>{m.jenjang}</span><span>•</span><span>Fase {m.fase}</span><span>•</span><span>KKTP: {m.kktp}</span></div></div></div>
          <button onClick={() => onDelete?.(m.id)} className="p-3 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all z-10"><Trash2 size={18} /></button>
        </div>
      ))}
    </div>
  </div>
);

export const NilaiView: React.FC<ViewProps> = ({ students = [], filterClass, setFilterClass, availableClasses, onExport, onPrint, onSave, onValueChange }) => (
  <div className="space-y-8 animate-fade-in">
    <div className="bg-white p-12 rounded-4xl shadow-sm border border-slate-100 flex justify-between items-center">
      <div className="space-y-1"><h2 className="text-4xl font-black text-edu-dark uppercase tracking-tight">Input Nilai</h2><p className="text-[11px] text-edu-secondary font-black uppercase tracking-[0.3em] italic">Hasil Belajar Akademik</p></div>
      <div className="flex gap-3">
        <select className="px-8 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-[11px] font-black uppercase outline-none" value={filterClass} onChange={(e)=>setFilterClass?.(e.target.value)}>{availableClasses?.map(c=><option key={c} value={c}>{c}</option>)}</select>
        <button onClick={() => onExport?.('nilai')} className="px-6 py-4 bg-white border border-slate-100 text-edu-dark rounded-3xl text-[10px] font-black flex items-center gap-2"><FileSpreadsheet size={16} className="text-edu-primary" /> Excel</button>
        <button onClick={() => onPrint?.('nilai')} className="px-6 py-4 bg-edu-dark text-white rounded-3xl text-[10px] font-black flex items-center gap-2"><Printer size={16} /> PDF</button>
        <button onClick={onSave} className="px-12 py-4 bg-edu-primary text-white rounded-3xl text-[10px] font-black uppercase shadow-2xl transition-all">Simpan</button>
      </div>
    </div>
    <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full edu-table">
        <thead><tr><th className="w-20">NO</th><th>NAMA SISWA</th><th className="text-center">NH1</th><th className="text-center">NH2</th><th className="text-center">NH3</th><th className="text-center">ATS</th><th className="text-center">SAS</th><th className="text-center bg-edu-primary/90">RATA-RATA</th></tr></thead>
        <tbody className="divide-y divide-slate-50">
          {students.map((s, idx) => (
            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-8 py-5 text-sm font-black text-slate-300 text-center">{idx + 1}</td>
              <td className="px-8 py-5 text-sm font-black text-edu-dark uppercase tracking-tight">{s.name}</td>
              {s.performance.map((val, i) => (
                <td key={i} className="px-4 py-5 text-center"><input type="number" className="w-16 text-center bg-slate-50 rounded-2xl p-3 border-none font-black text-sm shadow-inner" defaultValue={val} onBlur={(e) => onValueChange?.(s.id, i, Number(e.target.value))} /></td>
              ))}
              <td className="px-6 py-5 text-center font-black bg-edu-primary/5 text-edu-primary text-sm italic">{(s.performance.reduce((a, b) => a + b, 0) / 5).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const PerformaView: React.FC<ViewProps> = ({ students = [], filterClass, setFilterClass, availableClasses, onPrint }) => {
  const getStats = () => {
    if (students.length === 0) return { avg: "0", high: "0", low: "0" };
    const averages = students.map(s => s.performance.reduce((a,b)=>a+b, 0) / 5);
    return { avg: (averages.reduce((a,b)=>a+b, 0) / (averages.length || 1)).toFixed(1), high: Math.max(...averages).toFixed(1), low: Math.min(...averages).toFixed(1) };
  };
  const stats = getStats();
  const getTrendData = () => {
    const labels = ['NH1', 'NH2', 'NH3', 'ATS', 'SAS'];
    return labels.map((label, i) => ({ name: label, rata: parseFloat((students.reduce((acc, s) => acc + s.performance[i], 0) / (students.length || 1)).toFixed(1)) }));
  };
  return (
    <div className="space-y-10 pb-24 animate-fade-in">
      <div className="bg-white p-12 rounded-4xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div className="space-y-1"><h2 className="text-4xl font-black text-edu-dark uppercase tracking-tight">Analisis Performa</h2><p className="text-[11px] text-edu-secondary font-black uppercase tracking-[0.3em] italic">Statistik & Tren Akademik</p></div>
        <div className="flex gap-4">
          <select className="px-8 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-[11px] font-black uppercase outline-none shadow-inner" value={filterClass} onChange={(e)=>setFilterClass?.(e.target.value)}>{availableClasses?.map(c=><option key={c} value={c}>{c}</option>)}</select>
          <button onClick={() => onPrint?.('performa')} className="px-10 py-4 bg-edu-dark text-white rounded-3xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-edu-primary transition-all shadow-xl"><Printer size={16} /> Cetak Laporan</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {[
          { label: 'Rata-rata Kelas', val: stats.avg, icon: TrendingUp, color: 'text-edu-primary', bg: 'bg-edu-primary/5' },
          { label: 'Nilai Tertinggi', val: stats.high, icon: Award, color: 'text-edu-secondary', bg: 'bg-edu-secondary/5' },
          { label: 'Nilai Terendah', val: stats.low, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/5' },
        ].map((st, i) => (
          <div key={i} className={`p-10 rounded-5xl border border-slate-100 shadow-sm flex items-center gap-6 ${st.bg}`}><div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm text-edu-dark"><st.icon size={28} /></div><div><p className="text-[10px] font-black text-slate-400 uppercase">{st.label}</p><h4 className={`text-3xl font-black ${st.color}`}>{st.val}</h4></div></div>
        ))}
      </div>
      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-8">
        <h3 className="text-2xl font-black text-edu-dark uppercase tracking-tight">Tren Nilai Kelas</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={getTrendData()}><defs><linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#004F2D" stopOpacity={0.8}/><stop offset="95%" stopColor="#004F2D" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" stroke="#94a3b8" fontSize={12} fontWeight="900" axisLine={false} tickLine={false} dy={15} /><YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} fontWeight="900" axisLine={false} tickLine={false} dx={-15} /><Tooltip /><Area type="monotone" dataKey="rata" stroke="#004F2D" strokeWidth={6} fillOpacity={1} fill="url(#colorTrend)" /></AreaChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const JurnalView: React.FC<ViewProps> = ({ journals = [], onAdd, onDelete }) => (
  <div className="space-y-8 animate-fade-in">
    <div className="bg-white p-12 rounded-4xl shadow-sm border border-slate-100 flex justify-between items-center">
      <div className="space-y-1"><h2 className="text-5xl font-black text-edu-dark tracking-tight uppercase">JURNAL MENGAJAR</h2><p className="text-[12px] text-edu-secondary font-black uppercase tracking-[0.4em] italic">Dokumentasi Harian Guru</p></div>
      <button onClick={onAdd} className="px-14 py-5 bg-edu-secondary text-white rounded-3xl font-black text-xs uppercase shadow-2xl hover:bg-edu-dark transition-all">+ Input Jurnal</button>
    </div>
    {journals.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {journals.map((j) => (
          <div key={j.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden transition-all hover:shadow-xl"><div className="space-y-4 relative z-10"><div className="flex justify-between items-center border-b border-slate-50 pb-4"><span className="text-xs font-black text-edu-dark">{j.date}</span><span className="text-[9px] font-black text-edu-secondary uppercase">{j.mapel}</span></div><p className="text-[11px] font-bold text-slate-500 line-clamp-3 italic">“{j.capaian}”</p><div className="flex justify-between items-center pt-2"><div className="flex gap-2"><span className="px-3 py-1 bg-edu-primary/5 text-edu-primary text-[8px] font-black rounded-lg uppercase">{j.kelas}</span><span className="px-3 py-1 bg-slate-50 text-slate-400 text-[8px] font-black rounded-lg uppercase">Jam {j.jamPelajaran}</span></div><button onClick={() => onDelete?.(j.id)} className="text-rose-400 hover:text-rose-600 font-black text-[9px] uppercase transition-colors">Hapus</button></div></div></div>
        ))}
      </div>
    ) : (
      <div className="bg-white p-32 rounded-[4rem] border border-slate-100 text-center space-y-8"><div className="bg-edu-pink-light/20 w-32 h-32 rounded-full flex items-center justify-center mx-auto text-edu-secondary shadow-lg"><ClipboardList size={64} /></div><p className="text-slate-300 text-sm font-black uppercase tracking-[0.3em] italic opacity-50">Belum ada jurnal tersimpan hari ini</p></div>
    )}
  </div>
);
