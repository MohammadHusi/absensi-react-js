import React from 'react';

const Sidebar = ({ currentView, onViewChange, isOpen, onCloseMobile, currentUser, onLogout }) => {
  const menuCategories = [
    {
      title: '',
      items: [
        {
          id: 'overview',
          label: 'Dashboard',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          ),
          badge: null
        }
      ]
    },
    {
      title: 'MENU UTAMA',
      items: [
        {
          id: 'input-absen',
          label: 'Input Absensi',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          ),
          badge: null
        },
        {
          id: 'jadwal',
          label: 'Jadwal Pelajaran',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          ),
          badge: null
        },
        {
          id: 'murid-portal',
          label: 'Portal Saya',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          ),
          badge: null
        },
        {
          id: 'rekap',
          label: 'Rekapitulasi',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          ),
          badge: null
        }
      ]
    },
    {
      title: 'DATA MASTER',
      items: [
        {
          id: 'students',
          label: 'Data Murid',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          ),
          badge: null
        },
        {
          id: 'teachers',
          label: 'Data Guru',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          ),
          badge: null
        },
        {
          id: 'admins',
          label: 'Data Admin',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          ),
          badge: null
        },

        {
          id: 'subjects',
          label: 'Data Mapel',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          ),
          badge: null
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`tailwind-sidebar ${isOpen ? '' : 'collapsed'}`}>
        
        {/* Top Brand Logo */}
        <div className="h-[70px] flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange(currentUser?.role === 'murid' ? 'murid-portal' : 'overview')}>
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <img 
                src={`${process.env.PUBLIC_URL}/logo-smk-mawaddah.png`} 
                alt="Logo SMK Mawaddah" 
                className="w-12 h-12 object-contain drop-shadow-sm hover:scale-105 transition-transform"
              />
            </div>
            <div className="sidebar-brand-text">
              <span className="font-extrabold text-slate-800 text-base tracking-tight block whitespace-nowrap">
                SMK Mawaddah
              </span>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5 whitespace-nowrap">Palengaan, Pamekasan</p>
            </div>
          </div>

          {/* Close for mobile */}
          <button 
            className="lg:hidden text-slate-400 hover:text-slate-600"
            onClick={onCloseMobile}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Nav List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {menuCategories
            .map(cat => {
              // Jika role adalah murid, sembunyikan Data Murid, Data Guru, Data Admin, Data Mapel, Input Absen, dan Rekapitulasi
              if (currentUser?.role === 'murid') {
                const filteredItems = cat.items.filter(item => 
                  item.id !== 'students' && 
                  item.id !== 'teachers' && 
                  item.id !== 'admins' &&
                  item.id !== 'subjects' &&
                  item.id !== 'input-absen' &&
                  item.id !== 'rekap'
                );
                return { ...cat, items: filteredItems };
              }
              // Jika role adalah guru, sembunyikan Data Admin
              if (currentUser?.role === 'guru') {
                const filteredItems = cat.items.filter(item => item.id !== 'admins');
                return { ...cat, items: filteredItems };
              }
              return cat;
            })
            .filter(cat => cat.items.length > 0)
            .map((cat, idx) => (
            <div key={idx}>
              {cat.title ? (
                <div className="sidebar-category-title text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2 whitespace-nowrap">
                  {cat.title}
                </div>
              ) : null}
              <div className="space-y-1">
                {cat.items.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onViewChange(item.id);
                        if (window.innerWidth < 1024) onCloseMobile();
                      }}
                      title={item.label}
                      className={`sidebar-item-btn ${isActive ? 'active' : ''}`}
                    >
                      <span className={`sidebar-item-icon ${isActive ? 'text-white' : 'text-slate-500'}`}>
                        {item.icon}
                      </span>
                      <span className="sidebar-item-label truncate flex-1 text-left whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span className={`sidebar-item-badge text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badge === 'Live' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer Profile Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#5d87ff] font-bold flex items-center justify-center text-xs flex-shrink-0">
                {currentUser?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="sidebar-user-text overflow-hidden">
                <div className="text-xs font-bold text-slate-800 truncate leading-tight whitespace-nowrap">
                  {currentUser?.full_name || 'Admin Mawaddah'}
                </div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase whitespace-nowrap">
                  {currentUser?.role || 'Admin'}
                </span>
              </div>
            </div>

            <button 
              onClick={onLogout}
              title="Keluar / Ganti Akun"
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
