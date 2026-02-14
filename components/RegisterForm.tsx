
import React, { useState } from 'react';
import { Mail, User, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { GAS_WEB_APP_URL } from '../config';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: (email: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.endsWith('@gmail.com')) {
      setError('Mohon gunakan akun Gmail.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'register',
          email: formData.email,
          username: formData.username,
          password: formData.password
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        onRegisterSuccess(formData.email);
      } else {
        setError(result.message || 'Pendaftaran gagal.');
      }
    } catch (err) {
      setError('Gagal mendaftar. Periksa koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onSwitchToLogin} className="p-3 bg-slate-50 hover:bg-edu-pink-light/20 rounded-2xl transition-all text-slate-400">
          <ArrowLeft size={22} />
        </button>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-edu-dark tracking-tight uppercase">Daftar Akun</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Portal Guru Digital</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-edu-secondary uppercase tracking-[0.2em] px-2">Alamat Email (Gmail)</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-edu-primary transition-colors" />
            <input 
              required
              type="email" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-edu-dark font-bold focus:outline-none focus:border-edu-primary shadow-inner transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-edu-secondary uppercase tracking-[0.2em] px-2">Username</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-edu-primary transition-colors" />
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-edu-dark font-bold focus:outline-none focus:border-edu-primary shadow-inner transition-all"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-edu-secondary uppercase tracking-[0.2em] px-2">Kata Sandi Baru</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-edu-primary transition-colors" />
            <input 
              required
              type={showPassword ? "text" : "password"} 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-edu-dark font-bold focus:outline-none focus:border-edu-primary shadow-inner transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-edu-dark transition-colors">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] text-rose-500 font-black text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        <button disabled={loading} type="submit" className="w-full py-5 bg-edu-secondary hover:bg-edu-primary transition-all rounded-[2rem] font-black text-white uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-edu-secondary/20">
          {loading ? <Loader2 className="animate-spin mx-auto" size={22} /> : "Buat Akun Sekarang"}
        </button>
      </form>
    </div>
  );
};
