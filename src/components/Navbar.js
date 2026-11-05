import React, { useState, useEffect } from 'react';

const Navbar = ({ onOpenAttendance, onOpenGuide }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' WIB';
  };

  return (
    <>
      {/* Top Notification / Ticker */}
      <div className="ticker-banner">
        <div className="container">
          <div className="d-flex align-items-center">
            <span className="badge bg-primary me-3 px-2 py-1" style={{ fontSize: '0.75rem' }}>
              PENGUMUMAN
            </span>
            <div className="ticker-content">
              <span>🔔 Jam batas presensi pagi: 07.15 WIB. Mohon seluruh siswa dan guru melakukan tap kartu / scan QR tepat waktu.</span>
              <span>📌 Presensi mata pelajaran diampu langsung oleh guru pengajar melalui aplikasi Presensi SMK.</span>
              <span>⭐ Tetap jaga kedisiplinan dan semangat belajar untuk mewujudkan SMK Bisa - SMK Hebat!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="custom-navbar">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            {/* Brand */}
            <div className="brand-wrapper">
              <div className="brand-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div>
                <h1 className="brand-title">PRESENSI SMK</h1>
                <p className="brand-subtitle">Sistem Absensi Digital Terpadu</p>
              </div>
            </div>

            {/* Center: Live Clock */}
            <div className="d-none d-lg-flex align-items-center gap-3">
              <div className="live-time-chip">
                <span className="status-pulse-dot"></span>
                <span>{formatDate(currentDateTime)}</span>
                <span style={{ color: '#94a3b8' }}>•</span>
                <span className="font-monospace fw-bold">{formatTime(currentDateTime)}</span>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-secondary btn-sm d-none d-md-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-semibold"
                onClick={onOpenGuide}
                style={{ fontSize: '0.85rem' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Panduan
              </button>

              <button
                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-bold shadow-sm"
                onClick={onOpenAttendance}
                style={{ fontSize: '0.85rem', background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <path d="m9 16 2 2 4-4"/>
                </svg>
                Presensi Sekarang
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
