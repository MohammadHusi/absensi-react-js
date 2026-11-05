import React from 'react';

const RoleCards = ({ onSelectRole }) => {
  const roles = [
    {
      id: 'siswa',
      badge: 'PORTAL SISWA',
      badgeClass: 'bg-primary-subtle text-primary',
      title: 'Presensi Siswa',
      desc: 'Lakukan absensi masuk/pulang harian, cek riwayat kehadiran, dan pantau persentase absensi syarat ujian.',
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
      features: [
        'Presensi dengan NISN & QR Code',
        'Cek persentase syarat kelulusan',
        'Pengajuan izin sakit dengan surat dokter',
      ],
      btnText: 'Masuk Sebagai Siswa',
      btnBg: '#2563eb',
    },
    {
      id: 'guru',
      badge: 'GURU & TENDIK',
      badgeClass: 'bg-indigo-subtle text-indigo',
      title: 'Presensi Guru & Jurnal',
      desc: 'Pencatatan jam kerja pendidik, verifikasi kehadiran siswa di kelas per mata pelajaran, dan pengisian jurnal KBM.',
      iconBg: '#eef2ff',
      iconColor: '#4f46e5',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      features: [
        'Absensi mata pelajaran real-time',
        'Input jurnal kegiatan pembelajaran',
        'Rekap kehadiran kelas per semester',
      ],
      btnText: 'Portal Guru & Staf',
      btnBg: '#4f46e5',
    },
    {
      id: 'orangtua',
      badge: 'ORANG TUA / WALI',
      badgeClass: 'bg-emerald-subtle text-success',
      title: 'Pantau Anak (Wali)',
      desc: 'Transparansi kehadiran siswa untuk orang tua murid. Pantau jam kedatangan dan kepulangan anak di sekolah.',
      iconBg: '#ecfdf5',
      iconColor: '#10b981',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      features: [
        'Notifikasi kedatangan real-time',
        'Rekap riwayat keterlambatan',
        'Komunikasi langsung ke Wali Kelas',
      ],
      btnText: 'Portal Orang Tua',
      btnBg: '#10b981',
    },
    {
      id: 'admin',
      badge: 'ADMINISTRATOR',
      badgeClass: 'bg-amber-subtle text-warning',
      title: 'Manajemen & Rekap',
      desc: 'Pusat kontrol absensi sekolah, ekspor laporan rekapitulasi kehadiran format Excel/PDF untuk sinkronisasi Dapodik.',
      iconBg: '#fffbeb',
      iconColor: '#d97706',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
      features: [
        'Ekspor rekapitulasi Dapodik resmi',
        'Pengaturan jam toleransi & libur',
        'Manajemen data siswa & jurusan',
      ],
      btnText: 'Panel Admin & TU',
      btnBg: '#f59e0b',
    },
  ];

  return (
    <section className="container py-5" id="layanan">
      <div className="section-heading-wrapper">
        <span className="section-tag">AKSES TERPADU</span>
        <h2 className="section-title">Pilih Portal Berdasarkan Peran Anda</h2>
        <p className="section-subtitle">
          Sistem Presensi SMK mendukung kolaborasi multi-pengguna antara siswa, guru pengajar, orang tua, dan tata usaha.
        </p>
      </div>

      <div className="row g-4">
        {roles.map((role) => (
          <div key={role.id} className="col-12 col-md-6 col-lg-3">
            <div className="role-card" onClick={() => onSelectRole(role.id)}>
              <span className={`role-badge ${role.badgeClass}`}>
                {role.badge}
              </span>

              <div 
                className="role-icon-box"
                style={{ backgroundColor: role.iconBg, color: role.iconColor }}
              >
                {role.icon}
              </div>

              <h3 className="role-card-title">{role.title}</h3>
              <p className="role-card-desc">{role.desc}</p>

              <ul className="role-features-list">
                {role.features.map((feature, fIndex) => (
                  <li key={fIndex}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className="role-action-btn text-white mt-auto"
                style={{ backgroundColor: role.btnBg }}
              >
                <span>{role.btnText}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoleCards;
