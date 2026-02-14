
export interface SchoolSettings {
  name: string;
  address: string;
  principal: string;
  principalNip: string;
  logo: string;
}

export interface TeacherProfile {
  fullName: string;
  role: string;
  jabatan: string;
  idType: string;
  idNumber: string;
  photo: string;
}

export interface Student {
  id: number;
  nis: string;
  name: string;
  gender: string;
  class: string;
  performance: number[];
  attendance: { S: number; I: number; A: number };
  dailyAttendance: Record<string, string>;
}

export interface Subject {
  id: number;
  name: string;
  jenjang: string;
  fase: string;
  class: string;
  kktp: number;
}

export interface Journal {
  id: number;
  date: string;
  jamPelajaran: string;
  waktuDari: string;
  waktuSampai: string;
  mapel: string;
  kelas: string;
  capaian: string;
}

export interface ModulAjar {
  id: string;
  subject: string;
  topic: string;
  grade: string;
  fase: string;
  duration: string;
  content: string;
  createdAt: string;
}
