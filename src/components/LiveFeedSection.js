import React, { useState } from 'react';

const LiveFeedSection = ({ liveRecords, onOpenAttendance }) => {
  const [selectedJurusan, setSelectedJurusan] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const jurusanList = [
    { code: 'ALL', name: 'Semua Jurusan' },
    { code: 'RPL', name: 'Rekayasa Perangkat Lunak (RPL)' },
    { code: 'TKJ', name: 'Teknik Komputer & Jaringan (TKJ)' },
    { code: 'DKV', name: 'Desain Komunikasi Visual (DKV)' },
    { code: 'TBSM', name: 'Teknik Sepeda Motor (TBSM)' },
  ];

  const filteredRecords = liveRecords.filter((item) => {
    const matchesJurusan = selectedJurusan === 'ALL' || item.jurusan === selectedJurusan;
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.nisn.includes(searchQuery) ||
                          item.kelas.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJurusan && matchesSearch;
  });

  return (
    <section className="container py-5">
      <div className="row g-4 align-items-start">
        {/* Left Side: Live Feed Stream */}
        <div className="col-lg-8">
          <div className="live-feed-card">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span className="status-pulse-dot"></span>
                  <h3 className="h5 fw-bold mb-0 text-dark">Live Presensi Kehadiran</h3>
                </div>
                <p className="text-muted small mb-0 mt-1">
                  Pembaruan otomatis dari mesin tap scanner & gerbang sekolah
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary fw-semibold rounded-pill px-3"
                  onClick={onOpenAttendance}
                >
                  + Uji Tap Kartu Demo
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="row g-2 mb-3">
              <div className="col-12 col-md-7">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light border-end-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 bg-light"
                    placeholder="Cari nama siswa, NISN, atau kelas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-5">
                <select 
                  className="form-select form-select-sm bg-light"
                  value={selectedJurusan}
                  onChange={(e) => setSelectedJurusan(e.target.value)}
                >
                  {jurusanList.map((j) => (
                    <option key={j.code} value={j.code}>{j.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attendance List */}
            <div className="live-feed-list" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {filteredRecords.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <p className="mb-1">Tidak ada data presensi yang sesuai kriteria.</p>
                  <small>Coba ubah kata kunci pencarian atau filter jurusan.</small>
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <div key={record.id} className="live-feed-item">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-circle">
                        {record.nama.charAt(0)}
                      </div>
                      <div>
                        <div className="fw-bold text-dark d-flex align-items-center gap-2">
                          <span>{record.nama}</span>
                          <span className="badge bg-light text-secondary border" style={{ fontSize: '0.7rem' }}>
                            {record.kelas}
                          </span>
                        </div>
                        <div className="text-muted small">
                          NISN: <span className="font-monospace">{record.nisn}</span> • {record.metode}
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <span className={`badge ${
                        record.status === 'Tepat Waktu' 
                          ? 'bg-success-subtle text-success' 
                          : record.status === 'Terlambat'
                          ? 'bg-warning-subtle text-warning'
                          : 'bg-primary-subtle text-primary'
                      } fw-bold px-2 py-1 mb-1 d-inline-block`} style={{ fontSize: '0.75rem' }}>
                        {record.status}
                      </span>
                      <div className="text-muted small font-monospace">
                        {record.waktu}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Jurusan Quick Overview & Guidance */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <h4 className="h6 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Distribusi Kehadiran Kompetensi Keahlian
            </h4>

            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between small fw-bold mb-1">
                  <span>Rekayasa Perangkat Lunak (RPL)</span>
                  <span className="text-primary">99.1%</span>
                </div>
                <div className="progress" style={{ height: '7px' }}>
                  <div className="progress-bar bg-primary" role="progressbar" style={{ width: '99.1%' }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small fw-bold mb-1">
                  <span>Teknik Komputer & Jaringan (TKJ)</span>
                  <span className="text-success">98.4%</span>
                </div>
                <div className="progress" style={{ height: '7px' }}>
                  <div className="progress-bar bg-success" role="progressbar" style={{ width: '98.4%' }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small fw-bold mb-1">
                  <span>Desain Komunikasi Visual (DKV)</span>
                  <span className="text-info">97.6%</span>
                </div>
                <div className="progress" style={{ height: '7px' }}>
                  <div className="progress-bar bg-info" role="progressbar" style={{ width: '97.6%' }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small fw-bold mb-1">
                  <span>Teknik Bisnis Sepeda Motor (TBSM)</span>
                  <span className="text-warning">96.8%</span>
                </div>
                <div className="progress" style={{ height: '7px' }}>
                  <div className="progress-bar bg-warning" role="progressbar" style={{ width: '96.8%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="card border-0 rounded-4 p-4 text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }}>
            <h5 className="fw-bold mb-2">Butuh Bantuan Presensi?</h5>
            <p className="small text-white-50 mb-3">
              Jika kartu pelajar rusak atau barcode tidak terbaca, hubungi petugas piket di Ruang Tata Usaha.
            </p>
            <div className="d-flex align-items-center justify-content-between">
              <span className="small fw-semibold">Hotline: (021) 789-0123</span>
              <span className="badge bg-white text-primary px-3 py-2 fw-bold">Piket TU</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveFeedSection;
