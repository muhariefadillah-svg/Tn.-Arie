
import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { VerifyForm } from './components/VerifyForm';
import { Dashboard } from './components/Dashboard';
import { ShieldCheck } from 'lucide-react';

type AuthView = 'login' | 'register' | 'verify';

const App: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{username: string, email: string} | null>(null);
  const [registrationEmail, setRegistrationEmail] = useState('');

  const handleLoginSuccess = (userData: {username: string, email: string}) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleRegisterSuccess = (email: string) => {
    setRegistrationEmail(email);
    setView('verify');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setView('login');
  };

  if (isLoggedIn) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-edu-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-edu-pink-light/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-edu-yellow/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-5 bg-edu-primary rounded-[2rem] mb-5 shadow-2xl shadow-edu-primary/20">
            <ShieldCheck className="text-white w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-edu-dark tracking-tighter">
            Portal Guru <span className="text-edu-secondary">Digital</span>
          </h1>
          <p className="text-slate-400 mt-3 text-sm font-bold uppercase tracking-widest">
            Manajemen Edukasi Terpadu
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-5xl p-10 shadow-2xl transition-all duration-500">
          {view === 'login' && (
            <LoginForm 
              onSwitchToRegister={() => setView('register')} 
              onLoginSuccess={handleLoginSuccess}
            />
          )}
          {view === 'register' && (
            <RegisterForm 
              onSwitchToLogin={() => setView('login')} 
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}
          {view === 'verify' && (
            <VerifyForm 
              email={registrationEmail} 
              onVerified={() => setView('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
