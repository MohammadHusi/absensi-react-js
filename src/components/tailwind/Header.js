import React, { useState, useEffect } from 'react';

const Header = ({ onToggleSidebar, currentUser, onLogout, onChangeView }) => {
  const [time, setTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatClock = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' WIB';
  };

  return (
    <header className="tailwind-header justify-between">
      
      {/* Left: Hamburger Toggle */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="Toggle Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7"/>
          </svg>
        </button>
      </div>

      {/* Right: Clock, School Tag, Notification, & Profile */}
      <div className="flex items-center gap-3">
        
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-600">SMK Mawaddah</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono font-bold text-slate-800">{formatClock(time)}</span>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Notifikasi Presensi</span>
                <span className="text-[10px] bg-blue-50 text-[#5d87ff] px-2 py-0.5 rounded-full font-bold">2 Baru</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition">
                  <div className="font-bold text-slate-800">Presensi Kelas X TKJ Selesai</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">32 Siswa telah terverifikasi oleh Ahmad Baihaqi, S.Pd</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition">
                  <div className="font-bold text-slate-800">Pengajuan Izin Baru</div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Mohammad Zainal Arifin mengajukan izin sakit hari ini.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 p-1 pl-2 rounded-full hover:bg-slate-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5d87ff] to-[#49beff] text-white flex items-center justify-center text-xs font-bold shadow-sm">
              {currentUser?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden lg:block leading-tight pr-1">
              <div className="text-xs font-bold text-slate-800">{currentUser?.full_name || 'Admin'}</div>
              <span className="text-[10px] text-slate-400 capitalize">{currentUser?.role || 'User'}</span>
            </div>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
              <div className="p-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-800">{currentUser?.full_name}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser?.username || 'user@mawaddah'}</div>
                <span className="mt-1 inline-block text-[10px] bg-blue-50 text-[#5d87ff] px-2 py-0.5 rounded font-bold uppercase">
                  Peran: {currentUser?.role}
                </span>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => { onLogout(); setShowDropdown(false); }}
                  className="w-full text-left px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition"
                >
                  <span>🚪 Keluar Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default Header;
