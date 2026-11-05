import React, { useState, useEffect } from 'react';

const SiamNavbar = ({ currentUser, onLogout }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
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

  const formatClock = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' WIB';
  };

  return (
    <nav className="siam-navbar">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo & School Identity */}
          <div className="d-flex align-items-center gap-3">
            <div className="brand-crest">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h1 className="h6 fw-bold mb-0 text-dark">SIAM</h1>
                <span className="badge bg-success-subtle text-success px-2 py-0.5 rounded-pill" style={{ fontSize: '0.65rem' }}>
                  SMK MAWADDAH
                </span>
              </div>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                SMK Mawaddah Palengaan • Pamekasan
              </small>
            </div>
          </div>

          {/* Clock Widget */}
          <div className="d-none d-md-flex align-items-center gap-2 bg-light px-3 py-1.5 rounded-pill border">
            <span className="badge bg-success rounded-circle p-1" style={{ width: '8px', height: '8px' }}></span>
            <span className="small fw-semibold text-secondary">{formatDate(time)}</span>
            <span className="text-muted">•</span>
            <span className="small font-monospace fw-bold text-dark">{formatClock(time)}</span>
          </div>

          {/* User Session Info or Login Status */}
          <div>
            {currentUser ? (
              <div className="d-flex align-items-center gap-3">
                <div className="text-end d-none d-sm-block">
                  <div className="fw-bold small text-dark leading-tight">{currentUser.full_name}</div>
                  <span className="badge bg-success text-white text-uppercase" style={{ fontSize: '0.65rem' }}>
                    {currentUser.role}
                  </span>
                </div>
                <button 
                  onClick={onLogout}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                  style={{ fontSize: '0.78rem' }}
                >
                  Keluar
                </button>
              </div>
            ) : (
              <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill small">
                Portal Akses Pengguna
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SiamNavbar;
