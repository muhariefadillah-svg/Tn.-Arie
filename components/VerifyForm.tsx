
import React, { useState } from 'react';
import { ShieldAlert, Loader2, RefreshCw } from 'lucide-react';
import { GAS_WEB_APP_URL } from '../config';

interface VerifyFormProps {
  email: string;
  onVerified: () => void;
}

export const VerifyForm: React.FC<VerifyFormProps> = ({ email, onVerified }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Kode verifikasi harus 6 digit.');
      return;
    }

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
          action: 'verify',
          email: email,
          code: code
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => onVerified(), 2000);
      } else {
        setError(result.message || 'Kode verifikasi salah.');
      }
    } catch (err) {
      setError('Gagal verifikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in zoom-in duration-300">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-edu-pink-light/30 text-edu-secondary rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
          <ShieldAlert size={40} />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-edu-dark tracking-tight uppercase">Verifikasi</h2>
          <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
            Masukkan kode 6-digit yang dikirim ke <br/>
            <span className="text-edu-primary font-black italic">{email}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleVerify} className="space-y-8">
        <div className="flex justify-center">
          <input 
            required
            type="text" 
            maxLength={6}
            placeholder="000000"
            className="w-56 text-center text-4xl tracking-[0.4em] font-black bg-slate-50 border-4 border-edu-pink-light/20 rounded-3xl py-6 text-edu-dark focus:outline-none focus:border-edu-secondary shadow-inner transition-all"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] text-rose-500 font-black text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-edu-secondary/10 border border-edu-secondary/20 rounded-2xl text-[11px] text-edu-secondary font-black text-center uppercase tracking-widest">
            Berhasil Terverifikasi!
          </div>
        )}

        <button 
          disabled={loading || success}
          type="submit" 
          className="w-full py-6 bg-edu-primary hover:bg-edu-dark disabled:bg-slate-300 transition-all rounded-[2.5rem] font-black text-white uppercase tracking-[0.4em] text-[11px] shadow-2xl shadow-edu-primary/20"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Verifikasi Kode"}
        </button>
      </form>

      <div className="text-center">
        <button className="text-[10px] text-edu-secondary font-black hover:underline flex items-center gap-2 mx-auto uppercase tracking-widest">
          <RefreshCw size={14} /> Kirim Ulang Kode
        </button>
      </div>
    </div>
  );
};
