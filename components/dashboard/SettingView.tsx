
import React from 'react';
import { Building2, Camera, UserCircle, User, Briefcase } from 'lucide-react';
import { SchoolSettings, TeacherProfile } from './Types';

interface SettingViewProps {
  schoolSettings: SchoolSettings;
  setSchoolSettings: (s: SchoolSettings) => void;
  teacherProfile: TeacherProfile;
  setTeacherProfile: (t: TeacherProfile) => void;
  onLogoUpload: () => void;
  onPhotoUpload: () => void;
  onSave: () => void;
}

export const SettingView: React.FC<SettingViewProps> = ({ 
  schoolSettings, setSchoolSettings, teacherProfile, setTeacherProfile, onLogoUpload, onPhotoUpload, onSave 
}) => (
  <div className="max-w-5xl space-y-12 pb-20 animate-fade-in">
    <div className="space-y-1"><h2 className="text-4xl font-black text-edu-dark uppercase tracking-tight">Pengaturan</h2><p className="text-[11px] text-edu-secondary font-black uppercase tracking-[0.3em] italic">Profil & Identitas Sekolah</p></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Identitas Sekolah */}
      <div className="bg-white p-12 rounded-5xl shadow-sm border border-slate-100 space-y-8">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Building2 size={16} /> Identitas Sekolah</h3>
        <div className="space-y-6">
          <div className="flex items-center gap-6 pb-4 border-b border-slate-50">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 overflow-hidden border-2 border-white shadow-md relative group flex items-center justify-center">
              {schoolSettings.logo ? <img src={schoolSettings.logo} className="w-full h-full object-contain p-2" /> : <Building2 size={40} className="text-slate-200" />}
              <button onClick={onLogoUpload} className="absolute inset-0 bg-edu-dark/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Camera size={24} className="text-white" /></button>
            </div>
            <div className="flex flex-col"><p className="text-sm font-black text-edu-dark uppercase">Logo Institusi</p><p className="text-[10px] font-bold text-slate-300 uppercase mt-1">Ganti Logo (.PNG/.JPG)</p></div>
          </div>
          <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase tracking-widest px-2">Nama Instansi</label><input className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-black outline-none shadow-inner" value={schoolSettings.name} onChange={(e) => setSchoolSettings({...schoolSettings, name: e.target.value})} /></div>
          <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase tracking-widest px-2">Alamat Sekolah</label><textarea className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-bold shadow-inner outline-none resize-none" rows={2} value={schoolSettings.address} onChange={(e) => setSchoolSettings({...schoolSettings, address: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase tracking-widest px-2">Kepala Sekolah</label><input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-black shadow-inner" value={schoolSettings.principal} onChange={(e) => setSchoolSettings({...schoolSettings, principal: e.target.value})} /></div>
            <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase tracking-widest px-2">NIP Kepala</label><input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-mono font-bold shadow-inner" value={schoolSettings.principalNip} onChange={(e) => setSchoolSettings({...schoolSettings, principalNip: e.target.value})} /></div>
          </div>
        </div>
      </div>

      {/* Profil Pengajar */}
      <div className="bg-white p-12 rounded-5xl shadow-sm border border-slate-100 space-y-8">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><UserCircle size={16} /> Profil Pengajar</h3>
        <div className="space-y-6">
          <div className="flex items-center gap-6 pb-4 border-b border-slate-50">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 overflow-hidden border-2 border-white shadow-md relative group flex items-center justify-center">
              {teacherProfile.photo ? <img src={teacherProfile.photo} className="w-full h-full object-cover" /> : <User size={40} className="text-slate-200" />}
              <button onClick={onPhotoUpload} className="absolute inset-0 bg-edu-dark/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Camera size={24} className="text-white" /></button>
            </div>
            <div className="flex flex-col"><p className="text-sm font-black text-edu-dark uppercase">{teacherProfile.fullName}</p><p className="text-[10px] font-bold text-slate-300 uppercase mt-1">Ganti Foto (.JPG)</p></div>
          </div>
          <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase tracking-widest px-2">Nama Lengkap Guru</label><input className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-black shadow-inner" value={teacherProfile.fullName} onChange={(e) => setTeacherProfile({...teacherProfile, fullName: e.target.value})} /></div>
          <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase tracking-widest px-2">Jabatan / Role</label><input placeholder="Contoh: Guru Wali Kelas" className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-black shadow-inner outline-none" value={teacherProfile.jabatan || ''} onChange={(e) => setTeacherProfile({...teacherProfile, jabatan: e.target.value})} /></div>
          
          <div className="grid grid-cols-12 gap-4">
             <div className="col-span-4 space-y-2">
                <label className="text-[10px] font-black text-edu-secondary uppercase tracking-widest px-2">Jenis ID</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-black outline-none shadow-inner" value={teacherProfile.idType} onChange={(e)=>setTeacherProfile({...teacherProfile, idType: e.target.value})}>
                   <option value="NIP">NIP</option>
                   <option value="NIKKI">NIKKI</option>
                </select>
             </div>
             <div className="col-span-8 space-y-2">
                <label className="text-[10px] font-black text-edu-secondary uppercase tracking-widest px-2">Nomor Pegawai</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-mono font-bold shadow-inner" value={teacherProfile.idNumber} onChange={(e)=>setTeacherProfile({...teacherProfile, idNumber: e.target.value})} />
             </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-end"><button onClick={onSave} className="px-16 py-6 bg-edu-primary text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] shadow-2xl hover:scale-105 transition-all">SIMPAN PERUBAHAN</button></div>
  </div>
);
