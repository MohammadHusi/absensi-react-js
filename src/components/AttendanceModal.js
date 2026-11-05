import React, { useState } from 'react';

const demoStudents = [
  { nama: 'Ahmad Rizky Pratama', nisn: '0068192031', kelas: 'XII RPL 1', jurusan: 'RPL', role: 'Siswa' },
  { nama: 'Siti Nurhaliza Putri', nisn: '0071452981', kelas: 'XI TKJ 2', jurusan: 'TKJ', role: 'Siswa' },
  { nama: 'Budi Santoso', nisn: '0059231882', kelas: 'XII TBSM 1', jurusan: 'TBSM', role: 'Siswa' },
  { nama: 'Devi Anggraini', nisn: '0072938104', kelas: 'X DKV 3', jurusan: 'DKV', role: 'Siswa' },
  { nama: 'Drs. Hendro Wibowo, M.Pd', nisn: '197508122005011002', kelas: 'Guru Matematika', jurusan: 'RPL', role: 'Guru' },
];

const AttendanceModal = ({ isOpen, onClose, onAddRecord }) => {
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'manual' | 'qr'
  const [nisnInput, setNisnInput] = useState('');
  const [namaInput, setNamaInput] = useState('');
  const [kelasInput, setKelasInput] = useState('XII RPL 1');
  const [jurusanInput, setJurusanInput] = useState('RPL');
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [successData, setSuccessData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  // Sound feedback using Web Audio API
  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio might be blocked by browser policy without user gesture
    }
  };

  const handleDemoSubmit = () => {
    const student = demoStudents[selectedDemoIndex];
    submitAttendance({
      nama: student.nama,
      nisn: student.nisn,
      kelas: student.kelas,
      jurusan: student.jurusan,
      metode: 'Tap Kartu Pelajar (RFID)',
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!nisnInput.trim() || !namaInput.trim()) {
      alert('Mohon isi NISN dan Nama lengkap!');
      return;
    }
    submitAttendance({
      nama: namaInput,
      nisn: nisnInput,
      kelas: kelasInput,
      jurusan: jurusanInput,
      metode: 'Input Manual NISN',
    });
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const student = demoStudents[Math.floor(Math.random() * demoStudents.length)];
      submitAttendance({
        nama: student.nama,
        nisn: student.nisn,
        kelas: student.kelas,
        jurusan: student.jurusan,
        metode: 'Scan Barcode QR',
      });
    }, 1200);
  };

  const submitAttendance = (info) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    
    // Status evaluation based on current minutes (for demo purposes)
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMin = hours * 60 + minutes;
    // Default to 'Tepat Waktu' or evaluate realistically
    const status = totalMin <= 435 ? 'Tepat Waktu' : totalMin <= 480 ? 'Terlambat' : 'Tepat Waktu';

    const newRecord = {
      id: Date.now(),
      nama: info.nama,
      nisn: info.nisn,
      kelas: info.kelas,
      jurusan: info.jurusan,
      waktu: timeStr,
      status: status,
      metode: info.metode,
    };

    playSuccessSound();
    setSuccessData(newRecord);
    onAddRecord(newRecord);
  };

  const handleReset = () => {
    setSuccessData(null);
    setNisnInput('');
    setNamaInput('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-custom">
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-white text-primary fw-bold" style={{ fontSize: '0.75rem' }}>
              PRESENSI MANDIRI
            </span>
            <span className="badge bg-success-subtle text-white border border-light" style={{ fontSize: '0.75rem' }}>
              ● Online
            </span>
          </div>
          <h3 className="h5 fw-bold mb-0">Loket Presensi Digital SMK</h3>
          <p className="small mb-0 text-white-50">
            Pencatatan absensi harian berbasis NISN dan identitas siswa
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          {successData ? (
            /* Success State */
            <div className="text-center py-3">
              <div className="success-check-badge">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <h4 className="fw-bold text-dark mb-1">Presensi Berhasil Dicatat!</h4>
              <p className="text-muted small mb-4">
                Data kehadiran telah terverifikasi ke server presensi SMK.
              </p>

              <div className="bg-light rounded-4 p-3 text-start mb-4 border">
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted small">Nama:</span>
                  <span className="fw-bold text-dark small">{successData.nama}</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted small">NISN / NIP:</span>
                  <span className="font-monospace fw-semibold small">{successData.nisn}</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted small">Kelas / Unit:</span>
                  <span className="fw-semibold small">{successData.kelas}</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted small">Waktu Presensi:</span>
                  <span className="font-monospace fw-bold text-primary small">{successData.waktu}</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted small">Status Kehadiran:</span>
                  <span className="badge bg-success text-white small">{successData.status}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted small">Lokasi Geotag:</span>
                  <span className="text-success small fw-semibold">✓ Di Radius Sekolah (Presisi 3m)</span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-secondary w-50 rounded-pill fw-semibold"
                  onClick={handleReset}
                >
                  Presensi Lagi
                </button>
                <button 
                  className="btn btn-primary w-50 rounded-pill fw-bold"
                  onClick={onClose}
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          ) : (
            /* Input Methods Tabs */
            <div>
              {/* Tab Selector */}
              <div className="d-flex bg-light p-1 rounded-3 mb-4">
                <button
                  type="button"
                  className={`btn btn-sm flex-fill fw-bold rounded-2 ${activeTab === 'demo' ? 'btn-white bg-white shadow-sm text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab('demo')}
                >
                  Pilih Siswa (Demo)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-fill fw-bold rounded-2 ${activeTab === 'manual' ? 'btn-white bg-white shadow-sm text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab('manual')}
                >
                  Ketik NISN
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-fill fw-bold rounded-2 ${activeTab === 'qr' ? 'btn-white bg-white shadow-sm text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab('qr')}
                >
                  Scan QR / Kartu
                </button>
              </div>

              {/* Tab 1: Demo Quick Picker */}
              {activeTab === 'demo' && (
                <div>
                  <label className="form-label small fw-bold text-dark mb-2">
                    Pilih Profil Siswa / Guru untuk Dicoba:
                  </label>
                  <div className="d-flex flex-column gap-2 mb-4">
                    {demoStudents.map((st, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedDemoIndex(index)}
                        className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                          selectedDemoIndex === index 
                            ? 'border-primary bg-primary-subtle' 
                            : 'bg-white'
                        }`}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <div>
                          <div className="fw-bold small text-dark">{st.nama}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            NISN: {st.nisn} • {st.kelas} ({st.jurusan})
                          </div>
                        </div>
                        <span className={`badge ${st.role === 'Guru' ? 'bg-indigo text-white' : 'bg-primary text-white'} rounded-pill`}>
                          {st.role}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-primary w-100 py-2 rounded-pill fw-bold"
                    onClick={handleDemoSubmit}
                  >
                    Simulasikan Tap Kartu Siswa Ini →
                  </button>
                </div>
              )}

              {/* Tab 2: Manual NISN Form */}
              {activeTab === 'manual' && (
                <form onSubmit={handleManualSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Nomor Induk Siswa Nasional (NISN)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Contoh: 0068192031"
                      value={nisnInput}
                      onChange={(e) => setNisnInput(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Nama Lengkap Siswa</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Muhammad Farhan"
                      value={namaInput}
                      onChange={(e) => setNamaInput(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <label className="form-label small fw-bold text-dark">Kelas</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="XII RPL 1"
                        value={kelasInput}
                        onChange={(e) => setKelasInput(e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-dark">Kompetensi Keahlian</label>
                      <select 
                        className="form-select"
                        value={jurusanInput}
                        onChange={(e) => setJurusanInput(e.target.value)}
                      >
                        <option value="RPL">RPL (Rekayasa Perangkat Lunak)</option>
                        <option value="TKJ">TKJ (Teknik Komputer Jaringan)</option>
                        <option value="DKV">DKV (Desain Komunikasi Visual)</option>
                        <option value="TBSM">TBSM (Teknik Sepeda Motor)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-bold">
                    Kirim Data Presensi
                  </button>
                </form>
              )}

              {/* Tab 3: QR Scanner Simulation */}
              {activeTab === 'qr' && (
                <div className="text-center py-2">
                  <div 
                    className="p-4 rounded-4 mb-3 position-relative overflow-hidden" 
                    style={{ background: '#0f172a', border: '2px dashed #3b82f6', minHeight: '190px' }}
                  >
                    {isScanning ? (
                      <div className="py-4">
                        <div className="spinner-border text-primary mb-2" role="status"></div>
                        <div className="text-white small fw-bold">Memindai Barcode / Kartu Pelajar...</div>
                        <div className="text-white-50" style={{ fontSize: '0.75rem' }}>Mendeteksi kode QR RFID...</div>
                      </div>
                    ) : (
                      <div className="py-3">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                          <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                          <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                          <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                          <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                          <line x1="7" y1="12" x2="17" y2="12"/>
                        </svg>
                        <p className="text-white small mb-1">
                          Arahkan Kartu Pelajar ke Kamera atau Scanner Mesin
                        </p>
                        <span className="badge bg-primary px-3 py-1">Kamera Siap</span>
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-primary w-100 py-2 rounded-pill fw-bold"
                    onClick={handleSimulateScan}
                    disabled={isScanning}
                  >
                    {isScanning ? 'Sedang Memindai...' : 'Simulasikan Scan Kartu QR'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
