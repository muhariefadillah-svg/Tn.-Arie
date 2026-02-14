
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Sidebar, Header } from './dashboard/Layout';
import { AttendanceView } from './dashboard/AttendanceView';
import { HomeView, MuridView, MapelView, NilaiView, PerformaView, JurnalView } from './dashboard/MainViews';
import { ModulAjarView } from './dashboard/ModulAjarView';
import { SettingView } from './dashboard/SettingView';
import { StudentModal, SubjectModal, JournalModal } from './dashboard/Modals';
import { SchoolSettings, TeacherProfile, Student, Subject, Journal, ModulAjar } from './dashboard/Types';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [progress, setProgress] = useState<{show: boolean, msg: string}>({show: false, msg: ''});
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [filterClass, setFilterClass] = useState('Semua');
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  const load = <T,>(key: string, def: T): T => {
    const saved = localStorage.getItem(key);
    try { return saved ? (JSON.parse(saved) as T) : def; } catch { return def; }
  };

  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => load<SchoolSettings>('schoolSettings', {
    name: 'Portal Guru Digital', address: 'Jl. Raya Pendidikan No. 123', principal: 'Dr. Ahmad Subarjo, M.Pd', principalNip: '19760512 200501 1 004', logo: ''
  }));
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => load<TeacherProfile>('teacherProfile', {
    fullName: user?.username || 'Budi Santoso', role: 'Guru Wali Kelas', jabatan: 'Guru Wali Kelas', idType: 'NIP', idNumber: '19880101 201501 1 001', photo: ''
  }));
  const [students, setStudents] = useState<Student[]>(() => load<Student[]>('students', [
    { id: 1, nis: '1001', name: 'Budi Santoso', gender: 'L', class: 'X-RPL', performance: [70, 75, 80, 85, 90], attendance: { S: 0, I: 1, A: 0 }, dailyAttendance: {} },
  ]));
  const [subjects, setSubjects] = useState<Subject[]>(() => load<Subject[]>('subjects', [
    { id: 1, name: 'Matematika', jenjang: 'SMA', fase: 'E', class: 'X-RPL', kktp: 75 },
  ]));
  const [journals, setJournals] = useState<Journal[]>(() => load<Journal[]>('journals', []));
  const [savedModuls, setSavedModuls] = useState<ModulAjar[]>(() => load<ModulAjar[]>('savedModuls', []));

  useEffect(() => localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings)), [schoolSettings]);
  useEffect(() => localStorage.setItem('teacherProfile', JSON.stringify(teacherProfile)), [teacherProfile]);
  useEffect(() => localStorage.setItem('students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('subjects', JSON.stringify(subjects)), [subjects]);
  useEffect(() => localStorage.setItem('journals', JSON.stringify(journals)), [journals]);
  useEffect(() => localStorage.setItem('savedModuls', JSON.stringify(savedModuls)), [savedModuls]);

  const showNotif = (msg: string) => {
    setProgress({ show: true, msg });
    setTimeout(() => setProgress({ show: false, msg: '' }), 2000);
  };

  const handleFileUpload = (e: any, setter: any, field: string, currentState: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setter({ ...currentState, [field]: reader.result as string }); showNotif("File diperbarui"); };
      reader.readAsDataURL(file);
    }
  };

  const handleRestore = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.schoolSettings) setSchoolSettings(data.schoolSettings);
        if (data.teacherProfile) setTeacherProfile(data.teacherProfile);
        if (data.students) setStudents(data.students);
        if (data.subjects) setSubjects(data.subjects);
        if (data.journals) setJournals(data.journals);
        if (data.savedModuls) setSavedModuls(data.savedModuls);
        showNotif("Database direstore");
      } catch { alert("File tidak valid."); }
    };
    reader.readAsText(file);
  };

  const printPDF = (type: 'nilai' | 'absen' | 'performa') => {
    const isAbsen = type === 'absen';
    const isPerforma = type === 'performa';
    const doc = new jsPDF({
      orientation: (isAbsen || isPerforma) ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.setTextColor(0, 79, 45); 
    doc.text(schoolSettings.name.toUpperCase(), pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(schoolSettings.address, pageWidth / 2, 21, { align: 'center' });
    doc.setDrawColor(0, 79, 45);
    doc.setLineWidth(0.5);
    doc.line(15, 24, pageWidth - 15, 24);

    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    let title = isAbsen ? "REKAP ABSENSI HARIAN" : isPerforma ? "ANALISIS PERFORMA SISWA" : "LAPORAN HASIL NILAI";
    doc.text(`${title} - KELAS ${filterClass}`, pageWidth / 2, 34, { align: 'center' });
    
    let head, body;
    if (isAbsen) {
      head = [['NO', 'NAMA SISWA', 'NIS', 'S', 'I', 'A']];
      body = filteredStudents.map((s, i) => {
        let s_count = 0, i_count = 0, a_count = 0;
        Object.keys(s.dailyAttendance).forEach(key => {
          if (key.startsWith(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`)) {
            const v = s.dailyAttendance[key];
            if(v === 'S') s_count++;
            if(v === 'I') i_count++;
            if(v === 'A') a_count++;
          }
        });
        return [i+1, s.name, s.nis, s_count, i_count, a_count];
      });
    } else if (isPerforma) {
      head = [['NO', 'NAMA SISWA', 'NIS', 'RATA-RATA', 'STATUS']];
      body = filteredStudents.map((s, i) => {
        const avg = s.performance.reduce((a,b)=>a+b,0)/5;
        return [i+1, s.name, s.nis, avg.toFixed(1), avg >= 75 ? 'TUNTAS' : 'REMIDI'];
      });
    } else {
      head = [['NO', 'NAMA SISWA', 'NIS', 'NH1', 'NH2', 'NH3', 'ATS', 'SAS', 'RATA']];
      body = filteredStudents.map((s, i) => [i+1, s.name, s.nis, ...s.performance, (s.performance.reduce((a,b)=>a+b,0)/5).toFixed(1)]);
    }

    autoTable(doc, {
      startY: 40,
      head: head as any,
      body: body as any,
      theme: 'grid',
      headStyles: { fillColor: [0, 79, 45] },
      didDrawPage: (data) => {
        const finalY = data.cursor?.y || 150;
        const pageHeight = doc.internal.pageSize.getHeight();
        const startSignY = Math.min(finalY + 15, pageHeight - 50);
        
        doc.setFontSize(10);
        doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 15, pageHeight - 10);

        const signY = startSignY;
        doc.text("Mengetahui,", 30, signY);
        doc.text("Kepala Sekolah,", 30, signY + 5);
        doc.text(schoolSettings.principal, 30, signY + 25);
        doc.text(`NIP. ${schoolSettings.principalNip}`, 30, signY + 30);

        const guruX = pageWidth - 80;
        doc.text("Disusun Oleh,", guruX, signY);
        doc.text("Guru Pengajar,", guruX, signY + 5);
        doc.text(teacherProfile.fullName, guruX, signY + 25);
        doc.text(`${teacherProfile.idType}. ${teacherProfile.idNumber}`, guruX, signY + 30);
      }
    });
    doc.save(`Laporan_${type}_${filterClass}.pdf`);
  };

  const filteredStudents = filterClass === 'Semua' ? students : students.filter(s => s.class === filterClass);
  const availableClasses = ['Semua', ...Array.from(new Set(students.map(s => s.class)))];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-poppins text-slate-700">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} schoolSettings={schoolSettings} teacherProfile={teacherProfile} onLogout={onLogout} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} schoolSettings={schoolSettings} teacherProfile={teacherProfile} onLogout={onLogout} />

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
          {progress.show && (
            <div className="fixed top-6 right-6 z-[100] bg-edu-secondary text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-[11px] uppercase tracking-widest border border-white/20 animate-bounce">
              <CheckCircle2 size={18} /> {progress.msg}
            </div>
          )}

          {activeTab === 'home' && <HomeView teacherProfile={teacherProfile} onBackup={() => {
            const data = { schoolSettings, teacherProfile, students, subjects, journals, savedModuls };
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup_${Date.now()}.json`; a.click();
            showNotif("Backup diunduh");
          }} onRestore={() => restoreInputRef.current?.click()} setActiveTab={setActiveTab} />}

          {activeTab === 'murid' && <MuridView students={students} onAdd={() => setShowStudentModal(true)} onDelete={(id) => { setStudents(students.filter(s=>s.id!==id)); showNotif("Data dihapus"); }} onImportStudents={(newList) => { setStudents([...students, ...newList]); showNotif("Data berhasil diimport"); }} />}

          {activeTab === 'mapel' && <MapelView subjects={subjects} onAdd={() => setShowSubjectModal(true)} onDelete={(id) => { setSubjects(subjects.filter(s=>s.id!==id)); showNotif("Data dihapus"); }} />}

          {activeTab === 'absen' && <AttendanceView 
            students={filteredStudents} 
            filterClass={filterClass} 
            setFilterClass={setFilterClass} 
            availableClasses={availableClasses} 
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            onAttendanceChange={(id, dateStr, val) => {
              setStudents(prev => prev.map(s => {
                if (s.id === id) {
                  const newDaily = { ...s.dailyAttendance, [dateStr]: val.toUpperCase() };
                  let sc=0, ic=0, ac=0; 
                  Object.values(newDaily).forEach(v => { if(v==='S')sc++; if(v==='I')ic++; if(v==='A')ac++; });
                  return { ...s, dailyAttendance: newDaily, attendance: { S: sc, I: ic, A: ac } };
                } return s;
              }));
            }} onExportExcel={() => { 
              const data = filteredStudents.map(s => {
                 let s_c = 0, i_c = 0, a_c = 0;
                 Object.keys(s.dailyAttendance).forEach(k => {
                   if(k.startsWith(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`)) {
                     const v = s.dailyAttendance[k];
                     if(v==='S') s_c++; if(v==='I') i_c++; if(v==='A') a_c++;
                   }
                 });
                 return { Nama: s.name, NIS: s.nis, Sakit: s_c, Izin: i_c, Alpa: a_c };
              });
              const ws = XLSX.utils.json_to_sheet(data);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Absen");
              XLSX.writeFile(wb, `Absensi_${filterClass}_${selectedMonth}_${selectedYear}.xlsx`);
              showNotif("Excel diunduh"); 
            }} onPrintPDF={() => printPDF('absen')} onSave={() => showNotif("Data disimpan")} />}

          {activeTab === 'modul' && <ModulAjarView 
            savedModuls={savedModuls} 
            onSaveModul={(m) => { setSavedModuls([m, ...savedModuls]); showNotif("Modul disimpan"); }} 
            onDeleteModul={(id) => { setSavedModuls(savedModuls.filter(m=>m.id!==id)); showNotif("Modul dihapus"); }}
          />}

          {activeTab === 'nilai' && <NilaiView students={filteredStudents} filterClass={filterClass} setFilterClass={setFilterClass} availableClasses={availableClasses} onSave={() => showNotif("Nilai disimpan")} onPrint={()=>printPDF('nilai')} onExport={()=>{
             const data = filteredStudents.map(s => ({ Nama: s.name, NIS: s.nis, NH1: s.performance[0], NH2: s.performance[1], NH3: s.performance[2], ATS: s.performance[3], SAS: s.performance[4] }));
             const ws = XLSX.utils.json_to_sheet(data);
             const wb = XLSX.utils.book_new();
             XLSX.utils.book_append_sheet(wb, ws, "Nilai");
             XLSX.writeFile(wb, `Nilai_${filterClass}.xlsx`);
             showNotif("Excel diunduh");
          }} onValueChange={(id, i, val) => {
            setStudents(prev => prev.map(s => s.id === id ? { ...s, performance: s.performance.map((v, idx) => idx === i ? val : v) } : s));
          }} />}

          {activeTab === 'performa' && <PerformaView students={filteredStudents} filterClass={filterClass} setFilterClass={setFilterClass} availableClasses={availableClasses} onPrint={() => printPDF('performa')} />}

          {activeTab === 'jurnal' && <JurnalView journals={journals} onAdd={() => setShowJournalModal(true)} onDelete={(id) => { setJournals(journals.filter(j=>j.id!==id)); showNotif("Jurnal dihapus"); }} />}

          {activeTab === 'setting' && <SettingView schoolSettings={schoolSettings} setSchoolSettings={setSchoolSettings} teacherProfile={teacherProfile} setTeacherProfile={setTeacherProfile} onLogoUpload={() => logoInputRef.current?.click()} onPhotoUpload={() => photoInputRef.current?.click()} onSave={() => showNotif("Pengaturan disimpan")} />}
        </div>
      </main>

      <input ref={logoInputRef} type="file" className="hidden" accept="image/*" onChange={(e)=>handleFileUpload(e, setSchoolSettings, 'logo', schoolSettings)} />
      <input ref={photoInputRef} type="file" className="hidden" accept="image/*" onChange={(e)=>handleFileUpload(e, setTeacherProfile, 'photo', teacherProfile)} />
      <input ref={restoreInputRef} type="file" className="hidden" accept=".json" onChange={handleRestore} />

      {showStudentModal && <StudentModal onClose={()=>setShowStudentModal(false)} onSubmit={(d)=>{ setStudents([...students, { ...d, id: Date.now(), performance:[0,0,0,0,0], attendance:{S:0,I:0,A:0}, dailyAttendance:{} }]); setShowStudentModal(false); showNotif("Murid ditambah"); }} />}
      {showSubjectModal && <SubjectModal onClose={()=>setShowSubjectModal(false)} classes={availableClasses} onSubmit={(d)=>{ setSubjects([...subjects, { ...d, id: Date.now() }]); setShowSubjectModal(false); showNotif("Mapel ditambah"); }} />}
      {showJournalModal && <JournalModal onClose={()=>setShowJournalModal(false)} subjects={subjects} classes={availableClasses} onSubmit={(d)=>{ setJournals([{ ...d, id: Date.now() }, ...journals]); setShowJournalModal(false); showNotif("Jurnal ditambah"); }} />}
    </div>
  );
};
