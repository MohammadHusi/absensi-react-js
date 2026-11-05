import React, { useState } from 'react';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Username dan kata sandi wajib diisi.');
      return;
    }
    setErrorMsg('');
    onLogin(username, password);
  };

  const handleQuickDemo = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
    onLogin(u, p);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="siam-card p-4 p-md-5">
            
            {/* Header */}
            <div className="text-center mb-4">
              <div 
                className="brand-crest mx-auto mb-3"
                style={{ width: '64px', height: '64px', borderRadius: '18px' }}
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <h2 className="h4 fw-bold text-dark mb-1">Masuk ke Portal SIAM</h2>
              <p className="text-muted small">
                Sistem Informasi Absensi Sekolah<br />
                <strong className="text-success">SMK Mawaddah Palengaan</strong>
              </p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 small mb-3">
                {errorMsg}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary text-uppercase">
                  Username / NISN
                </label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="admin / guru.ahmad / 0061234567"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary text-uppercase">
                  Kata Sandi
                </label>
                <input 
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-emerald w-100 justify-content-center py-2.5 rounded-3 fw-bold"
              >
                <span>Masuk Sekarang</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </form>

            {/* Quick 1-Click Demo Section */}
            <div className="pt-3 border-top">
              <div className="text-center small text-muted fw-bold text-uppercase mb-2" style={{ fontSize: '0.72rem' }}>
                Pilih Akun Demo untuk Langsung Masuk:
              </div>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm text-start py-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                  onClick={() => handleQuickDemo('admin', 'admin123')}
                >
                  <div>
                    <span className="fw-bold d-block">👑 Masuk sebagai Administrator</span>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Master Data, Dashboard, & Rekapitulasi</small>
                  </div>
                  <span className="badge bg-success-subtle text-success">Login →</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm text-start py-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                  onClick={() => handleQuickDemo('guru.ahmad', 'guru123')}
                >
                  <div>
                    <span className="fw-bold d-block">👨‍🏫 Masuk sebagai Guru (Ahmad Baihaqi)</span>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Checklist Absensi Per Kelas & Tombol Hadir Semua</small>
                  </div>
                  <span className="badge bg-primary-subtle text-primary">Login →</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm text-start py-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                  onClick={() => handleQuickDemo('0061234567', 'murid123')}
                >
                  <div>
                    <span className="fw-bold d-block">🎓 Masuk sebagai Siswa (Zainal Arifin)</span>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Statistik Kehadiran Pribadi & Form Izin Mandiri</small>
                  </div>
                  <span className="badge bg-secondary-subtle text-secondary">Login →</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
