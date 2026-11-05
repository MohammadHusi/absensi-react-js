import React, { useState, useEffect } from 'react';

const HeroSection = ({ onOpenAttendance, onOpenGuide }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatHours = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getAttendanceStatus = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const currentTimeVal = hours * 60 + minutes;

    // 06:30 to 07:15 (Tepat Waktu)
    if (currentTimeVal >= 390 && currentTimeVal <= 435) {
      return {
        badge: 'Presensi Pagi Aktif',
        text: 'Waktu Tepat: 06.30 - 07.15 WIB',
        color: 'success',
      };
    } else if (currentTimeVal > 435 && currentTimeVal <= 480) {
      return {
        badge: 'Dispensasi Terlambat',
        text: '07.15 - 08.00 WIB (Kategori Terlambat)',
        color: 'warning',
      };
    } else if (currentTimeVal > 480 && currentTimeVal < 930) {
      return {
        badge: 'KBM Sedang Berlangsung',
        text: 'Presensi Pagi Ditutup',
        color: 'info',
      };
    } else {
      return {
        badge: 'Presensi Pulang / Standby',
        text: 'Jam Pulang: 15.30 WIB',
        color: 'primary',
      };
    }
  };

  const currentStatus = getAttendanceStatus();

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column: Welcome Message */}
          <div className="col-lg-7">
            <div className="hero-pill-badge">
              <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">SMK BISA-HEBAT</span>
              <span>Portal Resmi Presensi & Absensi Siswa</span>
            </div>

            <h1 className="hero-title">
              Selamat Datang di <span className="text-gradient">Presensi Digital</span> SMK Negeri
            </h1>

            <p className="hero-description">
              Platform kehadiran cerdas yang dirancang untuk mempermudah pencatatan presensi siswa, 
              guru, dan staf secara real-time. Dilengkapi verifikasi barcode/QR, identitas NISN, 
              serta pemantauan kedisiplinan otomatis.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <button 
                className="btn-primary-gradient" 
                onClick={onOpenAttendance}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                Lakukan Presensi Cepat
              </button>

              <button 
                className="btn-secondary-glass"
                onClick={onOpenGuide}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                Panduan Siswa & Guru
              </button>
            </div>

            {/* Feature Highlights Pills */}
            <div className="d-flex flex-wrap gap-3 pt-2">
              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.85rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Akumulasi Real-Time</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.85rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Dukungan Barcode & NISN</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.85rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Terhubung ke Dapodik</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Operational Clock & Schedule Card */}
          <div className="col-lg-5">
            <div className="operational-card">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-light text-dark border px-3 py-2 fw-bold" style={{ fontSize: '0.8rem' }}>
                  🕒 WAKTU SERVER PRESENSI
                </span>
                <span className={`badge bg-${currentStatus.color}-subtle text-${currentStatus.color} px-3 py-2 fw-bold`}>
                  ● {currentStatus.badge}
                </span>
              </div>

              <div className="text-center py-2">
                <div className="clock-display-large mb-1">{formatHours(time)}</div>
                <div className="text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>
                  Waktu Indonesia Barat (WIB)
                </div>
              </div>

              {/* Schedule Timeline items */}
              <div className="schedule-timeline">
                <div className="schedule-item active">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary text-white p-2 rounded-circle">1</span>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Sesi Presensi Masuk</div>
                      <div className="text-muted" style={{ fontSize: '0.78rem' }}>Gerbang Utama & Lab Komputer</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-primary-subtle text-primary fw-bold">06.30 - 07.15 WIB</span>
                  </div>
                </div>

                <div className="schedule-item">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-secondary text-white p-2 rounded-circle">2</span>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Kegiatan Belajar (KBM)</div>
                      <div className="text-muted" style={{ fontSize: '0.78rem' }}>Presensi Per Mata Pelajaran</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-secondary-subtle text-secondary fw-bold">07.15 - 15.30 WIB</span>
                  </div>
                </div>

                <div className="schedule-item">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success text-white p-2 rounded-circle">3</span>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Sesi Presensi Pulang</div>
                      <div className="text-muted" style={{ fontSize: '0.78rem' }}>Tap Kartu Selesai KBM</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success-subtle text-success fw-bold">15.30 - 16.30 WIB</span>
                  </div>
                </div>
              </div>

              {/* Quick Prompt Button inside card */}
              <div className="mt-3 pt-3 border-top d-flex align-items-center justify-content-between">
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Belum absen hari ini?
                </span>
                <button
                  className="btn btn-sm btn-outline-primary fw-bold rounded-pill px-3"
                  onClick={onOpenAttendance}
                >
                  Presensi Cepat →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
