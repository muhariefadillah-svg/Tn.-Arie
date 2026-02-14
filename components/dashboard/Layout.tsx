
import React from 'react';
import { 
  LogOut, ShieldCheck, Building2, User, 
  Home, Users, BookOpen, CalendarCheck, 
  FileSpreadsheet, BarChart3, ClipboardList, Settings, Sparkles, Share2
} from 'lucide-react';
import { SchoolSettings, TeacherProfile } from './Types';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  schoolSettings: SchoolSettings;
  teacherProfile: TeacherProfile;
  onLogout: () => void;
}

export const Sidebar: React.FC<LayoutProps> = ({ activeTab, setActiveTab, schoolSettings }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'murid', icon: Users, label: 'Data Murid' },
    { id: 'mapel', icon: BookOpen, label: 'Mapel' },
    { id: 'absen', icon: CalendarCheck, label: 'Absensi' },
    { id: 'modul', icon: Sparkles, label: 'Modul AI' },
    { id: 'nilai', icon: FileSpreadsheet, label: 'Nilai' },
    { id: 'performa', icon: BarChart3, label: 'Analisis' },
    { id: 'jurnal', icon: ClipboardList, label: 'Jurnal' },
    { id: 'setting', icon: Settings, label: 'Pengaturan' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 shadow-sm">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-edu-primary p-2 rounded-xl shadow-lg w-12 h-12 flex items-center justify-center">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-edu-dark text-[10px] uppercase">Portal Guru</span>
            <span className="text-[9px] text-edu-secondary font-black uppercase tracking-widest mt-1">SISTEM DIGITAL</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 text-[11px] font-black uppercase tracking-wider ${
              activeTab === item.id 
                ? (item.id === 'modul' ? 'bg-gradient-to-r from-edu-secondary to-pink-500 text-white shadow-xl' : 'bg-edu-primary text-white shadow-xl shadow-edu-primary/20') 
                : 'text-slate-400 hover:bg-edu-pink-light/10 hover:text-edu-secondary'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export const Header: React.FC<LayoutProps> = ({ schoolSettings, teacherProfile, onLogout }) => {
  const handleSharePortal = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link portal berhasil disalin! Silakan bagikan ke grup WhatsApp guru.');
  };

  return (
    <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
      <div className="flex items-center gap-6">
        <div className="bg-edu-primary w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center p-1.5 border-2 border-slate-50 overflow-hidden">
          {schoolSettings.logo ? <img src={schoolSettings.logo} className="w-full h-full object-contain" alt="logo" /> : <Building2 className="text-white w-8 h-8" />}
        </div>
        <div className="flex flex-col">
          <h2 className="font-black text-edu-dark text-xl tracking-tight uppercase leading-none">{schoolSettings.name}</h2>
          <p className="text-[10px] text-edu-secondary font-black uppercase tracking-[0.2em] mt-1.5 italic truncate max-w-sm">{schoolSettings.address}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={handleSharePortal}
          className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-edu-primary hover:text-white transition-all border border-slate-100"
        >
          <Share2 size={16} /> Bagikan Portal
        </button>
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-edu-yellow flex items-center justify-center border-2 border-white overflow-hidden">
            {teacherProfile.photo ? <img src={teacherProfile.photo} className="w-full h-full object-cover" /> : <User size={24} className="text-edu-dark" />}
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-black text-edu-dark leading-none">{teacherProfile.fullName}</span>
            <span className="text-[9px] text-edu-secondary font-bold mt-1.5 uppercase tracking-widest italic">{teacherProfile.jabatan || teacherProfile.role}</span>
          </div>
        </div>
        <button onClick={onLogout} className="w-12 h-12 rounded-2xl bg-edu-pink-light/20 text-edu-secondary flex items-center justify-center hover:bg-edu-secondary hover:text-white transition-all shadow-sm">
          <LogOut size={22} />
        </button>
      </div>
    </header>
  );
};
