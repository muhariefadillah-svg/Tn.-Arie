
import React from 'react';
import { Printer, FileSpreadsheet, PieChart, Calendar } from 'lucide-react';
import { Student } from './Types';

interface AttendanceViewProps {
  students: Student[];
  filterClass: string;
  setFilterClass: (c: string) => void;
  availableClasses: string[];
  selectedMonth: number;
  setSelectedMonth: (m: number) => void;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  onAttendanceChange: (id: number, dateStr: string, val: string) => void;
  onExportExcel: () => void;
  onPrintPDF: () => void;
  onSave: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ 
  students, filterClass, setFilterClass, availableClasses, 
  selectedMonth, setSelectedMonth, selectedYear, setSelectedYear,
  onAttendanceChange, onExportExcel, onPrintPDF, onSave 
}) => {
  
  // Hitung jumlah hari dalam bulan terpilih
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const getDayType = (day: number) => {
    const date = new Date(selectedYear, selectedMonth - 1, day);
    const dayOfWeek = date.getDay(); // 0 = Minggu, 6 = Sabtu
    if (dayOfWeek === 0) return 'sun';
    if (dayOfWeek === 6) return 'sat';
    return null;
  };

  const getStats = () => {
    let s = 0, i = 0, a = 0;
    students.forEach(st => {
      Object.keys(st.dailyAttendance).forEach(dateKey => {
        if (dateKey.startsWith(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`)) {
          const val = st.dailyAttendance[dateKey];
          if (val === 'S') s++;
          if (val === 'I') i++;
          if (val === 'A') a++;
        }
      });
    });
    
    const totalPotential = (students.length || 1) * daysInMonth;
    return { 
      totalS: s, totalI: i, totalA: a,
      pS: ((s / totalPotential) * 100).toFixed(1),
      pI: ((i / totalPotential) * 100).toFixed(1),
      pA: ((a / totalPotential) * 100).toFixed(1)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      <div className="bg-white p-12 rounded-4xl shadow-sm border border-slate-100 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-edu-dark uppercase tracking-tight">Absensi Harian</h2>
            <p className="text-[11px] text-edu-secondary font-black uppercase italic tracking-[0.3em]">
              <span className="text-yellow-500 font-bold">Sabtu Kuning</span> | <span className="text-red-600">Minggu Merah</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={onExportExcel} className="px-6 py-4 bg-white border border-slate-100 text-edu-dark rounded-3xl text-[10px] font-black flex items-center gap-2 hover:bg-slate-50 transition-all">
              <FileSpreadsheet size={16} className="text-edu-primary" /> Excel
            </button>
            <button onClick={onPrintPDF} className="px-6 py-4 bg-edu-dark text-white rounded-3xl text-[10px] font-black flex items-center gap-2 hover:bg-edu-primary transition-all">
              <Printer size={16} /> PDF
            </button>
            <button onClick={onSave} className="px-12 py-4 bg-edu-primary text-white rounded-3xl text-[10px] font-black uppercase shadow-2xl hover:bg-edu-dark transition-all">Simpan</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2"><Calendar size={12}/> Pilih Bulan</label>
            <select 
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase outline-none shadow-sm focus:border-edu-secondary transition-all" 
              value={selectedMonth} 
              onChange={(e)=>setSelectedMonth(Number(e.target.value))}
            >
              {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2"><Calendar size={12}/> Pilih Tahun</label>
            <select 
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase outline-none shadow-sm focus:border-edu-secondary transition-all" 
              value={selectedYear} 
              onChange={(e)=>setSelectedYear(Number(e.target.value))}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Pilih Kelas</label>
            <select 
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase outline-none shadow-sm focus:border-edu-secondary transition-all" 
              value={filterClass} 
              onChange={(e)=>setFilterClass(e.target.value)}
            >
              {availableClasses.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end pb-1">
             <div className="bg-edu-secondary/10 px-6 py-4 rounded-2xl border border-edu-secondary/20 w-full flex justify-between items-center">
                <span className="text-[10px] font-black text-edu-secondary uppercase">Periode:</span>
                <span className="text-[10px] font-black text-edu-dark uppercase">{months[selectedMonth-1]} {selectedYear}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Sakit (S)', percent: stats.pS, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
          { label: 'Izin (I)', percent: stats.pI, color: 'text-edu-primary', bg: 'bg-edu-primary/5' },
          { label: 'Alpa (A)', percent: stats.pA, color: 'text-red-600', bg: 'bg-red-500/10' },
        ].map((st, idx) => (
          <div key={idx} className={`p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center ${st.bg}`}>
            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{st.label}</p><h4 className={`text-4xl font-black ${st.color}`}>{st.percent}<span className="text-lg ml-1">%</span></h4></div>
            <PieChart size={28} className={st.color} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full edu-table">
            <thead>
              <tr>
                <th className="w-16 text-center">NO</th>
                <th className="whitespace-nowrap">NAMA LENGKAP</th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const type = getDayType(day);
                  return (
                    <th key={day} className={`px-2 text-center min-w-[42px] border-r border-white/10 ${type === 'sun' ? 'bg-red-600' : type === 'sat' ? 'bg-yellow-400 text-edu-dark font-black' : 'bg-slate-700'} text-white text-[11px]`}>{day}</th>
                  );
                })}
                <th className="bg-yellow-400 text-edu-dark w-12 text-center">S</th>
                <th className="bg-edu-primary text-white w-12 text-center">I</th>
                <th className="bg-red-600 text-white w-12 text-center">A</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s, idx) => {
                // Hitung rekapan S, I, A khusus bulan terpilih untuk ditampilkan di kolom akhir
                let s_c = 0, i_c = 0, a_c = 0;
                Object.keys(s.dailyAttendance).forEach(key => {
                  if (key.startsWith(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`)) {
                    const val = s.dailyAttendance[key];
                    if (val === 'S') s_c++;
                    if (val === 'I') i_c++;
                    if (val === 'A') a_c++;
                  }
                });

                return (
                  <tr key={s.id} className="hover:bg-edu-pink-light/5 transition-colors group">
                    <td className="px-6 py-4 font-black text-slate-300 text-center border-r border-slate-100">{idx + 1}</td>
                    <td className="px-8 py-4 font-black text-edu-dark uppercase text-[11px] whitespace-nowrap border-r border-slate-100">{s.name}</td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const type = getDayType(day);
                      return (
                        <td key={day} className={`p-0 border-r border-slate-100 ${type === 'sun' ? 'bg-red-50' : type === 'sat' ? 'bg-yellow-50' : ''}`}>
                          <input 
                            className={`w-full h-12 text-center bg-transparent outline-none text-xs uppercase ${type === 'sat' ? 'font-black text-yellow-700' : type === 'sun' ? 'font-black text-red-600' : 'font-bold'}`} 
                            value={s.dailyAttendance[dateStr] || ''} 
                            maxLength={1}
                            placeholder="."
                            onChange={(e) => onAttendanceChange(s.id, dateStr, e.target.value)}
                          />
                        </td>
                      );
                    })}
                    <td className="px-2 py-4 text-center font-black text-yellow-700 bg-yellow-50 text-xs border-l-2 border-slate-200">{s_c}</td>
                    <td className="px-2 py-4 text-center font-black text-edu-primary bg-edu-primary/5 text-xs">{i_c}</td>
                    <td className="px-2 py-4 text-center font-black text-red-600 bg-red-50 text-xs">{a_c}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
