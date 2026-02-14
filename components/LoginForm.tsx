
import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { GAS_WEB_APP_URL } from '../config';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: (user: {username: string, email: string}) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'login',
          username: formData.username,
          password: formData.password
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'Login gagal.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal terhubung ke sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3">
        <h2 className="text-3xl font-black text-edu-dark tracking-tight uppercase">Masuk Akun</h2>
        <p className="text-slate-400 text-sm font-medium">Sinkronisasi data pengajar Anda sekarang.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <label className="text-[10px] font-black text-edu-secondary uppercase tracking-[0.2em] px-2">Kata Sandi</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-edu-primary transition-colors" />
            <input 
              required
              type={showPassword ? "text" : "password"} 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-edu-dark font-bold focus:outline-none focus:border-edu-primary shadow-inner transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-edu-dark transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] text-rose-500 font-black text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        <button 
          disabled={loading}
          type="submit" 
          className="w-full py-5 bg-edu-primary hover:bg-edu-dark disabled:bg-slate-300 transition-all rounded-[2rem] font-black text-white uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-edu-primary/20"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" size={22} /> : "Konfirmasi Masuk"}
        </button>
      </form>

      <p className="text-center text-xs font-bold text-slate-400">
        Belum punya akses? <button onClick={onSwitchToRegister} className="text-edu-secondary font-black hover:underline uppercase tracking-widest ml-1">Mendaftar Akun</button>
      </p>
    </div>
  );
};
