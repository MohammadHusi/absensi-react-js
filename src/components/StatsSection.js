import React from 'react';

const StatsSection = ({ attendanceCount }) => {
  const stats = [
    {
      label: 'Tingkat Kehadiran',
      value: '98.2%',
      note: '+1.4% dibanding kemarin',
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: 'Siswa Hadir Hari Ini',
      value: `${1210 + attendanceCount} / 1.242`,
      note: '97.5% Siswa tepat waktu',
      iconBg: '#ecfdf5',
      iconColor: '#10b981',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      label: 'Pendidik & Staf',
      value: '58 / 58',
      note: '100% Mengajar lengkap',
      iconBg: '#f5f3ff',
      iconColor: '#7c3aed',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
    },
    {
      label: 'Izin & Sakit',
      value: '24 Siswa',
      note: 'Telah terverifikasi wali kelas',
      iconBg: '#fffbeb',
      iconColor: '#d97706',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <div className="row g-4">
        {stats.map((item, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card">
              <div 
                className="stats-icon-wrapper" 
                style={{ backgroundColor: item.iconBg, color: item.iconColor }}
              >
                {item.icon}
              </div>
              <div>
                <div className="stats-num">{item.value}</div>
                <div className="stats-label">{item.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                  {item.note}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
