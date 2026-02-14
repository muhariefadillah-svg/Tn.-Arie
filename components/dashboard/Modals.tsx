
import React from 'react';
import { X } from 'lucide-react';
import { Subject } from './Types';

interface ModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const StudentModal: React.FC<ModalProps> = ({ onClose, onSubmit }) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center bg-edu-dark/50 backdrop-blur-md p-6">
    <div className="bg-white rounded-5xl shadow-2xl w-full max-w-xl p-14 relative animate-fade-in border-4 border-edu-pink-light/20">
      <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-slate-50 rounded-2xl text-slate-300 hover:text-rose-500 transition-all"><X size={20} /></button>
      <h2 className="text-3xl font-black text-edu-dark uppercase tracking-tighter mb-8">Tambah Murid Baru</h2>
      <form onSubmit={(e:any)=>{
        e.preventDefault();
        const f = e.target;
        onSubmit({ nis: f.nis.value, name: f.nama.value, gender: f.gender.value, class: f.kelas.value });
      }} className="space-y-6">
        <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase px-2">NIS</label><input name="nis" required className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-bold shadow-inner" /></div>
        <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase px-2">Nama Murid</label><input name="nama" required className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-black shadow-inner" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase px-2">Gender</label><select name="gender" className="w-full bg-slate-50 border rounded-3xl p-5 text-xs font-black shadow-inner"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
          <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase px-2">Kelas</label><input name="kelas" required defaultValue="X-RPL" className="w-full bg-slate-50 border rounded-3xl p-5 text-xs font-black shadow-inner" /></div>
        </div>
        <button type="submit" className="w-full py-6 bg-edu-primary text-white rounded-[2rem] font-black uppercase text-[11px] shadow-2xl tracking-widest mt-4">Simpan Murid</button>
      </form>
    </div>
  </div>
);

export const SubjectModal: React.FC<ModalProps & { classes: string[] }> = ({ onClose, onSubmit, classes }) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center bg-edu-dark/50 backdrop-blur-md p-6">
    <div className="bg-white rounded-5xl shadow-2xl w-full max-w-xl p-14 relative animate-fade-in border-4 border-edu-pink-light/20">
      <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-slate-50 rounded-2xl text-slate-300 hover:text-rose-500 transition-all"><X size={20} /></button>
      <h2 className="text-3xl font-black text-edu-dark uppercase tracking-tighter mb-8">Mapel Baru</h2>
      <form onSubmit={(e:any)=>{
        e.preventDefault();
        const f = e.target;
        onSubmit({ name: f.name.value, jenjang: f.jenjang.value, fase: f.fase.value, class: f.kelas.value, kktp: Number(f.kktp.value) });
      }} className="space-y-5">
        <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase px-2">Nama Mapel</label><input name="name" required className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-sm font-black shadow-inner" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase px-2">Jenjang</label><select name="jenjang" className="w-full bg-slate-50 border rounded-3xl p-5 text-xs font-black"><option>SD</option><option>SMP</option><option>SMA</option><option>SMK</option></select></div>
          <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase px-2">Fase</label><select name="fase" className="w-full bg-slate-50 border rounded-3xl p-5 text-xs font-black"><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option></select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase px-2">Kelas</label><select name="kelas" className="w-full bg-slate-50 border rounded-3xl p-5 text-xs font-black">{classes.filter(c=>c!=='Semua').map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="space-y-2"><label className="text-[10px] font-black text-edu-secondary uppercase px-2">KKTP</label><input name="kktp" type="number" required defaultValue={70} className="w-full bg-slate-50 border rounded-3xl p-5 text-xs font-black shadow-inner" /></div>
        </div>
        <button type="submit" className="w-full py-6 bg-edu-secondary text-white rounded-[2rem] font-black uppercase text-[11px] shadow-2xl tracking-widest mt-4">Simpan Mapel</button>
      </form>
    </div>
  </div>
);

export const JournalModal: React.FC<ModalProps & { subjects: Subject[], classes: string[] }> = ({ onClose, onSubmit, subjects, classes }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-edu-dark/40 backdrop-blur-md p-6">
    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl p-12 relative max-h-[95vh] overflow-y-auto custom-scrollbar animate-fade-in border-4 border-edu-yellow/20">
      <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 bg-slate-50 rounded-2xl text-slate-300 flex items-center justify-center hover:text-rose-500 transition-all"><X size={24} /></button>
      <div className="space-y-10">
        <h2 className="text-4xl font-black text-edu-dark uppercase tracking-tight">Pelaporan Jurnal</h2>
        <form onSubmit={(e:any) => {
          e.preventDefault();
          const f = e.target;
          onSubmit({ date: f.date.value, jam: f.jam.value, dari: f.dari.value, sampai: f.sampai.value, mapel: f.mapel.value, kelas: f.kelas.value, capaian: f.capaian.value });
        }} className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4 space-y-2"><label className="text-[10px] uppercase px-3">Tanggal</label><input name="date" type="date" required className="w-full bg-slate-50 border rounded-2xl p-4 font-black" /></div>
            <div className="col-span-2 space-y-2"><label className="text-[10px] uppercase px-3">Jam Ke-</label><input name="jam" required className="w-full bg-slate-50 border rounded-2xl p-4 font-black" /></div>
            <div className="col-span-3 space-y-2"><label className="text-[10px] uppercase px-3">Dari</label><input name="dari" type="time" required className="w-full bg-slate-50 border rounded-2xl p-4 font-black" /></div>
            <div className="col-span-3 space-y-2"><label className="text-[10px] uppercase px-3">Sampai</label><input name="sampai" type="time" required className="w-full bg-slate-50 border rounded-2xl p-4 font-black" /></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-[10px] uppercase px-3">Mapel</label><select name="mapel" className="w-full bg-slate-50 border rounded-2xl p-4 font-black uppercase">{subjects.map(m=><option key={m.id}>{m.name}</option>)}</select></div>
            <div className="space-y-2"><label className="text-[10px] uppercase px-3">Kelas</label><select name="kelas" className="w-full bg-slate-50 border rounded-2xl p-4 font-black uppercase">{classes.filter(c=>c!=='Semua').map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="space-y-2"><label className="text-[10px] uppercase px-4">Ringkasan Materi</label><textarea name="capaian" rows={4} required className="w-full bg-slate-50 border rounded-[1.5rem] p-6 font-bold shadow-inner resize-none" /></div>
          <button type="submit" className="w-full py-6 bg-edu-dark text-edu-yellow font-black uppercase tracking-[0.4em] rounded-3xl text-[11px] shadow-2xl hover:bg-edu-primary hover:text-white">Simpan Jurnal</button>
        </form>
      </div>
    </div>
  </div>
);
