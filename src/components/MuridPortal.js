import React, { useState } from 'react';

const MuridPortal = ({ currentUser, attendanceRecords, onAddExcuse }) => {
  const [showExcuseModal, setShowExcuseModal] = useState(false);
  const [excuseForm, setExcuseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    status: 'Izin',
    notes: '',
    attachment_url: ''
  });

  // Filter records for this student
  const studentRecords = attendanceRecords.filter(r => 
    r.student_id === currentUser?.student_id || r.student_id === 'STD-001'
  );

  const hadir = studentRecords.filter(r => r.status === 'Hadir').length;
  const izin = studentRecords.filter(r => r.status === 'Izin').length;
  const sakit = studentRecords.filter(r => r.status === 'Sakit').length;
  const alpa = studentRecords.filter(r => r.status === 'Alpa').length;
  const total = hadir + izin + sakit + alpa;
  const percentage = total > 0 ? Math.round((hadir / total) * 100) : 100;

  const handleSubmitExcuse = (e) => {
    e.preventDefault();
    if (!excuseForm.notes.trim()) {
      alert('Mohon isi alasan pengajuan izin/sakit.');
      return;
    }

    onAddExcuse({
      id: 'ATT-IZN-' + Math.floor(100 + Math.random() * 900),
      student_id: currentUser?.student_id || 'STD-001',
      student_name: currentUser?.full_name,
      class_id: currentUser?.class_id || 'CLS-01',
      date: excuseForm.date,
      status: excuseForm.status,
      notes: excuseForm.notes,
      attachment_url: excuseForm.attachment_url
    });

    setShowExcuseModal(false);
    setExcuseForm({
      date: new Date().toISOString().slice(0, 10),
      status: 'Izin',
      notes: '',
      attachment_url: ''
    });
  };

  return (
    <div className="container py-4">
      
      {/* Header Banner */}
      <div className="siam-card p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <span className="badge bg-success-subtle text-success fw-bold px-2.5 py-1 mb-1">
            PORTAL SISWA MANDIRI
          </span>
          <h2 className="h4 fw-bold text-dark mb-0">{currentUser?.full_name}</h2>
          <small className="text-muted font-monospace">
            NISN: {currentUser?.username} • SMK Mawaddah Palengaan
          </small>
        </div>

        <button 
          className="btn-emerald btn-sm rounded-pill px-4"
          onClick={() => setShowExcuseModal(true)}
        >
          <span>+ Ajukan Izin / Sakit Mandiri</span>
        </button>
      </div>

      {/* 5 Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg-2">
          <div className="siam-card p-3 text-center">
            <span className="small text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Tingkat Hadir</span>
            <div className="h3 fw-bold text-success my-1">{percentage}%</div>
            <small className="text-muted" style={{ fontSize: '0.65rem' }}>Syarat Ujian &gt; 85%</small>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="siam-card p-3 text-center">
            <span className="small text-success fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Hadir</span>
            <div className="h3 fw-bold text-success my-1">{hadir}</div>
            <small className="text-muted" style={{ fontSize: '0.65rem' }}>Hari Pembelajaran</small>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-2">
          <div className="siam-card p-3 text-center">
            <span className="small text-info fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Izin</span>
            <div className="h3 fw-bold text-info my-1">{izin}</div>
            <small className="text-muted" style={{ fontSize: '0.65rem' }}>Dispensasi Resmi</small>
          </div>
        </div>

        <div className="col-6 col-md-4 col-lg-3">
          <div className="siam-card p-3 text-center">
            <span className="small text-warning fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Sakit</span>
            <div className="h3 fw-bold text-warning my-1">{sakit}</div>
            <small className="text-muted" style={{ fontSize: '0.65rem' }}>Surat Keterangan</small>
          </div>
        </div>

        <div className="col-12 col-md-4 col-lg-3">
          <div className="siam-card p-3 text-center">
            <span className="small text-danger fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Alpa</span>
            <div className="h3 fw-bold text-danger my-1">{alpa}</div>
            <small className="text-muted" style={{ fontSize: '0.65rem' }}>Tanpa Keterangan</small>
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="siam-card p-4">
        <h3 className="h6 fw-bold text-dark mb-3">Riwayat Presensi Saya</h3>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
            <thead className="table-light">
              <tr>
                <th>Tanggal</th>
                <th>Status Kehadiran</th>
                <th>Keterangan / Catatan</th>
                <th>Lampiran Surat</th>
              </tr>
            </thead>
            <tbody>
              {studentRecords.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    Belum ada riwayat presensi tercatat.
                  </td>
                </tr>
              ) : (
                studentRecords.map(r => {
                  const badgeClass = r.status === 'Hadir' ? 'bg-success' :
                                     r.status === 'Izin' ? 'bg-info' :
                                     r.status === 'Sakit' ? 'bg-warning' : 'bg-danger';

                  return (
                    <tr key={r.id}>
                      <td className="font-monospace fw-semibold">{r.date}</td>
                      <td><span className={`badge ${badgeClass} text-white`}>{r.status}</span></td>
                      <td className="text-muted">{r.notes || '-'}</td>
                      <td>
                        {r.attachment_url ? (
                          <a href={r.attachment_url} target="_blank" rel="noreferrer" className="text-success fw-bold text-decoration-none">
                            Lihat Bukti Surat ↗
                          </a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PENGAJUAN IZIN */}
      {showExcuseModal && (
        <div className="siam-modal-overlay" onClick={() => setShowExcuseModal(false)}>
          <div className="siam-modal-content p-4" onClick={(e) => e.stopPropagation()}>
            <h4 className="h6 fw-bold text-dark mb-2">Pengajuan Izin / Sakit Mandiri</h4>
            <p className="small text-muted mb-3">
              Data izin Anda akan langsung diverifikasi dan masuk ke rekapitulasi sekolah.
            </p>

            <form onSubmit={handleSubmitExcuse}>
              <div className="mb-2">
                <label className="form-label small fw-bold">Tanggal Izin</label>
                <input 
                  type="date"
                  className="form-control form-control-sm"
                  value={excuseForm.date}
                  onChange={(e) => setExcuseForm({ ...excuseForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold">Jenis Keterangan</label>
                <select 
                  className="form-select form-select-sm"
                  value={excuseForm.status}
                  onChange={(e) => setExcuseForm({ ...excuseForm, status: e.target.value })}
                >
                  <option value="Izin">Izin (Keperluan Keluarga / Acara Penting)</option>
                  <option value="Sakit">Sakit (Kondisi Kurang Sehat)</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold">Alasan / Keterangan</label>
                <textarea 
                  className="form-control form-control-sm"
                  rows="3"
                  placeholder="Jelaskan alasan izin Anda secara singkat..."
                  value={excuseForm.notes}
                  onChange={(e) => setExcuseForm({ ...excuseForm, notes: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Link Surat Dokter / Bukti (Google Drive)</label>
                <input 
                  type="url"
                  className="form-control form-control-sm"
                  placeholder="https://drive.google.com/..."
                  value={excuseForm.attachment_url}
                  onChange={(e) => setExcuseForm({ ...excuseForm, attachment_url: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={() => setShowExcuseModal(false)}>Batal</button>
                <button type="submit" className="btn btn-success btn-sm fw-bold">Kirim Pengajuan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MuridPortal;
